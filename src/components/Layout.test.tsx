import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navData, type SearchResult } from '../content';
import { getNotePath, getTopicHash } from '../navigation';
import { loadSearchContent } from '../searchLoader';
import Layout from './Layout';

vi.mock('../searchLoader', () => ({
  loadSearchContent: vi.fn(),
}));

const mockedLoadSearchContent = vi.mocked(loadSearchContent);

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="current location">{location.pathname}{location.hash}</output>;
}

async function getSearchableTopic() {
  for (const section of navData) {
    for (const note of section.notes) {
      const topic = (await note.loadTopics())[0];
      if (topic) return { section, note, topic };
    }
  }
  return undefined;
}

describe('Layout search flow', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  beforeEach(() => {
    mockedLoadSearchContent.mockReset();
    window.history.replaceState(null, '', '/#/');
    document.body.style.overflow = '';
  });

  it('loads the search index, displays results, and navigates to a heading', async () => {
    const target = await getSearchableTopic();
    if (!target) throw new Error('Layout search tests require a topic.');
    const searchResult: SearchResult = {
      kind: 'topic',
      sectionId: target.section.id,
      sectionTitle: target.section.title,
      noteId: target.note.id,
      noteNavigationLabel: target.note.navigationLabel,
      noteTitle: target.note.displayTitle,
      topic: { ...target.topic, description: '', content: '' },
      snippet: '',
      matchKind: 'topic-title',
    };
    mockedLoadSearchContent.mockResolvedValue(() => [searchResult]);

    const { findByRole, getByLabelText } = render(
      <StrictMode>
        <HashRouter>
          <Layout>
            <LocationProbe />
          </Layout>
        </HashRouter>
      </StrictMode>,
    );

    fireEvent.click(getByLabelText('Open search dialog'));
    fireEvent.change(getByLabelText('Search query'), { target: { value: target.topic.title } });

    const resultButton = await findByRole(
      'button',
      {
        name: name => (
          name.includes(target.section.title)
          && name.includes(target.note.displayTitle)
          && name.includes(target.topic.title)
        ),
      },
      { timeout: 8_000 },
    );
    fireEvent.click(resultButton);

    await waitFor(() => {
      expect(getByLabelText('current location').textContent).toBe(
        `${getNotePath(target.section.id, target.note.id)}${getTopicHash(target.topic.id)}`,
      );
      expect(window.location.hash).toBe(
        `#${getNotePath(target.section.id, target.note.id)}${getTopicHash(target.topic.id)}`,
      );
    });
  }, 20_000);

  it('opens a section result at its first note without adding a topic hash', async () => {
    const section = navData[0];
    const note = section?.notes[0];
    if (!section || !note) throw new Error('Layout search tests require a section with a note.');
    const result: SearchResult = {
      kind: 'section',
      sectionId: section.id,
      sectionTitle: section.title,
      noteId: note.id,
      noteNavigationLabel: note.navigationLabel,
      noteTitle: note.displayTitle,
      matchKind: 'section-title',
    };
    mockedLoadSearchContent.mockResolvedValue(() => [result]);

    const { findByRole, getByLabelText } = render(
      <StrictMode>
        <HashRouter>
          <Layout>
            <LocationProbe />
          </Layout>
        </HashRouter>
      </StrictMode>,
    );

    fireEvent.click(getByLabelText('Open search dialog'));
    fireEvent.change(getByLabelText('Search query'), { target: { value: section.title } });
    fireEvent.click(await findByRole(
      'button',
      { name: name => name.includes(section.title) && name.includes('섹션') },
      { timeout: 8000 },
    ));

    await waitFor(() => {
      expect(getByLabelText('current location').textContent).toBe(getNotePath(section.id, note.id));
      expect(window.location.hash).toBe(`#${getNotePath(section.id, note.id)}`);
    });
  }, 10_000);

  it('keeps only one overlay open and restores body scrolling after close', async () => {
    const { getByLabelText, getByRole, queryByRole } = render(
      <HashRouter>
        <Layout>
          <LocationProbe />
        </Layout>
      </HashRouter>,
    );

    fireEvent.click(getByLabelText('Open Mobile Navigation'));
    expect(getByRole('dialog', { name: '학습 노트' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(getByRole('dialog', { name: '노트 검색' })).toBeInTheDocument();
    expect(getByLabelText('Search query')).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() => {
      expect(queryByRole('dialog', { name: '학습 노트' })).not.toBeInTheDocument();
    });

    fireEvent.click(getByLabelText('검색 닫기'));
    await waitFor(() => expect(document.body.style.overflow).toBe(''));
  });
});
