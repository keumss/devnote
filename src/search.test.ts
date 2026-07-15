import { describe, expect, it } from 'vitest';
import { searchContent } from './search';

describe('searchContent', () => {
  it('indexes headings and their structured content', () => {
    const results = searchContent('SELECT');

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(result => result.kind === 'topic')).toBe(true);
    expect(results.some(result => (
      result.kind === 'topic' && result.topic.title.toLowerCase().includes('select')
    ))).toBe(true);
    expect(results.every(result => result.matchKind === 'topic-title')).toBe(true);
  });

  it('returns one navigable section result instead of every topic in that section', () => {
    const results = searchContent('SQLModel');
    const sectionResults = results.filter(result => result.kind === 'section');

    expect(sectionResults).toHaveLength(1);
    expect(sectionResults[0]).toMatchObject({
      sectionId: 'sqlmodel',
      matchKind: 'section-title',
    });
  });

  it('uses exact matching for short queries and only searches content after titles', () => {
    const shortQueryResults = searchContent('폼');
    expect(shortQueryResults.length).toBeGreaterThan(0);
    expect(shortQueryResults.every(result => result.matchKind !== 'fuzzy')).toBe(true);

    const titleResults = searchContent('조회 및 정렬 SELECT');
    expect(titleResults).toHaveLength(1);
    expect(titleResults[0]).toMatchObject({
      kind: 'topic',
      matchKind: 'topic-title',
    });
  });

  it('uses plain text titles for topics with Markdown emphasis', () => {
    const result = searchContent('post_init').find((item) => (
      item.kind === 'topic' && item.topic.title.includes('post_init')
    ));

    expect(result).toMatchObject({
      kind: 'topic',
      topic: { title: 'post_init으로 생성 직후 값을 검증하기' },
    });
  });
});
