import { Search, X, ChevronRight, Hash, BookOpenText, FileText } from 'lucide-react';
import type { SearchResult } from '../search';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
}

function getResultTitle(result: SearchResult) {
  if (result.kind === 'topic') return result.topic.title;
  if (result.kind === 'note') return result.noteTitle;
  return `${result.sectionTitle} 섹션`;
}

function getResultDescription(result: SearchResult) {
  if (result.kind === 'topic') return result.topic.description;
  if (result.kind === 'note') return '노트 제목에서 찾음';
  return '섹션 제목에서 찾음';
}

function getMatchLabel(result: SearchResult) {
  switch (result.matchKind) {
    case 'topic-title':
      return '토픽 제목';
    case 'note-title':
      return '노트 제목';
    case 'section-title':
      return '섹션 제목';
    case 'description':
      return '설명';
    case 'content':
      return '본문';
    case 'fuzzy':
      return '유사 검색';
  }
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
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusFrame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

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
            className="relative w-full max-w-2xl bg-white dark:bg-[#0d1117] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-dialog-title"
          >
            <h2 id="search-dialog-title" className="sr-only">노트 검색</h2>
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="노트 검색 (예: select, pydantic...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none bg-transparent px-4 py-4 text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400"
                aria-label="Search query"
              />
              {searchQuery && (
                 <button 
                   type="button"
                   onClick={() => {
                     setSearchQuery('');
                     inputRef.current?.focus();
                   }}
                   className="mr-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                   aria-label="Clear search"
                 >
                   <X size={16} />
                 </button>
              )}
              <div className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400 tracking-widest hidden sm:block">ESC</div>
              <button
                type="button"
                onClick={onClose}
                className="ml-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                aria-label="검색 닫기"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar p-2">
              {searchQuery.trim() === '' ? (
                <div className="py-12 px-6 text-center text-slate-500 dark:text-slate-400">
                  <Search size={32} className="mx-auto mb-3 opacity-20" />
                  <p>검색어를 입력하시면 관련 노트와 주제를 찾아드립니다.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 px-6 text-center text-slate-500 dark:text-slate-400">
                  <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">검색 결과가 없습니다.</p>
                  <p className="text-sm">다른 조합으로 검색해보세요.</p>
                </div>
              ) : (
                <div className="space-y-1" aria-live="polite" aria-label={`${searchResults.length}개의 검색 결과`}>
                  {searchResults.map((result) => (
                    <button
                      type="button"
                      key={result.kind === 'topic'
                        ? `${result.sectionId}-${result.noteId}-${result.topic.id}`
                        : `${result.kind}-${result.sectionId}-${result.noteId}`}
                      onClick={() => onSelectResult(result)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-colors group flex flex-col gap-1.5 focus:outline-none focus:bg-indigo-50 dark:focus:bg-slate-800/80"
                    >
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex-wrap">
                         <span>{result.sectionTitle}</span>
                         <ChevronRight size={12} className="text-slate-400" />
                         <span>{result.kind === 'section' ? '섹션' : result.noteTitle}</span>
                         <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 normal-case tracking-normal">
                           {getMatchLabel(result)}
                         </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.kind === 'topic' ? (
                          <Hash size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                        ) : result.kind === 'note' ? (
                          <FileText size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                        ) : (
                          <BookOpenText size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                        )}
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          {getResultTitle(result)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 pl-6">
                        {getResultDescription(result)}
                      </p>
                    </button>
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
