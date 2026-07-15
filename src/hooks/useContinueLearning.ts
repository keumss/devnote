export interface ContinueLearningItem {
  sectionId: string;
  noteId: string;
  topicId?: string;
}

const STORAGE_KEY = 'devnote-continue-learning';

function isContinueLearningItem(value: unknown): value is ContinueLearningItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Record<string, unknown>;
  return typeof item.sectionId === 'string'
    && item.sectionId.length > 0
    && typeof item.noteId === 'string'
    && item.noteId.length > 0
    && (item.topicId === undefined || typeof item.topicId === 'string');
}

export function getContinueLearningItem(): ContinueLearningItem | null {
  if (typeof window === 'undefined') return null;

  try {
    const savedItem = window.localStorage.getItem(STORAGE_KEY);
    if (!savedItem) return null;

    const item: unknown = JSON.parse(savedItem);
    return isContinueLearningItem(item) ? item : null;
  } catch {
    return null;
  }
}

export function saveContinueLearningItem(item: ContinueLearningItem) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  } catch {
    // Continuing from the last note is optional when browser storage is unavailable.
  }
}

export function clearContinueLearningItem() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore unavailable browser storage.
  }
}
