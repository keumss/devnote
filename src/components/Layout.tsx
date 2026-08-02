import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyMotion, MotionConfig } from 'motion/react';
import Header from './Header';
import Footer from './Footer';
import MobileNavDrawer from './MobileNavDrawer';
import SearchModal from './SearchModal';
import { useDarkMode } from '../hooks/useDarkMode';
import { useSearch } from '../hooks/useSearch';
import type { SearchResult } from '../content';
import { getNotePath, getTopicHash } from '../navigation';

type ActiveOverlay = 'search' | 'mobile-nav' | null;

const loadMotionFeatures = () => import('../motionFeatures').then(module => module.default);

interface LayoutProps {
  children: React.ReactNode;
  activeSectionId?: string;
  activeNoteId?: string;
}

export default function Layout({ children, activeSectionId, activeNoteId }: LayoutProps) {
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const isSearchModalOpen = activeOverlay === 'search';
  const isMobileNavOpen = activeOverlay === 'mobile-nav';

  const openSearch = useCallback(() => {
    setActiveOverlay('search');
  }, []);

  const handleSelectResult = useCallback((result: SearchResult) => {
    navigate({
      pathname: getNotePath(result.sectionId, result.noteId),
      hash: result.kind === 'topic' ? getTopicHash(result.topic.id) : '',
    });
    setActiveOverlay(null);
  }, [navigate]);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchStatus,
    prepareSearch,
    retrySearch,
    handleSelectSearchResult,
  } = useSearch(handleSelectResult, openSearch, isSearchModalOpen);

  useEffect(() => {
    if (activeOverlay === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeOverlay]);

  const closeSearch = useCallback(() => {
    setActiveOverlay(null);
  }, []);

  const openMobileNav = useCallback(() => {
    setActiveOverlay('mobile-nav');
  }, []);

  const closeMobileNav = useCallback(() => {
    setActiveOverlay(null);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-slate-950">
          <Header
            isDark={isDark}
            toggleDark={toggle}
            onOpenSearch={openSearch}
            onPrepareSearch={prepareSearch}
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

          <Footer />

          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={closeSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            searchStatus={searchStatus}
            onRetry={retrySearch}
            onSelectResult={handleSelectSearchResult}
          />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
