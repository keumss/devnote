import { fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { navData, type SearchResult } from './content';
import { getNotePath, getTopicHash } from './navigation';
import { loadSearchContent } from './searchLoader';

vi.mock('./searchLoader', () => ({
  loadSearchContent: vi.fn(),
}));

const mockedLoadSearchContent = vi.mocked(loadSearchContent);

async function getSearchableTopic() {
  for (const section of navData) {
    for (const note of section.notes) {
      const topic = (await note.loadTopics())[0];
      if (topic) return { section, note, topic };
    }
  }
  return undefined;
}

describe('note search navigation', () => {
  beforeEach(() => {
    mockedLoadSearchContent.mockReset();
    window.history.replaceState(null, '', '/#/');
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('opens the selected note and scrolls to its topic', async () => {
    const searchableTopic = await getSearchableTopic();
    if (!searchableTopic) throw new Error('App search tests require a topic.');
    const result: SearchResult = {
      kind: 'topic',
      sectionId: searchableTopic.section.id,
      sectionTitle: searchableTopic.section.title,
      noteId: searchableTopic.note.id,
      noteNavigationLabel: searchableTopic.note.navigationLabel,
      noteTitle: searchableTopic.note.displayTitle,
      topic: {
        ...searchableTopic.topic,
        description: '',
        content: '',
      },
      snippet: '',
      matchKind: 'topic-title',
    };
    mockedLoadSearchContent.mockResolvedValue(() => [result]);

    const { findByLabelText, findByRole, getByLabelText } = render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>,
    );

    fireEvent.click(await findByLabelText('Open search dialog', {}, { timeout: 8000 }));
    fireEvent.change(getByLabelText('Search query'), { target: { value: searchableTopic.topic.title } });
    fireEvent.click(await findByRole(
      'button',
      {
        name: name => (
          name.includes(searchableTopic.section.title)
          && name.includes(searchableTopic.note.displayTitle)
          && name.includes(searchableTopic.topic.title)
        ),
      },
      { timeout: 8_000 },
    ));

    await waitFor(() => {
      expect(window.location.hash).toBe(
        `#${getNotePath(searchableTopic.section.id, searchableTopic.note.id)}${getTopicHash(searchableTopic.topic.id)}`,
      );
    });
    await findByRole('heading', { name: searchableTopic.topic.title }, { timeout: 15_000 });
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  }, 25_000);
});
