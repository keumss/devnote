import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchModal from './SearchModal';

const searchResults = [{
  sectionId: 'sql',
  sectionTitle: 'SQL',
  categoryId: 'sql-part1',
  categoryTitle: 'Part 1: 기초',
  item: {
    id: 'select',
    title: 'SELECT',
    description: '데이터 조회',
    content: 'SELECT * FROM posts',
  },
}];

describe('SearchModal', () => {
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
});
