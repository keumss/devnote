import { describe, expect, it } from 'vitest';
import { getNotePath, getHashTarget, getTopicHash, resolveNote } from './navigation';

describe('navigation helpers', () => {
  it('encodes note paths and topic hashes', () => {
    expect(getNotePath('section name', 'note/1')).toBe('/section%20name/note%2F1');
    expect(getTopicHash('관계 설정')).toBe('#%EA%B4%80%EA%B3%84%20%EC%84%A4%EC%A0%95');
  });

  it('decodes valid hashes and safely handles malformed hashes', () => {
    expect(getHashTarget('#%EA%B4%80%EA%B3%84%20%EC%84%A4%EC%A0%95')).toBe('관계 설정');
    expect(getHashTarget('#bad%')).toBe('bad%');
    expect(getHashTarget('')).toBeNull();
  });

  it('resolves exact routes and canonical fallbacks', () => {
    const sections = [
      { id: 'section-a', notes: [{ id: 'note-1' }, { id: 'note-2' }] },
      { id: 'section-b', notes: [{ id: 'note-1' }] },
    ];

    expect(resolveNote(sections, 'section-a', 'note-2')).toMatchObject({
      section: sections[0],
      note: sections[0].notes[1],
      isExact: true,
    });
    expect(resolveNote(sections, 'section-a', 'missing')).toMatchObject({
      section: sections[0],
      note: sections[0].notes[0],
      isExact: false,
    });
    expect(resolveNote(sections, 'missing', 'note-2')).toMatchObject({
      section: sections[0],
      note: sections[0].notes[0],
      isExact: false,
    });
    expect(resolveNote([], 'missing', 'part2')).toBeNull();
  });
});
