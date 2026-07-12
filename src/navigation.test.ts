import { describe, expect, it } from 'vitest';
import { getCategoryPath, getHashTarget, getItemHash, resolveCategory } from './navigation';

describe('navigation helpers', () => {
  it('encodes category paths and item hashes', () => {
    expect(getCategoryPath('sql model', 'part/1')).toBe('/sql%20model/part%2F1');
    expect(getItemHash('관계 설정')).toBe('#%EA%B4%80%EA%B3%84%20%EC%84%A4%EC%A0%95');
  });

  it('decodes valid hashes and safely handles malformed hashes', () => {
    expect(getHashTarget('#%EA%B4%80%EA%B3%84%20%EC%84%A4%EC%A0%95')).toBe('관계 설정');
    expect(getHashTarget('#bad%')).toBe('bad%');
    expect(getHashTarget('')).toBeNull();
  });

  it('resolves exact routes and canonical fallbacks', () => {
    const sections = [
      { id: 'sql', categories: [{ id: 'part1' }, { id: 'part2' }] },
      { id: 'python', categories: [{ id: 'intro' }] },
    ];

    expect(resolveCategory(sections, 'sql', 'part2')).toMatchObject({
      section: sections[0],
      category: sections[0].categories[1],
      isExact: true,
    });
    expect(resolveCategory(sections, 'sql', 'missing')).toMatchObject({
      section: sections[0],
      category: sections[0].categories[0],
      isExact: false,
    });
    expect(resolveCategory(sections, 'missing', 'part2')).toMatchObject({
      section: sections[0],
      category: sections[0].categories[0],
      isExact: false,
    });
    expect(resolveCategory([], 'missing', 'part2')).toBeNull();
  });
});
