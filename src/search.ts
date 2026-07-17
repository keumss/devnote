import Fuse from 'fuse.js';
import {
  getNoteLocation,
  formatTopicTitle,
  navData,
  type Note,
  type NoteSearchResult,
  type Section,
  type SectionSearchResult,
  type Topic,
  type TopicSearchResult,
  type SearchResult,
  type StructuredData,
} from './content';

export type { SearchResult } from './content';

const RESULT_LIMIT = 12;
const FUZZY_SCORE_LIMIT = 0.2;
const SNIPPET_LENGTH = 160;

const contentStructuredData = import.meta.glob<StructuredData>(
  '/content/**/*.{md,mdx}',
  {
    eager: true,
    import: 'structuredData',
    query: { collection: 'docs', purpose: 'search' },
  },
);

function getTopics(filePath: string, structuredData: StructuredData): Topic[] {
  if (!Array.isArray(structuredData?.headings) || !Array.isArray(structuredData.contents)) {
    throw new Error(`Structured search data is invalid for ${filePath}.`);
  }

  const contentsByHeading = new Map<string, string[]>();
  for (const entry of structuredData.contents) {
    if (!entry.heading) continue;

    const content = entry.content.trim();
    if (!content) continue;

    const contents = contentsByHeading.get(entry.heading) ?? [];
    contents.push(content);
    contentsByHeading.set(entry.heading, contents);
  }

  const headingIds = new Set<string>();
  return structuredData.headings
    .filter(heading => heading.id)
    .map(heading => {
      if (headingIds.has(heading.id)) {
        throw new Error(`Duplicate searchable heading id "${heading.id}" in ${filePath}.`);
      }
      headingIds.add(heading.id);

      const content = contentsByHeading.get(heading.id) ?? [];
      return {
        id: heading.id,
        title: formatTopicTitle(heading.content),
        description: content[0] ?? '',
        content: content.join('\n'),
      };
    });
}

const noteMetadata = new Map(
  navData.flatMap(section => (
    section.notes.map(note => [
      `${section.id}/${note.id}`,
      { section, note },
    ] as const)
  )),
);

interface TopicDocument {
  sectionId: string;
  sectionTitle: string;
  noteId: string;
  noteNavigationLabel?: string;
  noteTitle: string;
  topic: Topic;
}

interface NoteDocument {
  section: Section;
  note: Note;
}

interface SectionDocument {
  section: Section;
  targetNote: Note;
}

const topicDocuments: TopicDocument[] = [];
for (const [filePath, structuredData] of Object.entries(contentStructuredData)) {
  const { sectionId, noteId } = getNoteLocation(filePath);
  const metadata = noteMetadata.get(`${sectionId}/${noteId}`);
  if (!metadata) {
    throw new Error(`Search metadata is missing for ${filePath}.`);
  }

  for (const topic of getTopics(filePath, structuredData)) {
    topicDocuments.push({
      sectionId,
      sectionTitle: metadata.section.title,
      noteId,
      noteNavigationLabel: metadata.note.navigationLabel,
      noteTitle: metadata.note.displayTitle,
      topic,
    });
  }
}

const noteDocuments: NoteDocument[] = navData.flatMap(section => (
  section.notes.map(note => ({ section, note }))
));

const sectionDocuments: SectionDocument[] = navData.map(section => {
  const targetNote = section.notes[0];
  if (!targetNote) {
    throw new Error(`Search metadata is missing a note for section "${section.id}".`);
  }
  return { section, targetNote };
});

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const JUNGSEONG_COUNT = 21;
const JONGSEONG_COUNT = 28;
const CHOSEONG = Array.from({ length: 19 }, (_, index) => String.fromCharCode(0x1100 + index));
const JUNGSEONG = Array.from({ length: JUNGSEONG_COUNT }, (_, index) => String.fromCharCode(0x1161 + index));
const JONGSEONG = ['', ...Array.from({ length: JONGSEONG_COUNT - 1 }, (_, index) => String.fromCharCode(0x11a8 + index))];
const COMPATIBILITY_CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

function getHangulParts(character: string) {
  const codePoint = character.codePointAt(0);
  if (codePoint === undefined || codePoint < HANGUL_BASE || codePoint > HANGUL_LAST) {
    return null;
  }

  const offset = codePoint - HANGUL_BASE;
  return {
    choseong: Math.floor(offset / (JUNGSEONG_COUNT * JONGSEONG_COUNT)),
    jungseong: Math.floor(offset / JONGSEONG_COUNT) % JUNGSEONG_COUNT,
    jongseong: offset % JONGSEONG_COUNT,
  };
}

export function decomposeHangulText(value: string) {
  return [...value].map(character => {
    const parts = getHangulParts(character);
    if (!parts) return character;

    return `${CHOSEONG[parts.choseong]}${JUNGSEONG[parts.jungseong]}${JONGSEONG[parts.jongseong]}`;
  }).join('');
}

export function getHangulInitials(value: string) {
  return [...value].flatMap(character => {
    const parts = getHangulParts(character);
    if (parts) return COMPATIBILITY_CHOSEONG[parts.choseong];
    return /\s/.test(character) ? [] : character;
  }).join('');
}

function getMatchRank(value: string, query: string, queryTerms: string[]) {
  const normalizedValue = normalize(value);

  if (normalizedValue === query) return 0;
  if (normalizedValue.startsWith(query)) return 1;
  if (normalizedValue.includes(query)) return 2;
  if (queryTerms.every(term => normalizedValue.includes(term))) return 3;
  return null;
}

export function createSearchSnippet(source: string, rawQuery: string) {
  const content = source.replace(/\s+/g, ' ').trim();
  if (!content || content.length <= SNIPPET_LENGTH) return content;

  const query = normalize(rawQuery);
  const normalizedContent = content.toLocaleLowerCase();
  const queryTerms = query.split(' ').filter(Boolean);
  const phraseIndex = normalizedContent.indexOf(query);
  const termMatches = queryTerms
    .map(term => ({ index: normalizedContent.indexOf(term), length: term.length }))
    .filter(match => match.index >= 0)
    .sort((a, b) => a.index - b.index);
  const match = phraseIndex >= 0
    ? { index: phraseIndex, length: query.length }
    : termMatches[0] ?? { index: 0, length: 0 };

  let hasPrefix = false;
  let hasSuffix = true;
  let start = 0;
  let end = SNIPPET_LENGTH - 1;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const textLength = SNIPPET_LENGTH - Number(hasPrefix) - Number(hasSuffix);
    const matchLength = Math.min(match.length, textLength);
    const contextBeforeMatch = Math.floor((textLength - matchLength) / 2);
    const maxStart = Math.max(0, content.length - textLength);
    start = Math.min(Math.max(0, match.index - contextBeforeMatch), maxStart);
    end = Math.min(content.length, start + textLength);
    hasPrefix = start > 0;
    hasSuffix = end < content.length;
  }

  return `${hasPrefix ? '…' : ''}${content.slice(start, end).trim()}${hasSuffix ? '…' : ''}`;
}

function createTopicResult(
  document: TopicDocument,
  matchKind: TopicSearchResult['matchKind'],
  query: string,
): TopicSearchResult {
  const snippetSource = matchKind === 'content'
    ? document.topic.content
    : document.topic.description || document.topic.content;

  return {
    ...document,
    kind: 'topic',
    matchKind,
    snippet: createSearchSnippet(snippetSource, query),
  };
}

function createNoteResult(document: NoteDocument): NoteSearchResult {
  return {
    kind: 'note',
    sectionId: document.section.id,
    sectionTitle: document.section.title,
    noteId: document.note.id,
    noteNavigationLabel: document.note.navigationLabel,
    noteTitle: document.note.displayTitle,
    matchKind: 'note-title',
  };
}

function createSectionResult(document: SectionDocument): SectionSearchResult {
  return {
    kind: 'section',
    sectionId: document.section.id,
    sectionTitle: document.section.title,
    noteId: document.targetNote.id,
    noteNavigationLabel: document.targetNote.navigationLabel,
    noteTitle: document.targetNote.displayTitle,
    matchKind: 'section-title',
  };
}

export interface SearchRankingCandidate {
  result: SearchResult;
  dedupeKey: string;
  matchRank: number;
  fieldRank: number;
}

export function rankSearchCandidates(candidates: SearchRankingCandidate[]) {
  const sortedCandidates = candidates
    .map((candidate, index) => ({ candidate, index }))
    .sort((a, b) => (
      a.candidate.matchRank - b.candidate.matchRank
      || a.candidate.fieldRank - b.candidate.fieldRank
      || a.index - b.index
    ));
  const seenKeys = new Set<string>();

  return sortedCandidates.flatMap(({ candidate }) => {
    if (seenKeys.has(candidate.dedupeKey)) return [];
    seenKeys.add(candidate.dedupeKey);
    return [candidate.result];
  });
}

interface FuzzySearchDocument {
  topic: Pick<Topic, 'title' | 'description' | 'content'>;
}

interface IndexedFuzzyDocument<T extends FuzzySearchDocument> {
  document: T;
  title: string;
  description: string;
  content: string;
  titleInitials: string;
  descriptionInitials: string;
  contentInitials: string;
}

interface FuzzySearchIndexes<T extends FuzzySearchDocument> {
  text: Fuse<IndexedFuzzyDocument<T>>;
  initials: Fuse<IndexedFuzzyDocument<T>>;
}

function createFuzzySearchIndexes<T extends FuzzySearchDocument>(documents: readonly T[]): FuzzySearchIndexes<T> {
  const indexedDocuments = documents.map(document => ({
    document,
    title: decomposeHangulText(normalize(document.topic.title)),
    description: decomposeHangulText(normalize(document.topic.description)),
    content: decomposeHangulText(normalize(document.topic.content)),
    titleInitials: getHangulInitials(normalize(document.topic.title)),
    descriptionInitials: getHangulInitials(normalize(document.topic.description)),
    contentInitials: getHangulInitials(normalize(document.topic.content)),
  }));
  const options = {
    includeScore: true,
    threshold: FUZZY_SCORE_LIMIT,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    minMatchCharLength: 3,
  };

  return {
    text: new Fuse(indexedDocuments, {
      ...options,
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'description', weight: 0.2 },
        { name: 'content', weight: 0.1 },
      ],
    }),
    initials: new Fuse(indexedDocuments, {
      ...options,
      keys: [
        { name: 'titleInitials', weight: 0.7 },
        { name: 'descriptionInitials', weight: 0.2 },
        { name: 'contentInitials', weight: 0.1 },
      ],
    }),
  };
}

function getFuzzySearchQuery(query: string) {
  const compactQuery = query.replace(/\s+/g, '');
  if (compactQuery.length >= 2 && /^[ㄱ-ㅎ]+$/.test(compactQuery)) {
    return { index: 'initials' as const, value: compactQuery };
  }

  const hangulSyllableCount = [...query].filter(character => getHangulParts(character)).length;
  const isAsciiQuery = /^[a-z0-9 ._/-]+$/i.test(query) && compactQuery.length >= 4;
  if (!isAsciiQuery && hangulSyllableCount < 2) return null;

  return { index: 'text' as const, value: decomposeHangulText(query) };
}

function findFuzzyDocuments<T extends FuzzySearchDocument>(
  indexes: FuzzySearchIndexes<T>,
  rawQuery: string,
  limit = RESULT_LIMIT,
) {
  const query = normalize(rawQuery);
  const fuzzyQuery = getFuzzySearchQuery(query);
  if (!fuzzyQuery) return [];

  return indexes[fuzzyQuery.index]
    .search(fuzzyQuery.value, { limit })
    .filter(result => (result.score ?? 1) <= FUZZY_SCORE_LIMIT)
    .map(result => result.item.document);
}

export function searchFuzzyTopicDocuments<T extends FuzzySearchDocument>(
  documents: readonly T[],
  rawQuery: string,
) {
  return findFuzzyDocuments(createFuzzySearchIndexes(documents), rawQuery);
}

const fuzzySearchIndexes = createFuzzySearchIndexes(topicDocuments);

export function searchContent(rawQuery: string): SearchResult[] {
  const query = normalize(rawQuery);
  if (!query) return [];

  const queryTerms = query.split(' ');
  const candidates: SearchRankingCandidate[] = [];
  const addTopicCandidate = (
    document: TopicDocument,
    value: string,
    matchKind: TopicSearchResult['matchKind'],
    fieldRank: number,
  ) => {
    const matchRank = getMatchRank(value, query, queryTerms);
    if (matchRank === null) return;

    candidates.push({
      result: createTopicResult(document, matchKind, query),
      dedupeKey: `topic:${document.sectionId}/${document.noteId}/${document.topic.id}`,
      matchRank,
      fieldRank,
    });
  };

  for (const document of topicDocuments) {
    addTopicCandidate(document, document.topic.title, 'topic-title', 0);
    addTopicCandidate(document, document.topic.description, 'description', 3);
    addTopicCandidate(document, document.topic.content, 'content', 4);
  }

  for (const document of noteDocuments) {
    const matchRank = getMatchRank(document.note.title, query, queryTerms);
    if (matchRank === null) continue;
    candidates.push({
      result: createNoteResult(document),
      dedupeKey: `note:${document.section.id}/${document.note.id}`,
      matchRank,
      fieldRank: 1,
    });
  }

  for (const document of sectionDocuments) {
    const matchRank = getMatchRank(document.section.title, query, queryTerms);
    if (matchRank === null) continue;
    candidates.push({
      result: createSectionResult(document),
      dedupeKey: `section:${document.section.id}`,
      matchRank,
      fieldRank: 2,
    });
  }

  const directResults = rankSearchCandidates(candidates);
  if (directResults.length > 0) return directResults.slice(0, RESULT_LIMIT);

  return findFuzzyDocuments(fuzzySearchIndexes, query)
    .map(document => createTopicResult(document, 'fuzzy', query));
}
