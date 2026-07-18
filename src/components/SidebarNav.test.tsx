import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { navData } from '../content';
import SidebarNav from './SidebarNav';

describe('SidebarNav', () => {
  afterEach(() => {
    cleanup();
  });

  it('changes note backgrounds immediately while keeping text transitions', () => {
    const section = navData.find(item => item.notes.length >= 2) ?? navData[0];
    const activeNote = section?.notes[0];
    const inactiveNote = section?.notes[1];

    expect(section).toBeDefined();
    expect(activeNote).toBeDefined();
    expect(inactiveNote).toBeDefined();
    if (!section || !activeNote || !inactiveNote) return;

    render(
      <MemoryRouter>
        <SidebarNav activeSectionId={section.id} activeNoteId={activeNote.id} />
      </MemoryRouter>,
    );

    const activeButton = screen.getByRole('button', {
      name: `${activeNote.navigationLabel ? `${activeNote.navigationLabel} ` : ''}${activeNote.displayTitle}`,
    });
    const inactiveButton = screen.getByRole('button', {
      name: `${inactiveNote.navigationLabel ? `${inactiveNote.navigationLabel} ` : ''}${inactiveNote.displayTitle}`,
    });

    expect(activeButton).toHaveClass('transition-[color]', 'dark:text-dark-indigo-300');
    expect(inactiveButton).toHaveClass('transition-[color]', 'dark:hover:bg-dark-slate-800/30');
    expect(activeButton).not.toHaveClass('transition-colors');
    expect(inactiveButton).not.toHaveClass('transition-colors');
  });
});
