import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';

interface ContentFrontmatter {
  title: string;
  description?: string;
  section: string;
  sectionTitle: string;
  sectionOrder: number;
  order: number;
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
  description?: string;
  order: number;
  items: CheatSheetItem[];
  Content: ComponentType<MDXProps>;
}

export interface NavSection {
  id: string;
  title: string;
  order: number;
  categories: CheatSheetCategory[];
}

const contentModules = import.meta.glob<ContentModule>(
  '/content/docs/**/*.{md,mdx}',
  {
    eager: true,
    query: { collection: 'docs' },
  },
);

function getDocumentId(filePath: string) {
  return filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '') ?? filePath;
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
  const section = sectionMap.get(frontmatter.section) ?? {
    id: frontmatter.section,
    title: frontmatter.sectionTitle,
    order: frontmatter.sectionOrder,
    categories: [],
  };

  section.categories.push({
    id: getDocumentId(filePath),
    title: frontmatter.title,
    description: frontmatter.description,
    order: frontmatter.order,
    items: getItems(structuredData),
    Content,
  });
  sectionMap.set(section.id, section);
}

export const navData = [...sectionMap.values()]
  .sort((a, b) => a.order - b.order)
  .map((section) => ({
    ...section,
    categories: section.categories.sort((a, b) => a.order - b.order),
  }));
