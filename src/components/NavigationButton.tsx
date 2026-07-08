import { ChevronRight, ChevronLeft } from 'lucide-react';
import { navData } from '../data';

type CategoryInfo = {
  sectionId: string;
  sectionTitle: string;
  category: typeof navData[0]['categories'][0];
};

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  info: CategoryInfo;
  onClick: () => void;
}

export default function NavigationButton({ direction, info, onClick }: NavigationButtonProps) {
  const isPrev = direction === 'prev';
  
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col ${isPrev ? 'items-start text-left' : 'items-end text-right'} max-w-[45%]`}
    >
      <span className="text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1 sm:gap-2 py-2">
        {isPrev && <ChevronLeft size={22} className="transition-transform group-hover:-translate-x-1" />}
        {isPrev ? '이전' : '다음'}
        {!isPrev && <ChevronRight size={22} className="transition-transform group-hover:translate-x-1" />}
      </span>
      {/* Tooltip for desktop */}
      <div className={`absolute bottom-full ${isPrev ? 'left-0' : 'right-0'} mb-1 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg px-4 py-2 whitespace-nowrap z-10 shadow-lg transform translate-y-1 group-hover:translate-y-0 hidden sm:block`}>
        <div className={`text-xs text-slate-400 dark:text-slate-500 mb-0.5 font-normal ${!isPrev && 'text-right'}`}>{info.sectionTitle}</div>
        <div>{info.category.title}</div>
      </div>
      {/* Always visible title for mobile */}
      <div className={`text-sm text-slate-500 dark:text-slate-400 truncate w-full sm:hidden mt-1 ${!isPrev && 'text-right'}`}>
        <span className="block text-[11px] text-slate-400 dark:text-slate-500 mb-0.5">{info.sectionTitle}</span>
        <span className="block truncate">{info.category.title}</span>
      </div>
    </button>
  );
}
