import { Search, X } from 'lucide-react';
import type { SearchResult } from '../search';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import SearchResultItem from './SearchResultItem';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectResult
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);

  useDialogFocus({
    isOpen,
    onClose,
    dialogRef,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    setActiveResultIndex(searchResults.length > 0 ? 0 : -1);
  }, [searchQuery, searchResults]);

  useEffect(() => {
    if (activeResultIndex < 0) return;

    const activeResult = resultRefs.current[activeResultIndex];
    if (typeof activeResult?.scrollIntoView === 'function') {
      activeResult.scrollIntoView({ block: 'nearest' });
    }
  }, [activeResultIndex]);

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResultIndex(currentIndex => Math.min(
        currentIndex < 0 ? 0 : currentIndex + 1,
        searchResults.length - 1,
      ));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResultIndex(currentIndex => Math.max(
        currentIndex < 0 ? searchResults.length - 1 : currentIndex - 1,
        0,
      ));
      return;
    }

    if (event.key === 'Enter' && activeResultIndex >= 0) {
      event.preventDefault();
      const selectedResult = searchResults[activeResultIndex] ?? searchResults[0];
      onSelectResult(selectedResult);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Click outside to close */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
            onClick={onClose} 
            aria-hidden="true" 
          />
          
          <motion.div 
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-surface-raised rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-dark-slate-800 flex flex-col max-h-[80vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-dialog-title"
          >
            <h2 id="search-dialog-title" className="sr-only">노트 검색</h2>
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-dark-slate-800">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="노트 검색 (예: select, pydantic...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 outline-none bg-transparent px-4 py-4 text-base sm:text-lg text-slate-900 dark:text-dark-slate-100 placeholder-slate-400"
                aria-label="Search query"
                aria-controls="search-results"
                aria-describedby="search-keyboard-hint"
              />
              {searchQuery && (
                 <button 
                   type="button"
                   onClick={() => {
                     setSearchQuery('');
                     inputRef.current?.focus();
                   }}
                   className="mr-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-dark-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-dark-slate-300 transition-[color] focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                   aria-label="Clear search"
                 >
                   <X size={16} />
                 </button>
              )}
              <div className="px-2 py-1 rounded bg-slate-100 dark:bg-dark-slate-800 text-[10px] font-bold text-slate-400 tracking-widest hidden sm:block">ESC</div>
              <button
                type="button"
                onClick={onClose}
                className="ml-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-dark-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-dark-slate-300 transition-[color] focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                aria-label="검색 닫기"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar p-2">
              <p id="search-keyboard-hint" className="sr-only">
                화살표 키로 검색 결과를 고르고 Enter 키로 엽니다.
              </p>
              {searchQuery.trim() === '' ? (
                <div className="py-12 px-6 text-center text-slate-500 dark:text-dark-slate-400">
                  <Search size={32} className="mx-auto mb-3 opacity-20" />
                  <p>검색어를 입력하시면 관련 노트와 주제를 찾아드립니다.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 px-6 text-center text-slate-500 dark:text-dark-slate-400">
                  <p className="font-medium text-slate-900 dark:text-dark-slate-100 mb-1">검색 결과가 없습니다.</p>
                  <p className="text-sm">다른 조합으로 검색해보세요.</p>
                </div>
              ) : (
                <div id="search-results" className="space-y-1" aria-live="polite" aria-label={`${searchResults.length}개의 검색 결과`}>
                  {searchResults.map((result, index) => (
                    <SearchResultItem
                      key={result.kind === 'topic'
                        ? `${result.sectionId}-${result.noteId}-${result.topic.id}`
                        : `${result.kind}-${result.sectionId}-${result.noteId}`}
                      result={result}
                      query={searchQuery}
                      isActive={activeResultIndex === index}
                      buttonRef={(element) => {
                        resultRefs.current[index] = element;
                      }}
                      onActivate={() => setActiveResultIndex(index)}
                      onSelect={() => onSelectResult(result)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
