import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Section } from '../content';
import { getNotePath } from '../navigation';

interface LearningSectionCardProps {
  section: Section;
  index: number;
  isCurrentSection?: boolean;
}

export default function LearningSectionCard({
  section,
  index,
  isCurrentSection = false,
}: LearningSectionCardProps) {
  const firstNote = section.notes[0];
  const firstNotePath = firstNote ? getNotePath(section.id, firstNote.id) : '#';

  return (
    <article
      className="animate-page-enter"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <Link
        to={firstNotePath}
        onMouseEnter={() => void firstNote?.preload()}
        onFocus={() => void firstNote?.preload()}
        aria-label={`${section.title} - 첫 노트로 이동`}
        className={`group flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 shadow-2xs transition-all duration-200 hover:shadow-xs ${
          isCurrentSection
            ? 'border-indigo-300 bg-indigo-50/60 ring-1 ring-indigo-400/30 dark:border-dark-indigo-500/60 dark:bg-dark-indigo-500/15 dark:ring-dark-indigo-500/30'
            : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-dark-slate-800 dark:bg-dark-slate-900/60 dark:hover:border-dark-indigo-500/50 dark:hover:bg-dark-indigo-500/10'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-colors ${
              isCurrentSection
                ? 'bg-indigo-600 text-white dark:bg-dark-indigo-500 dark:text-white'
                : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-dark-slate-800 dark:text-dark-slate-300 dark:group-hover:bg-dark-indigo-500 dark:group-hover:text-white'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-dark-slate-200 dark:group-hover:text-dark-indigo-300 sm:text-sm truncate">
                {section.title}
              </h3>
              {isCurrentSection && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-100/80 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-dark-indigo-500/20 dark:text-dark-indigo-300">
                  <Sparkles className="h-2.5 w-2.5 text-indigo-500 animate-spin-slow" />
                  학습 중
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-dark-slate-400">
            <FileText className="h-3 w-3 text-slate-400 dark:text-dark-slate-500" />
            {section.notes.length}개
          </span>
          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:text-dark-slate-500 dark:group-hover:text-dark-indigo-300" />
        </div>
      </Link>
    </article>
  );
}
