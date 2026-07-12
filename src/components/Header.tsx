import { BookMarked, Moon, Sun, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  toggleDark: () => void;
  onOpenSearch: () => void;
  onOpenMobileNav?: () => void;
}

export default function Header({ isDark, toggleDark, onOpenSearch, onOpenMobileNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0"
              aria-label="Open Mobile Navigation"
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-indigo-500 text-white p-2 rounded-xl shadow-sm shrink-0">
              <BookMarked size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">DevNote</h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 leading-tight">Knowledge Base</p>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 relative max-w-lg flex justify-end px-4 sm:px-8">
           <button
             onClick={onOpenSearch}
             className="w-full sm:max-w-xs xl:max-w-sm flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-[#0d1117] text-sm text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
             aria-label="Open search dialog"
           >
             <Search size={16} className="text-slate-400 shrink-0" />
             <span className="flex-1 text-left truncate">검색어 (예: select...)</span>
             <span className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                <span className="text-xs">⌘</span>K
             </span>
           </button>
        </div>

        <button 
          onClick={toggleDark}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  );
}
