import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { navData } from '../content';
import { getNotePath, getTopicHash } from '../navigation';
import Layout from './Layout';

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="current location">{location.pathname}{location.hash}</output>;
}

describe('Layout search flow', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/#/');
  });

  it('loads the search index, displays results, and navigates to a heading', async () => {
    const target = navData.flatMap(section => (
      section.notes.flatMap(note => note.topics.map(topic => ({ section, note, topic })))
    ))[0];
    if (!target) throw new Error('Layout search tests require a topic.');

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

    const result = await findByRole('button', {
      name: name => (
        name.includes(target.section.title)
        && name.includes(target.note.displayTitle)
        && name.includes(target.topic.title)
      ),
    });
    fireEvent.click(result);

    await waitFor(() => {
      expect(getByLabelText('current location').textContent).toBe(
        `${getNotePath(target.section.id, target.note.id)}${getTopicHash(target.topic.id)}`,
      );
      expect(window.location.hash).toBe(
        `#${getNotePath(target.section.id, target.note.id)}${getTopicHash(target.topic.id)}`,
      );
    });
  });

  it('opens a section result at its first note without adding a topic hash', async () => {
    const section = navData[0];
    const note = section?.notes[0];
    if (!section || !note) throw new Error('Layout search tests require a section with a note.');

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
    fireEvent.click(await findByRole('button', {
      name: name => name.includes(section.title) && name.includes('섹션'),
    }));

    await waitFor(() => {
      expect(getByLabelText('current location').textContent).toBe(getNotePath(section.id, note.id));
      expect(window.location.hash).toBe(`#${getNotePath(section.id, note.id)}`);
    });
  });
});
