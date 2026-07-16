import { describe, expect, it } from 'vitest';
import { formatTopicTitle, navData } from './content';
import { searchContent } from './search';

const searchableTopics = navData.flatMap(section => (
  section.notes.flatMap(note => note.topics.map(topic => ({ section, note, topic })))
));

function getSearchableTopic() {
  const topic = searchableTopics.find(item => item.topic.title.length >= 2);
  if (!topic) throw new Error('Search tests require a topic title with at least two characters.');
  return topic;
}

describe('searchContent', () => {
  it('indexes headings and their structured content', () => {
    const target = getSearchableTopic();
    const result = searchContent(target.topic.title).find(item => (
      item.kind === 'topic'
      && item.sectionId === target.section.id
      && item.noteId === target.note.id
      && item.topic.id === target.topic.id
    ));

    expect(result).toMatchObject({
      kind: 'topic',
      matchKind: 'topic-title',
    });
  });

  it('uses title matching instead of fuzzy matching for short queries', () => {
    const target = getSearchableTopic();
    const shortQueryResults = searchContent(target.topic.title.slice(0, 3));

    expect(shortQueryResults.length).toBeGreaterThan(0);
    expect(shortQueryResults.every(result => result.matchKind !== 'fuzzy')).toBe(true);
  });

  it('uses plain text titles for headings with Markdown emphasis', () => {
    expect(formatTopicTitle('`post_init`으로 **생성 직후** 값을 검증하기')).toBe(
      'post_init으로 생성 직후 값을 검증하기',
    );
  });
});
