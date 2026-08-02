import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { navData } from '../content';
import { getNotePath } from '../navigation';
import NotePage from './NotePage';

const noteSequence = navData.flatMap(section => (
  section.notes.map(note => ({ section, note }))
));
const previousNote = noteSequence[0];
const currentNote = noteSequence[1];
const nextNote = noteSequence[2];

describe('NotePage note navigation', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', `/#${getNotePath(currentNote.section.id, currentNote.note.id)}`);
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('shows adjacent notes and navigates to the selected note', async () => {
    const nextTopics = await nextNote.note.loadTopics();
    const { findByRole, findByTitle } = render(
      <StrictMode>
        <HashRouter>
          <Routes>
            <Route path="/:sectionId/:noteId" element={<NotePage />} />
          </Routes>
        </HashRouter>
      </StrictMode>,
    );

    const previousLink = await findByRole('link', { name: `이전 노트로 이동: ${previousNote.note.title}` });
    const nextLink = await findByRole('link', { name: `다음 노트로 이동: ${nextNote.note.title}` });

    expect(previousLink.parentElement).toBe(nextLink.parentElement);
    expect(previousLink.parentElement).toHaveClass('grid-cols-2');
    expect(within(previousLink).getByText(previousNote.section.title)).toBeInTheDocument();
    expect(within(nextLink).getByText(nextNote.section.title)).toBeInTheDocument();

    const topPreviousLink = await findByRole('link', { name: `이전 노트: ${previousNote.note.title}` });
    const topNextLink = await findByRole('link', { name: `다음 노트: ${nextNote.note.title}` });
    expect(topPreviousLink).toBeInTheDocument();
    expect(topNextLink).toBeInTheDocument();

    const sectionBadge = await findByTitle(currentNote.section.title);
    expect(sectionBadge).toHaveClass('min-w-0', 'truncate');

    fireEvent.click(nextLink);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${getNotePath(nextNote.section.id, nextNote.note.id)}`);
    });
    await findByRole(
      'heading',
      { name: nextTopics[0].title },
      { timeout: 8000 },
    );
  }, 10_000);

  it('opens the inline topic navigation by default', async () => {
    const currentTopics = await currentNote.note.loadTopics();
    const { container, findByRole } = render(
      <StrictMode>
        <HashRouter>
          <Routes>
            <Route path="/:sectionId/:noteId" element={<NotePage />} />
          </Routes>
        </HashRouter>
      </StrictMode>,
    );

    const topicNavigation = container.querySelector('details');

    expect(topicNavigation).toHaveAttribute('open');
    await findByRole(
      'heading',
      { name: currentTopics[0].title },
      { timeout: 8000 },
    );
  }, 10_000);
});
