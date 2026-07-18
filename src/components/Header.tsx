import { BookOpenText, Moon, Sun, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  toggleDark: () => void;
  onOpenSearch: () => void;
  onOpenMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export default function Header({
  isDark,
  toggleDark,
  onOpenSearch,
  onOpenMobileNav,
  isMobileNavOpen = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenMobileNav && (
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0"
              aria-label="Open Mobile Navigation"
              aria-controls="mobile-navigation"
              aria-expanded={isMobileNavOpen}
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          )}
          <Link
            to="/"
            className="group flex items-center gap-2.5 sm:gap-3.5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            aria-label="DevNote 홈으로 이동"
          >
            <div className="relative flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-sky-500 text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.8)] ring-1 ring-white/30 transition-transform duration-200 group-active:-translate-y-0.5 group-active:scale-105 dark:ring-white/10 sm:size-10 shrink-0">
              <BookOpenText size={18} strokeWidth={2.25} className="sm:size-5" />
            </div>
            <div className="hidden sm:block text-left leading-none">
              <h1 className="text-[1.15rem] font-bold tracking-[-0.04em] text-slate-950 dark:text-slate-50">
                Dev<span className="text-indigo-600 dark:text-indigo-400">Note</span>
              </h1>
              <p className="mt-1.5 text-[10px] font-semibold tracking-[0.14em] text-slate-500 dark:text-slate-400">
                개발 학습 노트
              </p>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 relative max-w-lg flex justify-end px-4 sm:px-8">
           <button
             type="button"
             onClick={onOpenSearch}
             className="w-full sm:max-w-xs xl:max-w-sm flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-surface-raised text-sm text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
             aria-label="Open search dialog"
             aria-haspopup="dialog"
             aria-keyshortcuts="Meta+K Control+K"
           >
             <Search size={16} className="text-slate-400 shrink-0" />
             <span className="flex-1 text-left truncate">검색어 (예: select...)</span>
             <span className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                <span className="text-xs">⌘</span>K
             </span>
           </button>
        </div>

        <button 
          type="button"
          onClick={toggleDark}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0"
          aria-label={isDark ? '라이트 모드 사용' : '다크 모드 사용'}
          aria-pressed={isDark}
        >
          {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  );
}
