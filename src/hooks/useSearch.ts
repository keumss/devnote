import { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import type { SearchResult } from '../content';
import { loadSearchContent, type SearchContent } from '../searchLoader';

export type SearchLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useSearch(
  onSelectResult: (result: SearchResult) => void,
  onOpen: () => void,
  isOpen: boolean,
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchContent, setSearchContent] = useState<SearchContent | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchLoadStatus>('idle');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const prepareSearch = useCallback(async () => {
    if (searchContent) return;

    setSearchStatus('loading');
    try {
      const loadedSearch = await loadSearchContent();
      setSearchContent(() => loadedSearch);
      setSearchStatus('ready');
    } catch {
      setSearchStatus('error');
    }
  }, [searchContent]);

  useEffect(() => {
    if (isOpen) void prepareSearch();
  }, [isOpen, prepareSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        void prepareSearch();
        onOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen, prepareSearch]);

  const searchResults = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim();
    if (!normalizedQuery || !searchContent) return [];
    return searchContent(normalizedQuery);
  }, [deferredSearchQuery, searchContent]);

  const handleSelectSearchResult = useCallback((result: SearchResult) => {
    onSelectResult(result);
    setSearchQuery('');
  }, [onSelectResult]);

  return {
    searchQuery,
    searchResultQuery: deferredSearchQuery,
    setSearchQuery,
    searchResults,
    searchStatus,
    prepareSearch,
    retrySearch: prepareSearch,
    handleSelectSearchResult,
  };
}
