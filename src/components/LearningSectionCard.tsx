import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Section } from '../content';
import { getNotePath } from '../navigation';

interface LearningSectionCardProps {
  section: Section;
  index: number;
}

export default function LearningSectionCard({ section, index }: LearningSectionCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="flex flex-col gap-2.5 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-dark-slate-800 dark:bg-surface-raised sm:flex-row sm:items-center sm:gap-4 sm:p-4.5"
    >
      <div className="flex shrink-0 items-center gap-2.5 border-b border-slate-100 pb-2 dark:border-dark-slate-800/80 sm:w-48 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 dark:sm:border-dark-slate-800/80 lg:w-52 lg:pr-5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-[10px] font-extrabold text-indigo-600 dark:bg-dark-indigo-500/15 dark:text-dark-indigo-300 sm:h-8 sm:w-8 sm:rounded-xl sm:text-[11px]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <p className="text-[9px] font-semibold tracking-wide text-slate-500 dark:text-dark-slate-400 sm:text-[10px]">학습 섹션</p>
          <h3 className="text-xs font-bold leading-tight text-slate-900 dark:text-dark-slate-200 sm:text-base">
            {section.title}
          </h3>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-2">
        {section.notes.map((note) => (
          <Link
            key={note.id}
            to={getNotePath(section.id, note.id)}
            aria-label={`${note.navigationLabel ? `${note.navigationLabel} ` : ''}${note.displayTitle}`}
            className="group flex min-h-[38px] items-center justify-between gap-1.5 rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-1.5 outline-none transition-[color] hover:border-indigo-200 hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:border-dark-slate-800/60 dark:bg-surface-canvas/60 dark:hover:border-dark-indigo-500/30 dark:hover:bg-dark-indigo-500/10 dark:focus-visible:bg-dark-indigo-500/10 sm:min-h-[44px] sm:gap-2 sm:px-3 sm:py-2"
          >
            <span className="min-w-0 flex-1">
              {note.navigationLabel && (
                <span className="block text-[8px] font-bold tracking-wide text-indigo-500 dark:text-dark-indigo-400 sm:text-[9px]">
                  {note.navigationLabel}
                </span>
              )}
              <span className="block text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-indigo-700 group-focus-visible:text-indigo-700 dark:text-dark-slate-300 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300 sm:text-xs">
                {note.displayTitle}
              </span>
            </span>
            <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-indigo-600 dark:text-dark-slate-500 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300 sm:h-3.5 sm:w-3.5" />
          </Link>
        ))}
      </div>
    </motion.article>
  );
}
