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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-dark-slate-800 dark:bg-surface-raised"
    >
      <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-dark-slate-800/80">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-extrabold text-indigo-600 dark:bg-dark-indigo-500/15 dark:text-dark-indigo-300">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-dark-slate-400">학습 섹션</p>
            <h3 className="mt-1 text-base font-bold leading-tight text-slate-900 dark:text-dark-slate-300">
              {section.title}
            </h3>
          </div>
        </div>
        <span className="ml-3 inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-dark-slate-800 dark:text-dark-slate-300">
          {section.notes.length}개
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        {section.notes.map((note) => (
          <Link
            key={note.id}
            to={getNotePath(section.id, note.id)}
            aria-label={`${note.navigationLabel ? `${note.navigationLabel} ` : ''}${note.displayTitle}`}
            className="group flex min-h-14 items-center justify-between gap-3 rounded-xl px-3 py-2.5 outline-none transition-[color] hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:hover:bg-dark-indigo-500/10 dark:focus-visible:bg-dark-indigo-500/10"
          >
            <span className="min-w-0">
              {note.navigationLabel && (
                <span className="mb-0.5 block text-[10px] font-bold tracking-wide text-indigo-500 dark:text-dark-indigo-400">
                  {note.navigationLabel}
                </span>
              )}
              <span className="block text-sm font-medium leading-snug text-slate-600 transition-colors group-hover:text-indigo-700 group-focus-visible:text-indigo-700 dark:text-dark-slate-300 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300">
                {note.displayTitle}
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-indigo-600 dark:text-dark-slate-500 dark:group-hover:text-dark-indigo-300 dark:group-focus-visible:text-dark-indigo-300" />
          </Link>
        ))}
      </div>
    </motion.article>
  );
}
