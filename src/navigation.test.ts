import { describe, expect, it } from 'vitest';
import { getNotePath, getHashTarget, getTopicHash, resolveNote } from './navigation';

describe('navigation helpers', () => {
  it('encodes note paths and topic hashes', () => {
    expect(getNotePath('sql model', 'part/1')).toBe('/sql%20model/part%2F1');
    expect(getTopicHash('관계 설정')).toBe('#%EA%B4%80%EA%B3%84%20%EC%84%A4%EC%A0%95');
  });

  it('decodes valid hashes and safely handles malformed hashes', () => {
    expect(getHashTarget('#%EA%B4%80%EA%B3%84%20%EC%84%A4%EC%A0%95')).toBe('관계 설정');
    expect(getHashTarget('#bad%')).toBe('bad%');
    expect(getHashTarget('')).toBeNull();
  });

  it('resolves exact routes and canonical fallbacks', () => {
    const sections = [
      { id: 'sql', notes: [{ id: 'part1' }, { id: 'part2' }] },
      { id: 'python', notes: [{ id: 'intro' }] },
    ];

    expect(resolveNote(sections, 'sql', 'part2')).toMatchObject({
      section: sections[0],
      note: sections[0].notes[1],
      isExact: true,
    });
    expect(resolveNote(sections, 'sql', 'missing')).toMatchObject({
      section: sections[0],
      note: sections[0].notes[0],
      isExact: false,
    });
    expect(resolveNote(sections, 'missing', 'part2')).toMatchObject({
      section: sections[0],
      note: sections[0].notes[0],
      isExact: false,
    });
    expect(resolveNote([], 'missing', 'part2')).toBeNull();
  });
});
