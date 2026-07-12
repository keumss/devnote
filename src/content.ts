import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { MDXProps } from 'mdx/types';

export interface ContentFrontmatter {
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

interface ContentModule {
  default: ComponentType<MDXProps>;
  frontmatter: ContentFrontmatter;
  structuredData: StructuredData;
}

type ContentLoader = () => Promise<ContentModule>;

export type MdxContentComponent = LazyExoticComponent<ComponentType<MDXProps>>;

export interface CheatSheetItem {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface CheatSheetCategory {
  id: string;
  title: string;
  displayTitle: string;
  Content: MdxContentComponent;
}

export interface NavSection {
  id: string;
  title: string;
  categories: CheatSheetCategory[];
}

export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  categoryId: string;
  categoryTitle: string;
  item: CheatSheetItem;
}

// Use a distinct module query for metadata so Rollup can tree-shake the MDX
// renderer from the eager imports while retaining separate lazy render chunks.
const contentLoaders = import.meta.glob<ContentModule>(
  '/content/**/*.{md,mdx}',
  {
    query: { collection: 'docs' },
  },
);

const contentFrontmatters = import.meta.glob<ContentFrontmatter>(
  '/content/**/*.{md,mdx}',
  {
    eager: true,
    import: 'frontmatter',
    query: { collection: 'docs', purpose: 'metadata' },
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

export function getContentLocation(filePath: string) {
  const relativePath = filePath.replace('/content/', '');
  const pathParts = relativePath.split('/');
  const fileName = pathParts.pop();
  const sectionId = pathParts.pop();

  if (!fileName || !sectionId || pathParts.length > 0) {
    throw new Error(`Content must be placed directly under a section folder: ${filePath}`);
  }

  return {
    sectionId,
    documentId: fileName.replace(/\.(md|mdx)$/, ''),
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

function validateContentFiles(sectionOrder: string[]) {
  const contentPaths = Object.keys(contentLoaders);
  const documentIds = new Set<string>();
  const contentSections = new Set(
    contentPaths.map((filePath) => getContentLocation(filePath).sectionId),
  );
  const metadataSections = new Set<string>();

  for (const filePath of Object.keys(metaFiles)) {
    const sectionId = getSectionIdFromMetaPath(filePath);
    if (sectionId) {
      metadataSections.add(sectionId);
    }
  }

  for (const filePath of contentPaths) {
    const { sectionId, documentId } = getContentLocation(filePath);
    const documentKey = `${sectionId}/${documentId}`;
    if (documentIds.has(documentKey)) {
      throw new Error(`Duplicate content document id: ${documentKey}.`);
    }
    documentIds.add(documentKey);

    const frontmatter = contentFrontmatters[filePath];
    if (!isNonEmptyString(frontmatter?.title)) {
      throw new Error(`Frontmatter in ${filePath} must define a title.`);
    }
  }

  for (const sectionId of sectionOrder) {
    if (!contentSections.has(sectionId)) {
      throw new Error(`Section "${sectionId}" is listed in content/meta.json but has no content.`);
    }
    if (!metadataSections.has(sectionId)) {
      throw new Error(`Section "${sectionId}" is missing content/${sectionId}/meta.json.`);
    }
  }

  for (const sectionId of contentSections) {
    if (!sectionOrder.includes(sectionId)) {
      throw new Error(`Content section "${sectionId}" is missing from content/meta.json.`);
    }
  }

  for (const sectionId of metadataSections) {
    if (!sectionOrder.includes(sectionId)) {
      throw new Error(`Metadata section "${sectionId}" is missing from content/meta.json.`);
    }
  }
}

export function formatCategoryTitle(title: string) {
  const prefix = title.split(':', 1)[0].trim();
  return prefix || title.trim();
}

function createLazyContent(loadContent: ContentLoader): MdxContentComponent {
  return lazy(async () => {
    const contentModule = await loadContent();
    return { default: contentModule.default };
  });
}

const sectionOrder = getRootSectionOrder();
validateContentFiles(sectionOrder);

const sectionOrderMap = new Map(
  sectionOrder.map((sectionId, index) => [sectionId, index]),
);
const sectionMap = new Map<string, NavSection>();

for (const [filePath, loadContent] of Object.entries(contentLoaders)) {
  const frontmatter = contentFrontmatters[filePath];
  const { sectionId, documentId } = getContentLocation(filePath);
  const section = sectionMap.get(sectionId) ?? {
    id: sectionId,
    title: getSectionTitle(sectionId),
    categories: [],
  };
  const title = frontmatter.title.trim();

  section.categories.push({
    id: documentId,
    title,
    displayTitle: formatCategoryTitle(title),
    Content: createLazyContent(loadContent),
  });
  sectionMap.set(section.id, section);
}

export const navData: NavSection[] = [...sectionMap.values()]
  .sort((a, b) => {
    const aIndex = sectionOrderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = sectionOrderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex || naturalCollator.compare(a.id, b.id);
  })
  .map((section) => ({
    ...section,
    categories: section.categories.sort((a, b) => naturalCollator.compare(a.id, b.id)),
  }));
