import { ArrowRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Section } from '../content';
import { getNotePath } from '../navigation';

interface LearningSectionCardProps {
  section: Section;
  index: number;
}

export default function LearningSectionCard({ section, index }: LearningSectionCardProps) {
  const firstNote = section.notes[0];
  const firstNotePath = firstNote ? getNotePath(section.id, firstNote.id) : '#';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Link
        to={firstNotePath}
        aria-label={`${section.title} - 첫 노트로 이동`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs dark:border-dark-slate-800 dark:bg-surface-raised dark:hover:border-dark-indigo-500/50"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[11px] font-extrabold text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-dark-indigo-500/15 dark:text-dark-indigo-300 dark:group-hover:bg-dark-indigo-500 dark:group-hover:text-white">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-dark-slate-100 dark:group-hover:text-dark-indigo-300 sm:text-sm truncate">
            {section.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-dark-slate-400">
            <FileText className="h-3 w-3 text-slate-400 dark:text-dark-slate-500" />
            {section.notes.length}개
          </span>
          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:text-dark-slate-500 dark:group-hover:text-dark-indigo-300" />
        </div>
      </Link>
    </motion.article>
  );
}

