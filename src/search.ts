import Fuse from 'fuse.js';
import {
  getContentLocation,
  navData,
  type CheatSheetItem,
  type SearchResult,
  type StructuredData,
} from './content';

export type { SearchResult } from './content';

const contentStructuredData = import.meta.glob<StructuredData>(
  '/content/docs/**/*.{md,mdx}',
  {
    eager: true,
    import: 'structuredData',
    query: { collection: 'docs', purpose: 'search' },
  },
);

function getItems(filePath: string, structuredData: StructuredData): CheatSheetItem[] {
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

const categoryMetadata = new Map(
  navData.flatMap(section => (
    section.categories.map(category => [
      `${section.id}/${category.id}`,
      { section, category },
    ] as const)
  )),
);

const searchDocuments: SearchResult[] = [];
for (const [filePath, structuredData] of Object.entries(contentStructuredData)) {
  const { sectionId, documentId } = getContentLocation(filePath);
  const metadata = categoryMetadata.get(`${sectionId}/${documentId}`);
  if (!metadata) {
    throw new Error(`Search metadata is missing for ${filePath}.`);
  }

  for (const item of getItems(filePath, structuredData)) {
    searchDocuments.push({
      sectionId,
      sectionTitle: metadata.section.title,
      categoryId: documentId,
      categoryTitle: metadata.category.displayTitle,
      item,
    });
  }
}

const searchIndex = new Fuse<SearchResult>(searchDocuments, {
  keys: [
    { name: 'item.title', weight: 0.4 },
    { name: 'categoryTitle', weight: 0.2 },
    { name: 'sectionTitle', weight: 0.15 },
    { name: 'item.description', weight: 0.15 },
    { name: 'item.content', weight: 0.1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 1,
});

export function searchContent(query: string) {
  return searchIndex.search(query, { limit: 50 }).map(result => result.item);
}
