import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SearchModal from './SearchModal';
import type { SearchResult } from '../search';

const searchResults: SearchResult[] = [{
  sectionId: 'sql',
  sectionTitle: 'SQL',
  noteId: 'sql-part1',
  noteTitle: 'Part 1: 기초',
  kind: 'topic',
  matchKind: 'topic-title',
  topic: {
    id: 'select',
    title: 'SELECT',
    description: '데이터 조회',
    content: 'SELECT * FROM posts',
  },
}];

const multipleSearchResults: SearchResult[] = [
  ...searchResults,
  {
    sectionId: 'sql',
    sectionTitle: 'SQL',
    noteId: 'sql-part2',
    noteTitle: 'Part 2: 결합',
    kind: 'topic',
    matchKind: 'topic-title',
    topic: {
      id: 'join',
      title: 'JOIN',
      description: '테이블 결합',
      content: 'SELECT * FROM users JOIN posts',
    },
  },
];

describe('SearchModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('focuses the query, closes with Escape, and restores focus', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const onClose = vi.fn();
    const props = {
      onClose,
      searchQuery: '',
      setSearchQuery: vi.fn(),
      searchResults,
      onSelectResult: vi.fn(),
    };
    const { getByLabelText, rerender } = render(
      <SearchModal {...props} isOpen />,
    );

    await waitFor(() => expect(getByLabelText('Search query')).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(<SearchModal {...props} isOpen={false} />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('uses indigo accents for search results', () => {
    render(
      <SearchModal
        isOpen
        onClose={vi.fn()}
        searchQuery="select"
        setSearchQuery={vi.fn()}
        searchResults={searchResults}
        onSelectResult={vi.fn()}
      />,
    );

    const result = screen.getByRole('button', { name: /sql.*part 1.*select/i });
    expect(result).toHaveClass('hover:bg-indigo-50', 'focus:bg-indigo-50');
    expect(result).not.toHaveClass('hover:bg-emerald-50', 'focus:bg-emerald-50');
  });

  it('selects the highlighted result with Arrow keys and Enter', async () => {
    const onSelectResult = vi.fn();
    const { getByLabelText, getByRole } = render(
      <SearchModal
        isOpen
        onClose={vi.fn()}
        searchQuery="query"
        setSearchQuery={vi.fn()}
        searchResults={multipleSearchResults}
        onSelectResult={onSelectResult}
      />,
    );

    const input = getByLabelText('Search query');
    await waitFor(() => expect(getByRole('button', { name: /part 1.*select/i })).toHaveAttribute(
      'aria-current',
      'true',
    ));

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelectResult).toHaveBeenCalledWith(multipleSearchResults[1]);
  });
});
