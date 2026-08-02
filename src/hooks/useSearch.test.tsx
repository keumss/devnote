import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchResult } from '../content';
import { loadSearchContent } from '../searchLoader';
import { useSearch } from './useSearch';

vi.mock('../searchLoader', () => ({
  loadSearchContent: vi.fn(),
}));

const mockedLoadSearchContent = vi.mocked(loadSearchContent);
const resultItem: SearchResult = {
  kind: 'note',
  sectionId: 'section-a',
  sectionTitle: 'Section A',
  noteId: 'note-a',
  noteTitle: 'Note A',
  matchKind: 'note-title',
};

describe('useSearch', () => {
  beforeEach(() => {
    mockedLoadSearchContent.mockReset();
  });

  it('loads the search implementation only after opening and searches once ready', async () => {
    const searchContent = vi.fn(() => [resultItem]);
    mockedLoadSearchContent.mockResolvedValue(searchContent);
    const { result, rerender } = renderHook(
      ({ isOpen }) => useSearch(vi.fn(), vi.fn(), isOpen),
      { initialProps: { isOpen: false } },
    );

    expect(result.current.searchStatus).toBe('idle');
    expect(mockedLoadSearchContent).not.toHaveBeenCalled();

    rerender({ isOpen: true });
    await waitFor(() => expect(result.current.searchStatus).toBe('ready'));
    expect(mockedLoadSearchContent).toHaveBeenCalledOnce();

    act(() => result.current.setSearchQuery('Note A'));
    expect(searchContent).toHaveBeenCalledWith('Note A');
    expect(result.current.searchResults).toEqual([resultItem]);
  });

  it('uses a query entered while the search implementation is loading', async () => {
    let resolveSearch: ((searchContent: (query: string) => SearchResult[]) => void) | undefined;
    const pendingSearch = new Promise<(query: string) => SearchResult[]>(resolve => {
      resolveSearch = resolve;
    });
    const searchContent = vi.fn(() => [resultItem]);
    mockedLoadSearchContent.mockReturnValue(pendingSearch);
    const { result } = renderHook(() => useSearch(vi.fn(), vi.fn(), true));

    act(() => result.current.setSearchQuery('typed early'));
    expect(result.current.searchStatus).toBe('loading');
    expect(result.current.searchResults).toEqual([]);

    await act(async () => {
      resolveSearch?.(searchContent);
      await pendingSearch;
    });

    expect(result.current.searchStatus).toBe('ready');
    expect(searchContent).toHaveBeenCalledWith('typed early');
    expect(result.current.searchResults).toEqual([resultItem]);
  });

  it('reports a load failure and retries successfully', async () => {
    mockedLoadSearchContent
      .mockRejectedValueOnce(new Error('chunk failed'))
      .mockResolvedValueOnce(() => [resultItem]);
    const { result } = renderHook(() => useSearch(vi.fn(), vi.fn(), true));

    await waitFor(() => expect(result.current.searchStatus).toBe('error'));
    await act(async () => {
      await result.current.retrySearch();
    });
    expect(result.current.searchStatus).toBe('ready');
    expect(mockedLoadSearchContent).toHaveBeenCalledTimes(2);
  });
});
