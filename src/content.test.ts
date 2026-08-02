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
  const allNotes = navData.flatMap(section => (
    section.notes.map(note => ({ section, note }))
  ));

  it('derives navData section order strictly from navGroupData (groups pages)', () => {
    // Collect section IDs in order from navGroupData
    const groupSectionIds = navGroupData.flatMap((group) => group.sections.map((section) => section.id));

    // Collect section IDs in order from navData
    const navDataSectionIds = navData.map((section) => section.id);

    // Verify both order arrays match 1:1 perfectly
    expect(navDataSectionIds).toEqual(groupSectionIds);
  });

  it('provides lazy topics and a preload function for every note', async () => {
    await Promise.all(allNotes.map(async ({ note }) => {
      const topics = await note.loadTopics();
      expect(topics.length).toBeGreaterThan(0);
      expect(topics.every(topic => topic.id && topic.title)).toBe(true);
      expect(note.loadTopics()).toBe(note.loadTopics());
      expect(note.preload).toBeTypeOf('function');
    }));
  }, 20_000);

  it('keeps every frontmatter title and topic consistent with the previous exports', async () => {
    await Promise.all(Object.entries(legacyStructuredData).map(async ([filePath, structuredData]) => {
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
      expect(await note?.loadTopics(), filePath).toEqual(expectedTopics);
    }));
  }, 20_000);
});
