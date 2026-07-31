import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Note } from '../content';
import { getNotePath } from '../navigation';

type NoteInfo = {
  sectionId: string;
  sectionTitle: string;
  note: Note;
};

interface TopNoteNavigationProps {
  prevNoteInfo: NoteInfo | null;
  nextNoteInfo: NoteInfo | null;
}

const MotionLink = motion.create(Link);

export default function TopNoteNavigation({ prevNoteInfo, nextNoteInfo }: TopNoteNavigationProps) {
  return (
    <div className="flex items-center gap-1.5 lg:hidden" aria-label="노트 상단 빠른 이동">
      {prevNoteInfo ? (
        <MotionLink
          to={getNotePath(prevNoteInfo.sectionId, prevNoteInfo.note.id)}
          aria-label={`이전 노트: ${prevNoteInfo.note.title}`}
          title={`이전: ${prevNoteInfo.note.title}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200/90 bg-slate-100/80 text-slate-600 transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-dark-slate-700/60 dark:bg-dark-slate-800/80 dark:text-dark-slate-300 dark:hover:border-dark-indigo-500/50 dark:hover:bg-dark-indigo-500/20 dark:hover:text-dark-indigo-300 dark:focus-visible:ring-dark-indigo-400/50"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </MotionLink>
      ) : (
        <button
          type="button"
          disabled
          aria-label="이전 노트 없음"
          title="이전 노트가 없습니다"
          className="flex size-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200/50 bg-slate-50/50 text-slate-300 dark:border-dark-slate-800/50 dark:bg-dark-slate-900/30 dark:text-dark-slate-700"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
      )}

      {nextNoteInfo ? (
        <MotionLink
          to={getNotePath(nextNoteInfo.sectionId, nextNoteInfo.note.id)}
          aria-label={`다음 노트: ${nextNoteInfo.note.title}`}
          title={`다음: ${nextNoteInfo.note.title}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200/90 bg-slate-100/80 text-slate-600 transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-dark-slate-700/60 dark:bg-dark-slate-800/80 dark:text-dark-slate-300 dark:hover:border-dark-indigo-500/50 dark:hover:bg-dark-indigo-500/20 dark:hover:text-dark-indigo-300 dark:focus-visible:ring-dark-indigo-400/50"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </MotionLink>
      ) : (
        <button
          type="button"
          disabled
          aria-label="다음 노트 없음"
          title="다음 노트가 없습니다"
          className="flex size-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200/50 bg-slate-50/50 text-slate-300 dark:border-dark-slate-800/50 dark:bg-dark-slate-900/30 dark:text-dark-slate-700"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}
