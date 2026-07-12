import { useState, useEffect, useMemo, useCallback } from 'react';
import { searchContent } from '../search';

export function useSearch(
  onSelectResult: (sectionId: string, noteId: string, topicId: string) => void,
  onBeforeOpen?: () => void,
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onBeforeOpen?.();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBeforeOpen]);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return [];
    return searchContent(normalizedQuery);
  }, [searchQuery]);

  const handleSelectSearchResult = useCallback((sectionId: string, noteId: string, topicId: string) => {
    onSelectResult(sectionId, noteId, topicId);
    setIsSearchModalOpen(false);
    setSearchQuery('');
  }, [onSelectResult]);

  return {
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchResults,
    handleSelectSearchResult
  };
}
