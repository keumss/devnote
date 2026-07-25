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
});
