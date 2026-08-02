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
    <nav
      className="grid h-11 w-32 shrink-0 grid-cols-2 divide-x divide-slate-200/90 overflow-hidden rounded-lg border border-slate-200/90 bg-slate-50/80 shadow-xs dark:divide-dark-slate-800 dark:border-dark-slate-800 dark:bg-dark-slate-900/40 lg:hidden"
      aria-label="노트 상단 빠른 이동"
    >
      {prevNoteInfo ? (
        <MotionLink
          to={getNotePath(prevNoteInfo.sectionId, prevNoteInfo.note.id)}
          aria-label={`이전 노트: ${prevNoteInfo.note.title}`}
          title={`이전: ${prevNoteInfo.note.title}`}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex h-11 w-16 items-center justify-center gap-1 text-xs font-bold text-slate-600 outline-none transition-colors duration-200 hover:bg-indigo-50/70 hover:text-indigo-600 focus-visible:bg-indigo-50/70 focus-visible:text-indigo-600 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/50 dark:text-dark-slate-300 dark:hover:bg-dark-indigo-500/10 dark:hover:text-dark-indigo-300 dark:focus-visible:bg-dark-indigo-500/10 dark:focus-visible:text-dark-indigo-300 dark:focus-visible:ring-dark-indigo-400/50"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
          <span>이전</span>
        </MotionLink>
      ) : (
        <button
          type="button"
          disabled
          aria-label="이전 노트 없음"
          title="이전 노트가 없습니다"
          className="flex h-11 w-16 cursor-not-allowed items-center justify-center gap-1 bg-slate-50/40 text-xs font-bold text-slate-300 dark:bg-dark-slate-900/30 dark:text-dark-slate-700"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
          <span>이전</span>
        </button>
      )}

      {nextNoteInfo ? (
        <MotionLink
          to={getNotePath(nextNoteInfo.sectionId, nextNoteInfo.note.id)}
          aria-label={`다음 노트: ${nextNoteInfo.note.title}`}
          title={`다음: ${nextNoteInfo.note.title}`}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex h-11 w-16 items-center justify-center gap-1 text-xs font-bold text-slate-600 outline-none transition-colors duration-200 hover:bg-indigo-50/70 hover:text-indigo-600 focus-visible:bg-indigo-50/70 focus-visible:text-indigo-600 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/50 dark:text-dark-slate-300 dark:hover:bg-dark-indigo-500/10 dark:hover:text-dark-indigo-300 dark:focus-visible:bg-dark-indigo-500/10 dark:focus-visible:text-dark-indigo-300 dark:focus-visible:ring-dark-indigo-400/50"
        >
          <span>다음</span>
          <ChevronRight size={16} strokeWidth={2.2} />
        </MotionLink>
      ) : (
        <button
          type="button"
          disabled
          aria-label="다음 노트 없음"
          title="다음 노트가 없습니다"
          className="flex h-11 w-16 cursor-not-allowed items-center justify-center gap-1 bg-slate-50/40 text-xs font-bold text-slate-300 dark:bg-dark-slate-900/30 dark:text-dark-slate-700"
        >
          <span>다음</span>
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      )}
    </nav>
  );
}
