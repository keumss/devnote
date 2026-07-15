import Fuse from 'fuse.js';
import {
  getNoteLocation,
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
        title: heading.content,
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

const fuzzySearchIndex = new Fuse<TopicDocument>(topicDocuments, {
  keys: [
    { name: 'topic.title', weight: 0.7 },
    { name: 'topic.description', weight: 0.2 },
    { name: 'topic.content', weight: 0.1 },
  ],
  includeScore: true,
  threshold: FUZZY_SCORE_LIMIT,
  ignoreLocation: true,
  minMatchCharLength: 3,
});

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

function getMatchRank(value: string, query: string, queryTerms: string[]) {
  const normalizedValue = normalize(value);

  if (normalizedValue === query) return 0;
  if (normalizedValue.startsWith(query)) return 0.1;
  if (normalizedValue.includes(query)) return 0.2;
  if (queryTerms.every(term => normalizedValue.includes(term))) return 0.3;
  return null;
}

function createTopicResult(
  document: TopicDocument,
  matchKind: TopicSearchResult['matchKind'],
): TopicSearchResult {
  return {
    ...document,
    kind: 'topic',
    matchKind,
  };
}

function createNoteResult(document: NoteDocument): NoteSearchResult {
  return {
    kind: 'note',
    sectionId: document.section.id,
    sectionTitle: document.section.title,
    noteId: document.note.id,
    noteTitle: document.note.title,
    matchKind: 'note-title',
  };
}

function createSectionResult(document: SectionDocument): SectionSearchResult {
  return {
    kind: 'section',
    sectionId: document.section.id,
    sectionTitle: document.section.title,
    noteId: document.targetNote.id,
    noteTitle: document.targetNote.displayTitle,
    matchKind: 'section-title',
  };
}

function sortByRank<T>(results: Array<{ result: T; rank: number }>) {
  return results
    .sort((a, b) => a.rank - b.rank)
    .map(({ result }) => result);
}

function isFuzzyQuery(query: string) {
  return query.length >= 4 && /^[a-z0-9 ._/-]+$/i.test(query);
}

export function searchContent(rawQuery: string): SearchResult[] {
  const query = normalize(rawQuery);
  if (!query) return [];

  const queryTerms = query.split(' ');
  const titleResults = sortByRank<SearchResult>([
    ...topicDocuments.flatMap(document => {
      const rank = getMatchRank(document.topic.title, query, queryTerms);
      return rank === null
        ? []
        : [{ result: createTopicResult(document, 'topic-title'), rank }];
    }),
    ...noteDocuments.flatMap(document => {
      const rank = getMatchRank(document.note.title, query, queryTerms);
      return rank === null
        ? []
        : [{ result: createNoteResult(document), rank: rank + 0.01 }];
    }),
    ...sectionDocuments.flatMap(document => {
      const rank = getMatchRank(document.section.title, query, queryTerms);
      return rank === null
        ? []
        : [{ result: createSectionResult(document), rank: rank + 0.02 }];
    }),
  ]);

  if (titleResults.length > 0) return titleResults.slice(0, RESULT_LIMIT);

  const descriptionResults = sortByRank<TopicSearchResult>(
    topicDocuments.flatMap(document => {
      const rank = getMatchRank(document.topic.description, query, queryTerms);
      return rank === null
        ? []
        : [{ result: createTopicResult(document, 'description'), rank }];
    }),
  );
  if (descriptionResults.length > 0) return descriptionResults.slice(0, RESULT_LIMIT);

  const contentResults = sortByRank<TopicSearchResult>(
    topicDocuments.flatMap(document => {
      const rank = getMatchRank(document.topic.content, query, queryTerms);
      return rank === null
        ? []
        : [{ result: createTopicResult(document, 'content'), rank }];
    }),
  );
  if (contentResults.length > 0) return contentResults.slice(0, RESULT_LIMIT);

  if (!isFuzzyQuery(query)) return [];

  return fuzzySearchIndex
    .search(query, { limit: RESULT_LIMIT })
    .filter(result => (result.score ?? 1) <= FUZZY_SCORE_LIMIT)
    .map(result => createTopicResult(result.item, 'fuzzy'));
}
