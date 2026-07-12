export function getNotePath(sectionId: string, noteId: string) {
  return `/${encodeURIComponent(sectionId)}/${encodeURIComponent(noteId)}`;
}

export function getTopicHash(topicId: string) {
  return `#${encodeURIComponent(topicId)}`;
}

export function getHashTarget(hash: string) {
  if (!hash) return null;

  const encodedTarget = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!encodedTarget) return null;

  try {
    return decodeURIComponent(encodedTarget);
  } catch {
    return encodedTarget;
  }
}

interface NavigableNote {
  id: string;
}

interface NavigableSection {
  id: string;
  notes: readonly NavigableNote[];
}

export function resolveNote<TSection extends NavigableSection>(
  sections: readonly TSection[],
  sectionId: string | undefined,
  noteId: string | undefined,
): {
  section: TSection;
  note: TSection['notes'][number];
  isExact: boolean;
} | null {
  const requestedSection = sections.find(section => section.id === sectionId);
  const section = requestedSection ?? sections[0];
  const requestedNote = requestedSection?.notes.find(note => note.id === noteId) as
    | TSection['notes'][number]
    | undefined;
  const fallbackNote = section?.notes[0] as TSection['notes'][number] | undefined;
  const note = requestedNote ?? fallbackNote;

  if (!section || !note) return null;

  return {
    section,
    note,
    isExact: Boolean(requestedSection && requestedNote),
  };
}
