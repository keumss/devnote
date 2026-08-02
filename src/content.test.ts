import { describe, expect, it } from 'vitest';
import {
  formatTopicTitle,
  getNoteLocation,
  navData,
  navGroupData,
  type NoteFrontmatter,
  type StructuredData,
} from './content';

const legacyFrontmatters = import.meta.glob<NoteFrontmatter>(
  '/content/**/*.{md,mdx}',
  {
    eager: true,
    import: 'frontmatter',
    query: { collection: 'docs', purpose: 'frontmatter-regression-test' },
  },
);

const legacyStructuredData = import.meta.glob<StructuredData>(
  '/content/**/*.{md,mdx}',
  {
    eager: true,
    import: 'structuredData',
    query: { collection: 'docs', purpose: 'navigation-regression-test' },
  },
);

describe('content navigation data consistency', () => {
  it('derives navData section order strictly from navGroupData (groups pages)', () => {
    // Collect section IDs in order from navGroupData
    const groupSectionIds = navGroupData.flatMap((group) => group.sections.map((section) => section.id));

    // Collect section IDs in order from navData
    const navDataSectionIds = navData.map((section) => section.id);

    // Verify both order arrays match 1:1 perfectly
    expect(navDataSectionIds).toEqual(groupSectionIds);
  });

  it('provides lightweight topics and a preload function for every note', () => {
    for (const section of navData) {
      for (const note of section.notes) {
        expect(note.topics.length).toBeGreaterThan(0);
        expect(note.topics.every(topic => topic.id && topic.title)).toBe(true);
        expect(note.preload).toBeTypeOf('function');
      }
    }
  });

  it('keeps every frontmatter title and topic consistent with the previous exports', () => {
    for (const [filePath, structuredData] of Object.entries(legacyStructuredData)) {
      const { sectionId, noteId } = getNoteLocation(filePath);
      const note = navData
        .find(section => section.id === sectionId)
        ?.notes.find(item => item.id === noteId);
      const expectedTopics = structuredData.headings
        .map(heading => ({
          id: heading.id,
          title: formatTopicTitle(heading.content),
        }))
        .filter(topic => topic.id && topic.title);

      expect(note?.title, filePath).toBe(legacyFrontmatters[filePath]?.title.trim());
      expect(note?.topics, filePath).toEqual(expectedTopics);
    }
  });
});
