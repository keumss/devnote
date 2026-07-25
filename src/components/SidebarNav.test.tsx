import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { navData } from '../content';
import { getNotePath } from '../navigation';
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

    const activeLink = screen.getByRole('link', {
      name: `${activeNote.navigationLabel ? `${activeNote.navigationLabel} ` : ''}${activeNote.displayTitle}`,
    });
    const inactiveLink = screen.getByRole('link', {
      name: `${inactiveNote.navigationLabel ? `${inactiveNote.navigationLabel} ` : ''}${inactiveNote.displayTitle}`,
    });

    expect(activeLink).toHaveAttribute('href', getNotePath(section.id, activeNote.id));
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('transition-[color]', 'dark:text-dark-indigo-300');
    expect(inactiveLink).toHaveClass('transition-[color]', 'dark:hover:bg-dark-slate-800/30');
    expect(activeLink).not.toHaveClass('transition-colors');
    expect(inactiveLink).not.toHaveClass('transition-colors');
  });

  it('renders section group headers and sets aria-expanded on section toggles', () => {
    const section = navData[0];
    if (!section) return;

    render(
      <MemoryRouter>
        <SidebarNav activeSectionId={section.id} />
      </MemoryRouter>,
    );

    const sectionButton = screen.getByRole('button', {
      name: (name) => name.includes(section.title),
    });
    expect(sectionButton).toHaveAttribute('aria-expanded', 'true');
  });
});
