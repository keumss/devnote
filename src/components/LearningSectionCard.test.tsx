import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { navData } from '../content';
import { getNotePath } from '../navigation';
import LearningSectionCard from './LearningSectionCard';

describe('LearningSectionCard', () => {
  it('renders section title and links to section first note route', () => {
    const section = navData[0];
    const { getByRole } = render(
      <MemoryRouter>
        <LearningSectionCard section={section} index={0} />
      </MemoryRouter>,
    );
    const card = getByRole('article');
    const firstNote = section.notes[0];

    const sectionLink = within(card).getByRole('link', {
      name: (name) => name.includes(section.title),
    });
    expect(sectionLink).toHaveAttribute(
      'href',
      getNotePath(section.id, firstNote.id),
    );
  });

  it('renders isCurrentSection badge when isCurrentSection is true', () => {
    const section = navData[0];
    const { getByText } = render(
      <MemoryRouter>
        <LearningSectionCard section={section} index={0} isCurrentSection />
      </MemoryRouter>,
    );
    expect(getByText('학습 중')).toBeInTheDocument();
  });

  it('changes card surfaces immediately while keeping text transitions', () => {
    const section = navData[0];
    const { container } = render(
      <MemoryRouter>
        <LearningSectionCard section={section} index={0} isCurrentSection />
      </MemoryRouter>,
    );
    const card = within(container).getByRole('article');
    const sectionLink = within(card).getByRole('link', {
      name: (name) => name.includes(section.title),
    });
    const sectionNumber = within(sectionLink).getByText('01');
    const sectionTitle = within(sectionLink).getByRole('heading', {
      name: section.title,
    });

    expect(sectionLink).toHaveClass('transition-[color]', 'ring-1');
    expect(sectionLink).not.toHaveClass('transition-all');
    expect(sectionLink).not.toHaveClass('transition-colors');
    expect(sectionNumber).toHaveClass('transition-[color]');
    expect(sectionNumber).not.toHaveClass('transition-colors');
    expect(sectionTitle).toHaveClass('transition-[color]');
    expect(sectionTitle).not.toHaveClass('transition-colors');
  });
});
