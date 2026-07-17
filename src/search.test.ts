import { describe, expect, it } from 'vitest';
import { formatTopicTitle, navData, parseNoteNavigationTitle } from './content';
import { createSearchSnippet, searchContent } from './search';

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
      snippet: expect.any(String),
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

  it('separates a note stage from its learning goal', () => {
    expect(parseNoteNavigationTitle('Part 1. 기초: API 시작하기')).toEqual({
      navigationLabel: 'Part 1 · 기초',
      displayTitle: 'API 시작하기',
    });
    expect(parseNoteNavigationTitle('제목만 있는 노트')).toEqual({
      displayTitle: '제목만 있는 노트',
    });
    expect(parseNoteNavigationTitle('Part 2. 중급: 요청: 응답 연결하기')).toEqual({
      navigationLabel: 'Part 2 · 중급',
      displayTitle: '요청: 응답 연결하기',
    });
  });

  it('builds a bounded snippet around the matching content', () => {
    const source = `${'앞쪽 문맥 '.repeat(30)}검색 대상${' 뒤쪽 문맥'.repeat(30)}`;
    const snippet = createSearchSnippet(source, '검색 대상');

    expect(snippet).toContain('검색 대상');
    expect(snippet.length).toBeLessThanOrEqual(160);
    expect(snippet.startsWith('…')).toBe(true);
    expect(snippet.endsWith('…')).toBe(true);
  });
});
