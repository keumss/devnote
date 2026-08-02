import { cleanup, render, within } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import TopNoteNavigation from './TopNoteNavigation';
import type { Note } from '../content';

const mockPrevNote = {
  sectionId: 'python',
  sectionTitle: 'Python',
  note: { id: 'python-part1', title: 'Python 기초' } as Note,
};

const mockNextNote = {
  sectionId: 'python',
  sectionTitle: 'Python',
  note: { id: 'python-part3', title: 'Python 고급' } as Note,
};

describe('TopNoteNavigation', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders previous and next note links when both are available', () => {
    const { getByRole } = render(
      <HashRouter>
        <TopNoteNavigation prevNoteInfo={mockPrevNote} nextNoteInfo={mockNextNote} />
      </HashRouter>,
    );

    const prevLink = getByRole('link', { name: `이전 노트: ${mockPrevNote.note.title}` });
    const nextLink = getByRole('link', { name: `다음 노트: ${mockNextNote.note.title}` });
    const navigation = getByRole('navigation', { name: '노트 상단 빠른 이동' });

    expect(prevLink).toHaveAttribute('href', '#/python/python-part1');
    expect(nextLink).toHaveAttribute('href', '#/python/python-part3');
    expect(within(prevLink).getByText('이전')).toBeInTheDocument();
    expect(within(nextLink).getByText('다음')).toBeInTheDocument();
    expect(navigation).toHaveClass('h-11', 'w-32', 'grid-cols-2', 'divide-x', 'shrink-0');
    expect(prevLink).toHaveClass('h-11', 'w-16');
    expect(nextLink).toHaveClass('h-11', 'w-16');
  });

  it('disables previous button when prevNoteInfo is null', () => {
    const { getByRole } = render(
      <HashRouter>
        <TopNoteNavigation prevNoteInfo={null} nextNoteInfo={mockNextNote} />
      </HashRouter>,
    );

    const prevButton = getByRole('button', { name: '이전 노트 없음' });
    expect(prevButton).toBeDisabled();
    expect(within(prevButton).getByText('이전')).toBeInTheDocument();
    expect(prevButton).toHaveClass('h-11', 'w-16');

    const nextLink = getByRole('link', { name: `다음 노트: ${mockNextNote.note.title}` });
    expect(nextLink).toBeInTheDocument();
  });

  it('disables next button when nextNoteInfo is null', () => {
    const { getByRole } = render(
      <HashRouter>
        <TopNoteNavigation prevNoteInfo={mockPrevNote} nextNoteInfo={null} />
      </HashRouter>,
    );

    const prevLink = getByRole('link', { name: `이전 노트: ${mockPrevNote.note.title}` });
    expect(prevLink).toBeInTheDocument();

    const nextButton = getByRole('button', { name: '다음 노트 없음' });
    expect(nextButton).toBeDisabled();
    expect(within(nextButton).getByText('다음')).toBeInTheDocument();
    expect(nextButton).toHaveClass('h-11', 'w-16');
  });
});
