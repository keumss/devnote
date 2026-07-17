import { describe, expect, it } from 'vitest';
import { formatTopicTitle, navData, parseNoteNavigationTitle } from './content';
import {
  createSearchSnippet,
  decomposeHangulText,
  getHangulInitials,
  rankSearchCandidates,
  searchContent,
  searchFuzzyTopicDocuments,
  type SearchRankingCandidate,
} from './search';

const searchableTopics = navData.flatMap(section => (
  section.notes.flatMap(note => note.topics.map(topic => ({ section, note, topic })))
));

function getSearchableTopic() {
  const topic = searchableTopics.find(item => item.topic.title.length >= 2);
  if (!topic) throw new Error('Search tests require a topic title with at least two characters.');
  return topic;
}

function createTopicResult(id: string, matchKind: 'topic-title' | 'description' | 'content') {
  return {
    kind: 'topic' as const,
    sectionId: 'section-example',
    sectionTitle: 'Example section',
    noteId: 'note-example',
    noteTitle: 'Example note',
    matchKind,
    snippet: 'Example snippet',
    topic: {
      id,
      title: `Example ${id}`,
      description: 'Example description',
      content: 'Example content',
    },
  };
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

  it('merges field matches, keeps the best match per topic, and prioritizes match quality', () => {
    const exactContent = createTopicResult('content-exact', 'content');
    const weakTitle = createTopicResult('title-contains', 'topic-title');
    const duplicateTitle = createTopicResult('duplicate-topic', 'topic-title');
    const exactDescription = createTopicResult('duplicate-topic', 'description');
    const candidates: SearchRankingCandidate[] = [
      {
        result: weakTitle,
        dedupeKey: 'topic:title-contains',
        matchRank: 2,
        fieldRank: 0,
      },
      {
        result: duplicateTitle,
        dedupeKey: 'topic:duplicate-topic',
        matchRank: 2,
        fieldRank: 0,
      },
      {
        result: exactContent,
        dedupeKey: 'topic:content-exact',
        matchRank: 0,
        fieldRank: 4,
      },
      {
        result: exactDescription,
        dedupeKey: 'topic:duplicate-topic',
        matchRank: 0,
        fieldRank: 3,
      },
    ];

    expect(rankSearchCandidates(candidates)).toEqual([
      exactDescription,
      exactContent,
      weakTitle,
    ]);
  });

  it('finds Hangul typo and initial-consonant queries through the fuzzy index', () => {
    const documents = [{
      topic: {
        id: 'topic-hangul',
        title: '데코레이터 적용',
        description: '클래스 동작을 확장합니다.',
        content: '데코레이터로 공통 처리를 추가합니다.',
      },
    }];

    expect(decomposeHangulText('데코')).toBe('데코');
    expect(getHangulInitials('데코레이터 적용')).toBe('ㄷㅋㄹㅇㅌㅈㅇ');
    expect(searchFuzzyTopicDocuments(documents, '데코레이타')).toEqual(documents);
    expect(searchFuzzyTopicDocuments(documents, 'ㄷㅋㄹㅇㅌ')).toEqual(documents);
    expect(searchFuzzyTopicDocuments(documents, 'ㄷ')).toEqual([]);
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
