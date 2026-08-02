import { isValidElement, lazy } from 'react';
import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';
import type { MDXProps } from 'mdx/types';

export interface NoteFrontmatter {
  title: string;
}

export interface ContentGroupMeta {
  id: string;
  title: string;
  description?: string;
  pages: string[];
}

export interface ContentMeta {
  title?: string;
  groups?: ContentGroupMeta[];
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

interface NoteTocItem {
  depth: number;
  url: string;
  title: ReactNode;
}

interface NoteModule {
  default: ComponentType<MDXProps>;
  toc: NoteTocItem[];
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
  navigationLabel?: string;
  displayTitle: string;
  Component: NoteContentComponent;
  loadTopics: () => Promise<NoteTopic[]>;
  preload: () => Promise<void>;
}

export interface Section {
  id: string;
  title: string;
  groupId?: string;
  groupTitle?: string;
  notes: Note[];
}

export interface SectionGroup {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
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
  noteNavigationLabel?: string;
  noteTitle: string;
  matchKind: SearchMatchKind;
}

export interface TopicSearchResult extends SearchResultBase {
  kind: 'topic';
  topic: Topic;
  snippet: string;
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
    query: { collection: 'docs', only: 'frontmatter' },
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

const rawMetaFiles = import.meta.glob<ContentMeta>(
  '/content/**/meta.json',
  {
    eager: true,
    import: 'default',
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
  const rootMeta = rawMetaFiles['/content/meta.json'];
  let sectionIds: string[] = [];

  if (Array.isArray(rootMeta?.pages) && rootMeta.pages.length > 0) {
    sectionIds = rootMeta.pages;
  } else if (Array.isArray(rootMeta?.groups) && rootMeta.groups.length > 0) {
    const seen = new Set<string>();
    for (const group of rootMeta.groups) {
      if (Array.isArray(group.pages)) {
        for (const pageId of group.pages) {
          if (isNonEmptyString(pageId) && !seen.has(pageId)) {
            seen.add(pageId);
            sectionIds.push(pageId);
          }
        }
      }
    }
  } else {
    throw new Error('content/meta.json must define the section order in "groups" or "pages".');
  }

  if (sectionIds.length === 0) {
    throw new Error('content/meta.json must contain at least one section.');
  }
  if (sectionIds.some((sectionId) => !isNonEmptyString(sectionId) || sectionId.includes('/'))) {
    throw new Error('content/meta.json section order must contain non-empty section folder names.');
  }

  const uniqueSectionIds = new Set(sectionIds);
  if (uniqueSectionIds.size !== sectionIds.length) {
    throw new Error('content/meta.json section order must not contain duplicate sections.');
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

export function parseNoteNavigationTitle(title: string) {
  const trimmedTitle = title.trim();
  const separatorIndex = trimmedTitle.indexOf(':');
  if (separatorIndex < 0) {
    return { displayTitle: trimmedTitle };
  }

  const rawLabel = trimmedTitle.slice(0, separatorIndex).trim();
  const displayTitle = trimmedTitle.slice(separatorIndex + 1).trim();
  if (!rawLabel || !displayTitle) {
    return { displayTitle: trimmedTitle };
  }

  const navigationLabel = rawLabel.replace(/^(Part\s+\d+)\.\s*(.+)$/i, '$1 · $2');
  return { navigationLabel, displayTitle };
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

function createLazyNoteContent(
  filePath: string,
  loadNote: NoteLoader,
) {
  let notePromise: ReturnType<NoteLoader> | null = null;
  let topicsPromise: Promise<NoteTopic[]> | null = null;
  const load = () => {
    notePromise ??= loadNote();
    return notePromise;
  };
  const loadTopics = () => {
    topicsPromise ??= load().then(noteModule => getNoteTopics(filePath, noteModule.toc));
    return topicsPromise;
  };

  return {
    Component: lazy(async () => ({ default: (await load()).default })),
    loadTopics,
    preload: async () => {
      await Promise.all([load(), loadTopics()]);
    },
  };
}

function getTocTitleText(value: ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(getTocTitleText).join('');
  if (isValidElement<{ children?: ReactNode }>(value)) {
    return getTocTitleText(value.props.children);
  }
  return '';
}

function getNoteTopics(filePath: string, toc: NoteTocItem[]) {
  if (!Array.isArray(toc)) {
    throw new Error(`Structured topic data is invalid for ${filePath}.`);
  }

  const topicIds = new Set<string>();
  return toc.flatMap((item): NoteTopic[] => {
    if (!item.url.startsWith('#')) return [];

    const id = decodeURIComponent(item.url.slice(1));
    const title = formatTopicTitle(getTocTitleText(item.title));
    if (!isNonEmptyString(id) || !isNonEmptyString(title)) {
      return [];
    }
    if (topicIds.has(id)) {
      throw new Error(`Duplicate topic id "${id}" in ${filePath}.`);
    }
    topicIds.add(id);
    return [{ id, title }];
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
  const navigationTitle = parseNoteNavigationTitle(title);
  const noteContent = createLazyNoteContent(filePath, loadNote);

  section.notes.push({
    id: noteId,
    title,
    ...navigationTitle,
    ...noteContent,
  });
  sectionMap.set(section.id, section);
}

function getRootSectionGroups() {
  const rootMeta = rawMetaFiles['/content/meta.json'];
  if (!Array.isArray(rootMeta?.groups)) {
    return [];
  }
  return rootMeta.groups;
}

const rawGroups = getRootSectionGroups();
const sectionToGroupMap = new Map<string, { groupId: string; groupTitle: string }>();

for (const group of rawGroups) {
  for (const pageId of group.pages) {
    sectionToGroupMap.set(pageId, { groupId: group.id, groupTitle: group.title });
  }
}

export const navData: Section[] = [...sectionMap.values()]
  .sort((a, b) => {
    const aIndex = sectionOrderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = sectionOrderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex || naturalCollator.compare(a.id, b.id);
  })
  .map((section) => {
    const groupInfo = sectionToGroupMap.get(section.id);
    return {
      ...section,
      groupId: groupInfo?.groupId,
      groupTitle: groupInfo?.groupTitle,
      notes: section.notes.sort((a, b) => naturalCollator.compare(a.id, b.id)),
    };
  });

export const navGroupData: SectionGroup[] = rawGroups.length > 0
  ? rawGroups.map((group) => {
      const sections = group.pages
        .map((pageId) => navData.find((s) => s.id === pageId))
        .filter((s): s is Section => Boolean(s));
      return {
        id: group.id,
        title: group.title,
        description: group.description,
        sections,
      };
    })
  : [
      {
        id: 'default',
        title: '전체 섹션',
        sections: navData,
      },
    ];
