import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { navData } from '../content';
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
  ] as const)('shows %s navigation details and invokes its callback', (direction, label) => {
    const onClick = vi.fn();
    const { getByRole, getByText } = render(
      <NavigationButton
        direction={direction}
        info={{ sectionId: section.id, sectionTitle: section.title, note }}
        onClick={onClick}
      />,
    );

    const button = getByRole('button', { name: `${label} 노트로 이동: ${note.title}` });
    expect(within(button).getByText(label)).toBeInTheDocument();
    expect(within(button).getByText(section.title)).toBeInTheDocument();
    expect(within(button).getByText(note.title)).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
