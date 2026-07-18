import { cleanup, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { navData } from '../content';
import { getNotePath } from '../navigation';
import NavigationButton from './NavigationButton';

const section = navData[0];
const note = section.notes[0];

describe('NavigationButton', () => {
  afterEach(() => {
    cleanup();
  });

  it.each([
    ['prev', '이전'],
    ['next', '다음'],
  ] as const)('shows %s navigation details and links to the note', (direction, label) => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <NavigationButton
          direction={direction}
          info={{ sectionId: section.id, sectionTitle: section.title, note }}
        />
      </MemoryRouter>,
    );

    const link = getByRole('link', { name: `${label} 노트로 이동: ${note.title}` });
    expect(link).toHaveAttribute('href', getNotePath(section.id, note.id));
    expect(within(link).getByText(label)).toBeInTheDocument();
    expect(within(link).getByText(section.title)).toBeInTheDocument();
    expect(within(link).getByText(note.title)).toBeInTheDocument();
    expect(link).toHaveClass(
      'transition-[border-color,box-shadow,color]',
      'dark:hover:bg-dark-indigo-500/10',
    );
    expect(link).not.toHaveClass('transition-[border-color,background-color,box-shadow,color]');
  });

  it('places a next-note card in the second grid column at every viewport size', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <NavigationButton
          direction="next"
          info={{ sectionId: section.id, sectionTitle: section.title, note }}
        />
      </MemoryRouter>,
    );

    expect(getByRole('link', { name: `다음 노트로 이동: ${note.title}` })).toHaveClass('col-start-2');
  });
});
