import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { navData } from '../content';

type SearchResultItem = {
  sectionId: string;
  sectionTitle: string;
  categoryId: string;
  categoryTitle: string;
  item: typeof navData[0]['categories'][0]['items'][0];
};

export function useSearch(onSelectResult: (sectionId: string, categoryId: string, itemId: string) => void) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchModalOpen]);

  // Flatten data for Fuse
  const flatData = useMemo(() => {
    const results: SearchResultItem[] = [];
    navData.forEach(section => {
      section.categories.forEach(category => {
        category.items.forEach(item => {
          results.push({
            sectionId: section.id,
            sectionTitle: section.title,
            categoryId: category.id,
            categoryTitle: category.title,
            item
          });
        });
      });
    });
    return results;
  }, []);

  const fuse = useMemo(() => new Fuse(flatData, {
    keys: ['item.title', 'item.description', 'item.content'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), [flatData]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse]);

  const handleSelectSearchResult = (sectionId: string, categoryId: string, itemId: string) => {
    onSelectResult(sectionId, categoryId, itemId);
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchResults,
    handleSelectSearchResult
  };
}
