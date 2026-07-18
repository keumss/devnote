import { BookOpenText, ChevronRight, FileText, Hash } from 'lucide-react';
import type { SearchResult } from '../search';

const MOBILE_DESCRIPTION_LENGTH = 72;

function getResultTitle(result: SearchResult) {
  if (result.kind === 'topic') return result.topic.title;
  if (result.kind === 'note') return result.noteTitle;
  return `${result.sectionTitle} 섹션`;
}

function getResultDescription(result: SearchResult) {
  if (result.kind === 'topic') return result.snippet;
  if (result.kind === 'note') return '노트 제목에서 찾음';
  return '섹션 제목에서 찾음';
}

function getMobileResultDescription(result: SearchResult, query: string) {
  const description = getResultDescription(result);
  if (description.length <= MOBILE_DESCRIPTION_LENGTH) return description;

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const normalizedDescription = description.toLocaleLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const phraseIndex = normalizedDescription.indexOf(normalizedQuery);
  const matchedTerm = terms.find(term => normalizedDescription.includes(term));
  const matchIndex = phraseIndex >= 0
    ? phraseIndex
    : matchedTerm ? normalizedDescription.indexOf(matchedTerm) : -1;
  const matchLength = phraseIndex >= 0 ? normalizedQuery.length : matchedTerm?.length ?? 0;

  if (matchIndex < 0) return description.slice(0, MOBILE_DESCRIPTION_LENGTH).trimEnd() + '…';

  const contextLength = MOBILE_DESCRIPTION_LENGTH - matchLength;
  const start = Math.max(0, matchIndex - Math.floor(contextLength / 2));
  const end = Math.min(description.length, start + MOBILE_DESCRIPTION_LENGTH);

  return `${start > 0 ? '…' : ''}${description.slice(start, end).trim()}${end < description.length ? '…' : ''}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const terms = [...new Set(query.trim().split(/\s+/).filter(Boolean))]
    .sort((a, b) => b.length - a.length);
  if (terms.length === 0) return text;

  const termPattern = terms.map(escapeRegExp).join('|');
  const splitPattern = new RegExp(`(${termPattern})`, 'gi');
  const matchPattern = new RegExp(`^(?:${termPattern})$`, 'i');

  return text.split(splitPattern).map((part, index) => (
    matchPattern.test(part) ? (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-amber-200/80 px-0.5 text-inherit dark:bg-amber-400/25"
      >
        {part}
      </mark>
    ) : part
  ));
}

function getMatchLabel(result: SearchResult) {
  switch (result.matchKind) {
    case 'topic-title':
      return '토픽 제목';
    case 'note-title':
      return '노트 제목';
    case 'section-title':
      return '섹션 제목';
    case 'description':
      return '설명';
    case 'content':
      return '본문';
    case 'fuzzy':
      return '유사 검색';
  }
}

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  isActive: boolean;
  buttonRef: (element: HTMLButtonElement | null) => void;
  onActivate: () => void;
  onSelect: () => void;
}

export default function SearchResultItem({
  result,
  query,
  isActive,
  buttonRef,
  onActivate,
  onSelect,
}: SearchResultItemProps) {
  return (
    <button
      type="button"
      ref={buttonRef}
      onMouseEnter={onActivate}
      onClick={onSelect}
      aria-current={isActive ? 'true' : undefined}
      data-active={isActive}
      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-dark-slate-800/80 transition-[color] group flex flex-col gap-1.5 focus:outline-none focus:bg-indigo-50 dark:focus:bg-dark-slate-800/80 ${
        isActive ? 'bg-indigo-50 dark:bg-dark-slate-800/80' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-indigo-600 dark:text-dark-indigo-400 uppercase tracking-widest flex-wrap">
        <span>{result.sectionTitle}</span>
        <ChevronRight size={12} className="text-slate-400" />
        {result.kind === 'section' ? (
          <span>섹션</span>
        ) : (
          <span className="flex items-center gap-1.5 normal-case tracking-normal">
            {result.noteNavigationLabel && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500 dark:bg-dark-slate-800 dark:text-dark-slate-400">
                {result.noteNavigationLabel}
              </span>
            )}
            <span>
              <HighlightedText text={result.noteTitle} query={query} />
            </span>
          </span>
        )}
        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] text-indigo-700 dark:bg-dark-indigo-500/20 dark:text-dark-indigo-300 normal-case tracking-normal">
          {getMatchLabel(result)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {result.kind === 'topic' ? (
          <Hash size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
        ) : result.kind === 'note' ? (
          <FileText size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
        ) : (
          <BookOpenText size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
        )}
        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-dark-slate-100 group-hover:text-indigo-700 dark:group-hover:text-dark-indigo-300 transition-colors">
          <HighlightedText text={getResultTitle(result)} query={query} />
        </span>
      </div>
      <p className="sm:hidden text-xs text-slate-500 dark:text-dark-slate-400 line-clamp-2 pl-6">
        <HighlightedText text={getMobileResultDescription(result, query)} query={query} />
      </p>
      <p className="hidden sm:block text-sm text-slate-500 dark:text-dark-slate-400 line-clamp-2 pl-6">
        <HighlightedText text={getResultDescription(result)} query={query} />
      </p>
    </button>
  );
}
