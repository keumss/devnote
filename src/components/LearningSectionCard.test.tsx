import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { navData } from '../content';
import { getNotePath } from '../navigation';
import LearningSectionCard from './LearningSectionCard';

describe('LearningSectionCard', () => {
  it('renders every note as a route link', () => {
    const section = navData[0];
    const { getByRole } = render(
      <MemoryRouter>
        <LearningSectionCard section={section} index={0} />
      </MemoryRouter>,
    );
    const card = getByRole('article');

    for (const note of section.notes) {
      const accessibleTitle = note.navigationLabel
        ? `${note.navigationLabel} ${note.displayTitle}`
        : note.displayTitle;
      expect(within(card).getByRole('link', { name: accessibleTitle })).toHaveAttribute(
        'href',
        getNotePath(section.id, note.id),
      );
    }
  });
});
