import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Note } from '../content';
import { getNotePath } from '../navigation';

type NoteInfo = {
  sectionId: string;
  sectionTitle: string;
  note: Note;
};

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  info: NoteInfo;
}

export default function NavigationButton({ direction, info }: NavigationButtonProps) {
  const isPrev = direction === 'prev';

  return (
    <Link
      to={getNotePath(info.sectionId, info.note.id)}
      onMouseEnter={() => void info.note.preload()}
      onFocus={() => void info.note.preload()}
      aria-label={`${isPrev ? '이전' : '다음'} 노트로 이동: ${info.note.title}`}
      className={`group flex min-h-28 sm:min-h-32 w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 sm:p-4 outline-none transition-[border-color,box-shadow,color,transform] duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xs active:scale-[0.99] focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-dark-slate-800 dark:bg-dark-slate-900/40 dark:hover:border-dark-indigo-500/50 dark:hover:bg-dark-indigo-500/10 dark:hover:shadow-dark-indigo-950/20 dark:focus-visible:border-dark-indigo-400 dark:focus-visible:ring-dark-indigo-400/50 [backface-visibility:hidden] [transform-style:preserve-3d] ${
        isPrev
          ? 'items-start text-left sm:justify-self-start'
          : 'items-end text-right col-start-2 sm:justify-self-end'
      }`}
    >
      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors duration-200 group-hover:text-indigo-600 group-focus-visible:text-indigo-600 dark:text-dark-slate-400 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300">
        {isPrev && <ChevronLeft size={15} strokeWidth={2.2} className="transition-transform duration-200 group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5" />}
        {isPrev ? '이전' : '다음'}
        {!isPrev && <ChevronRight size={15} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" />}
      </span>
      <div className="mt-3.5 w-full">
        <span className="block text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-dark-slate-500 truncate">{info.sectionTitle}</span>
        <span className="mt-1 block text-xs sm:text-sm font-bold leading-snug text-slate-800 transition-colors duration-200 group-hover:text-indigo-600 group-focus-visible:text-indigo-600 dark:text-dark-slate-100 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300 line-clamp-2">
          {info.note.title}
        </span>
      </div>
    </Link>
  );
}
