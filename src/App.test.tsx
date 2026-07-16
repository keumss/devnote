import { fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { navData } from './content';
import { getNotePath, getTopicHash } from './navigation';

const searchableTopic = navData.flatMap(section => (
  section.notes.flatMap(note => note.topics.map(topic => ({ section, note, topic })))
))[0];

describe('note search navigation', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/#/');
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('opens the selected note and scrolls to its topic', async () => {
    if (!searchableTopic) throw new Error('App search tests require a topic.');

    const { findByLabelText, findByRole, getByLabelText } = render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>,
    );

    fireEvent.click(await findByLabelText('Open search dialog', {}, { timeout: 8000 }));
    fireEvent.change(getByLabelText('Search query'), { target: { value: searchableTopic.topic.title } });
    fireEvent.click(await findByRole('button', {
      name: name => (
        name.includes(searchableTopic.section.title)
        && name.includes(searchableTopic.note.displayTitle)
        && name.includes(searchableTopic.topic.title)
      ),
    }));

    await waitFor(() => {
      expect(window.location.hash).toBe(
        `#${getNotePath(searchableTopic.section.id, searchableTopic.note.id)}${getTopicHash(searchableTopic.topic.id)}`,
      );
    });
    await findByRole('heading', { name: searchableTopic.topic.title }, { timeout: 5000 });
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  }, 10_000);
});
