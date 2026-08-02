import { ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function TopNoteNavigation({ prevNoteInfo, nextNoteInfo }: TopNoteNavigationProps) {
  return (
    <nav
      className="grid h-11 w-32 shrink-0 grid-cols-2 divide-x divide-slate-200/90 overflow-hidden rounded-lg border border-slate-200/90 bg-slate-50/80 shadow-xs dark:divide-dark-slate-800 dark:border-dark-slate-800 dark:bg-dark-slate-900/40"
      aria-label="노트 상단 빠른 이동"
    >
      {prevNoteInfo ? (
        <Link
          to={getNotePath(prevNoteInfo.sectionId, prevNoteInfo.note.id)}
          onMouseEnter={() => void prevNoteInfo.note.preload()}
          onFocus={() => void prevNoteInfo.note.preload()}
          aria-label={`이전 노트: ${prevNoteInfo.note.title}`}
          title={`이전: ${prevNoteInfo.note.title}`}
          className="flex h-11 w-16 items-center justify-center gap-1 text-xs font-bold text-slate-600 outline-none transition-[background-color,color,transform] duration-200 hover:bg-indigo-50/70 hover:text-indigo-600 active:scale-[0.97] focus-visible:bg-indigo-50/70 focus-visible:text-indigo-600 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/50 dark:text-dark-slate-300 dark:hover:bg-dark-indigo-500/10 dark:hover:text-dark-indigo-300 dark:focus-visible:bg-dark-indigo-500/10 dark:focus-visible:text-dark-indigo-300 dark:focus-visible:ring-dark-indigo-400/50"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
          <span>이전</span>
        </Link>
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
        <Link
          to={getNotePath(nextNoteInfo.sectionId, nextNoteInfo.note.id)}
          onMouseEnter={() => void nextNoteInfo.note.preload()}
          onFocus={() => void nextNoteInfo.note.preload()}
          aria-label={`다음 노트: ${nextNoteInfo.note.title}`}
          title={`다음: ${nextNoteInfo.note.title}`}
          className="flex h-11 w-16 items-center justify-center gap-1 text-xs font-bold text-slate-600 outline-none transition-[background-color,color,transform] duration-200 hover:bg-indigo-50/70 hover:text-indigo-600 active:scale-[0.97] focus-visible:bg-indigo-50/70 focus-visible:text-indigo-600 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/50 dark:text-dark-slate-300 dark:hover:bg-dark-indigo-500/10 dark:hover:text-dark-indigo-300 dark:focus-visible:bg-dark-indigo-500/10 dark:focus-visible:text-dark-indigo-300 dark:focus-visible:ring-dark-indigo-400/50"
        >
          <span>다음</span>
          <ChevronRight size={16} strokeWidth={2.2} />
        </Link>
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
