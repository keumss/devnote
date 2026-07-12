import { describe, expect, it } from 'vitest';
import { searchContent } from './search';

describe('searchContent', () => {
  it('indexes headings and their structured content', () => {
    const results = searchContent('SELECT');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(result => result.topic.title.toLowerCase().includes('select'))).toBe(true);
    expect(results.every(result => result.topic.id && result.topic.content)).toBe(true);
  });

  it('searches section and note titles and supports a one-character query', () => {
    expect(searchContent('SQLModel').some(result => result.sectionId === 'sqlmodel')).toBe(true);
    expect(searchContent('폼').length).toBeGreaterThan(0);
  });
});
