import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';

interface ContentFrontmatter {
  title: string;
}

interface ContentMeta {
  title?: string;
  pages?: string[];
}

interface StructuredData {
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

export interface CheatSheetItem {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface CheatSheetCategory {
  id: string;
  title: string;
  items: CheatSheetItem[];
  Content: ComponentType<MDXProps>;
}

export interface NavSection {
  id: string;
  title: string;
  categories: CheatSheetCategory[];
}

const contentModules = import.meta.glob<ContentModule>(
  '/content/docs/**/*.{md,mdx}',
  {
    eager: true,
    query: { collection: 'docs' },
  },
);

const metaFiles = import.meta.glob<ContentMeta>(
  '/content/docs/**/meta.json',
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

const rootMeta = metaFiles['/content/docs/meta.json'];
const sectionOrder = rootMeta?.pages;

if (!sectionOrder) {
  throw new Error('content/docs/meta.json must define the section order in "pages".');
}

function getContentLocation(filePath: string) {
  const relativePath = filePath.replace('/content/docs/', '');
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

function getSectionTitle(sectionId: string) {
  const sectionMeta = metaFiles[`/content/docs/${sectionId}/meta.json`];
  if (!sectionMeta?.title) {
    throw new Error(`content/docs/${sectionId}/meta.json must define a section title.`);
  }
  return sectionMeta.title;
}

function getItems(structuredData: StructuredData): CheatSheetItem[] {
  return structuredData.headings
    .filter((heading) => heading.id)
    .map((heading) => {
      const content = structuredData.contents
        .filter((entry) => entry.heading === heading.id)
        .map((entry) => entry.content.trim())
        .filter(Boolean);

      return {
        id: heading.id,
        title: heading.content,
        description: content[0] ?? '',
        content: content.join('\n'),
      };
    });
}

const sectionMap = new Map<string, NavSection>();

for (const [filePath, contentModule] of Object.entries(contentModules)) {
  const { frontmatter, structuredData, default: Content } = contentModule;
  const { sectionId, documentId } = getContentLocation(filePath);
  const section = sectionMap.get(sectionId) ?? {
    id: sectionId,
    title: getSectionTitle(sectionId),
    categories: [],
  };

  section.categories.push({
    id: documentId,
    title: frontmatter.title,
    items: getItems(structuredData),
    Content,
  });
  sectionMap.set(section.id, section);
}

export const navData = [...sectionMap.values()]
  .sort((a, b) => {
    const aIndex = sectionOrder.indexOf(a.id);
    const bIndex = sectionOrder.indexOf(b.id);
    const safeAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const safeBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    return safeAIndex - safeBIndex || naturalCollator.compare(a.id, b.id);
  })
  .map((section) => ({
    ...section,
    categories: section.categories.sort((a, b) => naturalCollator.compare(a.id, b.id)),
  }));
