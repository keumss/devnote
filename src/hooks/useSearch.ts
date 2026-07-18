import { useState, useEffect, useMemo, useCallback } from 'react';
import { searchContent, type SearchResult } from '../search';

export function useSearch(
  onSelectResult: (result: SearchResult) => void,
  onOpen: () => void,
) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return [];
    return searchContent(normalizedQuery);
  }, [searchQuery]);

  const handleSelectSearchResult = useCallback((result: SearchResult) => {
    onSelectResult(result);
    setSearchQuery('');
  }, [onSelectResult]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSelectSearchResult
  };
}
