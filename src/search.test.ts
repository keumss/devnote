import { describe, expect, it } from 'vitest';
import { searchContent } from './search';

describe('searchContent', () => {
  it('indexes headings and their structured content', () => {
    const results = searchContent('SELECT');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(result => result.item.title.toLowerCase().includes('select'))).toBe(true);
    expect(results.every(result => result.item.id && result.item.content)).toBe(true);
  });

  it('searches section/category titles and supports a one-character query', () => {
    expect(searchContent('SQLModel').some(result => result.sectionId === 'sqlmodel')).toBe(true);
    expect(searchContent('폼').length).toBeGreaterThan(0);
  });
});
