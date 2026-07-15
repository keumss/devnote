import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { MDXProps } from 'mdx/types';

export interface NoteFrontmatter {
  title: string;
}

export interface ContentMeta {
  title?: string;
  pages?: string[];
}

export interface StructuredData {
  headings: Array<{
    id: string;
    content: string;
  }>;
  contents: Array<{
    heading?: string;
    content: string;
  }>;
}

interface NoteModule {
  default: ComponentType<MDXProps>;
  frontmatter: NoteFrontmatter;
  structuredData: StructuredData;
}

type NoteLoader = () => Promise<NoteModule>;

export type NoteContentComponent = LazyExoticComponent<ComponentType<MDXProps>>;

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface NoteTopic {
  id: string;
  title: string;
}

export interface Note {
  id: string;
  title: string;
  displayTitle: string;
  topics: NoteTopic[];
  Component: NoteContentComponent;
}

export interface Section {
  id: string;
  title: string;
  notes: Note[];
}

export type SearchMatchKind =
  | 'topic-title'
  | 'note-title'
  | 'section-title'
  | 'description'
  | 'content'
  | 'fuzzy';

interface SearchResultBase {
  sectionId: string;
  sectionTitle: string;
  noteId: string;
  noteTitle: string;
  matchKind: SearchMatchKind;
}

export interface TopicSearchResult extends SearchResultBase {
  kind: 'topic';
  topic: Topic;
}

export interface NoteSearchResult extends SearchResultBase {
  kind: 'note';
}

export interface SectionSearchResult extends SearchResultBase {
  kind: 'section';
}

export type SearchResult = TopicSearchResult | NoteSearchResult | SectionSearchResult;

// Use a distinct module query for metadata so Rollup can tree-shake the MDX
// renderer from the eager imports while retaining separate lazy render chunks.
const noteLoaders = import.meta.glob<NoteModule>(
  '/content/**/*.{md,mdx}',
  {
    query: { collection: 'docs' },
  },
);

const noteFrontmatters = import.meta.glob<NoteFrontmatter>(
  '/content/**/*.{md,mdx}',
  {
    eager: true,
    import: 'frontmatter',
    query: { collection: 'docs', purpose: 'metadata' },
  },
);

const noteStructuredData = import.meta.glob<StructuredData>(
  '/content/**/*.{md,mdx}',
  {
    eager: true,
    import: 'structuredData',
    query: { collection: 'docs', purpose: 'search' },
  },
);

const metaFiles = import.meta.glob<ContentMeta>(
  '/content/**/meta.json',
  {
    eager: true,
    import: 'default',
    query: { collection: 'docs' },
  },
);

const naturalCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getNoteLocation(filePath: string) {
  const relativePath = filePath.replace('/content/', '');
  const pathParts = relativePath.split('/');
  const fileName = pathParts.pop();
  const sectionId = pathParts.pop();

  if (!fileName || !sectionId || pathParts.length > 0) {
    throw new Error(`Notes must be placed directly under a section folder: ${filePath}`);
  }

  return {
    sectionId,
    noteId: fileName.replace(/\.(md|mdx)$/, ''),
  };
}

function getSectionIdFromMetaPath(filePath: string) {
  if (filePath === '/content/meta.json') {
    return null;
  }

  const match = filePath.match(/^\/content\/([^/]+)\/meta\.json$/);
  if (!match) {
    throw new Error(`Section metadata must be placed directly under a section folder: ${filePath}`);
  }

  return match[1];
}

function getRootSectionOrder() {
  const rootMeta = metaFiles['/content/meta.json'];
  if (!Array.isArray(rootMeta?.pages)) {
    throw new Error('content/meta.json must define the section order in "pages".');
  }

  const sectionIds = rootMeta.pages;
  if (sectionIds.length === 0) {
    throw new Error('content/meta.json "pages" must contain at least one section.');
  }
  if (sectionIds.some((sectionId) => !isNonEmptyString(sectionId) || sectionId.includes('/'))) {
    throw new Error('content/meta.json "pages" must contain non-empty section folder names.');
  }

  const uniqueSectionIds = new Set(sectionIds);
  if (uniqueSectionIds.size !== sectionIds.length) {
    throw new Error('content/meta.json "pages" must not contain duplicate sections.');
  }

  return sectionIds;
}

function getSectionTitle(sectionId: string) {
  const sectionMeta = metaFiles[`/content/${sectionId}/meta.json`];
  if (!isNonEmptyString(sectionMeta?.title)) {
    throw new Error(`content/${sectionId}/meta.json must define a section title.`);
  }
  return sectionMeta.title.trim();
}

function validateNoteFiles(sectionOrder: string[]) {
  const notePaths = Object.keys(noteLoaders);
  const noteIds = new Set<string>();
  const noteSections = new Set(
    notePaths.map((filePath) => getNoteLocation(filePath).sectionId),
  );
  const metadataSections = new Set<string>();

  for (const filePath of Object.keys(metaFiles)) {
    const sectionId = getSectionIdFromMetaPath(filePath);
    if (sectionId) {
      metadataSections.add(sectionId);
    }
  }

  for (const filePath of notePaths) {
    const { sectionId, noteId } = getNoteLocation(filePath);
    const noteKey = `${sectionId}/${noteId}`;
    if (noteIds.has(noteKey)) {
      throw new Error(`Duplicate note id: ${noteKey}.`);
    }
    noteIds.add(noteKey);

    const frontmatter = noteFrontmatters[filePath];
    if (!isNonEmptyString(frontmatter?.title)) {
      throw new Error(`Frontmatter in ${filePath} must define a title.`);
    }
  }

  for (const sectionId of sectionOrder) {
    if (!noteSections.has(sectionId)) {
      throw new Error(`Section "${sectionId}" is listed in content/meta.json but has no notes.`);
    }
    if (!metadataSections.has(sectionId)) {
      throw new Error(`Section "${sectionId}" is missing content/${sectionId}/meta.json.`);
    }
  }

  for (const sectionId of noteSections) {
    if (!sectionOrder.includes(sectionId)) {
      throw new Error(`Section "${sectionId}" with notes is missing from content/meta.json.`);
    }
  }

  for (const sectionId of metadataSections) {
    if (!sectionOrder.includes(sectionId)) {
      throw new Error(`Metadata section "${sectionId}" is missing from content/meta.json.`);
    }
  }
}

export function formatNoteNavigationTitle(title: string) {
  const prefix = title.split(':', 1)[0].trim();
  return prefix || title.trim();
}

export function formatTopicTitle(title: string) {
  let formattedTitle = title.trim();

  for (let index = 0; index < 3; index += 1) {
    const nextTitle = formattedTitle
      .replace(/\\([\\`*_[\]{}()#+\-.!])/g, '$1')
      .replace(/(`+)(.*?)\1/g, '$2')
      .replace(/(\*\*|__)(.*?)\1/g, '$2');
    if (nextTitle === formattedTitle) break;
    formattedTitle = nextTitle;
  }

  return formattedTitle;
}

function createLazyNoteContent(loadNote: NoteLoader): NoteContentComponent {
  return lazy(async () => {
    const noteModule = await loadNote();
    return { default: noteModule.default };
  });
}

function getNoteTopics(filePath: string) {
  const structuredData = noteStructuredData[filePath];
  if (!Array.isArray(structuredData?.headings)) {
    throw new Error(`Structured topic data is invalid for ${filePath}.`);
  }

  const topicIds = new Set<string>();
  return structuredData.headings.flatMap((heading): NoteTopic[] => {
    const title = formatTopicTitle(heading.content);
    if (!isNonEmptyString(heading.id) || !isNonEmptyString(title)) {
      return [];
    }
    if (topicIds.has(heading.id)) {
      throw new Error(`Duplicate topic id "${heading.id}" in ${filePath}.`);
    }
    topicIds.add(heading.id);
    return [{ id: heading.id, title }];
  });
}

const sectionOrder = getRootSectionOrder();
validateNoteFiles(sectionOrder);

const sectionOrderMap = new Map(
  sectionOrder.map((sectionId, index) => [sectionId, index]),
);
const sectionMap = new Map<string, Section>();

for (const [filePath, loadNote] of Object.entries(noteLoaders)) {
  const frontmatter = noteFrontmatters[filePath];
  const { sectionId, noteId } = getNoteLocation(filePath);
  const section = sectionMap.get(sectionId) ?? {
    id: sectionId,
    title: getSectionTitle(sectionId),
    notes: [],
  };
  const title = frontmatter.title.trim();

  section.notes.push({
    id: noteId,
    title,
    displayTitle: formatNoteNavigationTitle(title),
    topics: getNoteTopics(filePath),
    Component: createLazyNoteContent(loadNote),
  });
  sectionMap.set(section.id, section);
}

export const navData: Section[] = [...sectionMap.values()]
  .sort((a, b) => {
    const aIndex = sectionOrderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = sectionOrderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex || naturalCollator.compare(a.id, b.id);
  })
  .map((section) => ({
    ...section,
    notes: section.notes.sort((a, b) => naturalCollator.compare(a.id, b.id)),
  }));
