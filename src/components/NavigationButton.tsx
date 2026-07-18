import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Note } from '../content';

type NoteInfo = {
  sectionId: string;
  sectionTitle: string;
  note: Note;
};

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  info: NoteInfo;
  onClick: () => void;
}

export default function NavigationButton({ direction, info, onClick }: NavigationButtonProps) {
  const isPrev = direction === 'prev';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${isPrev ? '이전' : '다음'} 노트로 이동: ${info.note.title}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={`group flex min-h-32 w-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 outline-none transition-[border-color,box-shadow,color] duration-200 hover:border-indigo-300 hover:bg-indigo-50/70 hover:shadow-md focus-visible:border-indigo-500 focus-visible:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-dark-slate-800 dark:bg-dark-slate-900/40 dark:hover:border-dark-indigo-400/60 dark:hover:bg-dark-indigo-500/10 dark:hover:shadow-dark-indigo-950/20 dark:focus-visible:border-dark-indigo-400 dark:focus-visible:bg-dark-indigo-500/10 dark:focus-visible:ring-dark-indigo-400 dark:focus-visible:ring-offset-dark-slate-950 ${
        isPrev
          ? 'items-start text-left sm:justify-self-start'
          : 'items-end text-right col-start-2 sm:justify-self-end'
      }`}
    >
      <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-700 group-focus-visible:text-indigo-700 dark:text-dark-slate-400 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300">
        {isPrev && <ChevronLeft size={16} strokeWidth={2.5} className="transition-transform duration-200 group-hover:-translate-x-1 group-focus-visible:-translate-x-1" />}
        {isPrev ? '이전' : '다음'}
        {!isPrev && <ChevronRight size={16} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />}
      </span>
      <div className="mt-5 w-full">
        <span className="block text-xs font-semibold text-slate-400 dark:text-dark-slate-500">{info.sectionTitle}</span>
        <span className="mt-1.5 block text-sm font-bold leading-snug text-slate-800 transition-colors duration-200 group-hover:text-indigo-800 group-focus-visible:text-indigo-800 dark:text-dark-slate-100 dark:group-hover:text-dark-indigo-200 dark:group-focus-visible:text-dark-indigo-200 sm:text-base">
          {info.note.title}
        </span>
      </div>
    </motion.button>
  );
}
