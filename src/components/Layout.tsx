import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MobileNavDrawer from './MobileNavDrawer';
import SearchModal from './SearchModal';
import { useDarkMode } from '../hooks/useDarkMode';
import { useSearch } from '../hooks/useSearch';

interface LayoutProps {
  children: React.ReactNode;
  activeSectionId?: string;
  activeCategoryId?: string;
}

export default function Layout({ children, activeSectionId, activeCategoryId }: LayoutProps) {
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchResults,
    handleSelectSearchResult
  } = useSearch((sectionId, categoryId, itemId) => {
    navigate(`/${sectionId}/${categoryId}`);
    setTimeout(() => {
      const element = document.getElementById(itemId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  });

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-slate-50 dark:bg-slate-950">
      <Header 
        isDark={isDark} 
        toggleDark={toggle} 
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />
      
      <MobileNavDrawer 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        activeSectionId={activeSectionId}
        activeCategoryId={activeCategoryId}
      />
      
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
