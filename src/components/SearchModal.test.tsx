import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SearchModal from './SearchModal';
import type { SearchResult } from '../search';

const searchResults: SearchResult[] = [{
  sectionId: 'section-a',
  sectionTitle: 'Section A',
  noteId: 'note-1',
  noteTitle: 'Note 1',
  kind: 'topic',
  matchKind: 'topic-title',
  topic: {
    id: 'topic-a',
    title: 'Topic A',
    description: 'Example topic',
    content: 'Example topic content',
  },
}];

const multipleSearchResults: SearchResult[] = [
  ...searchResults,
  {
    sectionId: 'section-a',
    sectionTitle: 'Section A',
    noteId: 'note-2',
    noteTitle: 'Note 2',
    kind: 'topic',
    matchKind: 'topic-title',
    topic: {
      id: 'topic-b',
      title: 'Topic B',
      description: 'Another example topic',
      content: 'Another example topic content',
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
        searchQuery="topic"
        setSearchQuery={vi.fn()}
        searchResults={searchResults}
        onSelectResult={vi.fn()}
      />,
    );

    const result = screen.getByRole('button', { name: /section a.*note 1.*topic a/i });
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
    await waitFor(() => expect(getByRole('button', { name: /note 1.*topic a/i })).toHaveAttribute(
      'aria-current',
      'true',
    ));

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelectResult).toHaveBeenCalledWith(multipleSearchResults[1]);
  });
});
