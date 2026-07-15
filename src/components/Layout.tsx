import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Header from './Header';
import MobileNavDrawer from './MobileNavDrawer';
import SearchModal from './SearchModal';
import { useDarkMode } from '../hooks/useDarkMode';
import { useSearch } from '../hooks/useSearch';
import type { SearchResult } from '../search';
import { getNotePath, getTopicHash } from '../navigation';

interface LayoutProps {
  children: React.ReactNode;
  activeSectionId?: string;
  activeNoteId?: string;
}

export default function Layout({ children, activeSectionId, activeNoteId }: LayoutProps) {
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSelectResult = useCallback((result: SearchResult) => {
    navigate({
      pathname: getNotePath(result.sectionId, result.noteId),
      hash: result.kind === 'topic' ? getTopicHash(result.topic.id) : '',
    });
  }, [navigate]);

  const closeMobileNavBeforeSearch = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchResults,
    handleSelectSearchResult
  } = useSearch(handleSelectResult, closeMobileNavBeforeSearch);

  useEffect(() => {
    if (!isSearchModalOpen && !isMobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen, isSearchModalOpen]);

  const openSearch = useCallback(() => {
    setIsMobileNavOpen(false);
    setIsSearchModalOpen(true);
  }, [setIsSearchModalOpen]);

  const closeSearch = useCallback(() => {
    setIsSearchModalOpen(false);
  }, [setIsSearchModalOpen]);

  const openMobileNav = useCallback(() => {
    setIsSearchModalOpen(false);
    setIsMobileNavOpen(true);
  }, [setIsSearchModalOpen]);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col transition-colors duration-200 bg-slate-50 dark:bg-slate-950">
        <Header
          isDark={isDark}
          toggleDark={toggle}
          onOpenSearch={openSearch}
          onOpenMobileNav={openMobileNav}
          isMobileNavOpen={isMobileNavOpen}
        />

        <MobileNavDrawer
          isOpen={isMobileNavOpen}
          onClose={closeMobileNav}
          activeSectionId={activeSectionId}
          activeNoteId={activeNoteId}
        />

        <div className="flex-1 flex flex-col">
          {children}
        </div>

        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={closeSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSelectResult={handleSelectSearchResult}
        />
      </div>
    </MotionConfig>
  );
}
