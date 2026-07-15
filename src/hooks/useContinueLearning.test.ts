import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  clearContinueLearningItem,
  getContinueLearningItem,
  saveContinueLearningItem,
} from './useContinueLearning';

describe('continue learning storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('stores the last note and optional topic', () => {
    saveContinueLearningItem({
      sectionId: 'sql',
      noteId: 'sql-part1',
      topicId: 'select',
    });

    expect(getContinueLearningItem()).toEqual({
      sectionId: 'sql',
      noteId: 'sql-part1',
      topicId: 'select',
    });

    clearContinueLearningItem();
    expect(getContinueLearningItem()).toBeNull();
  });

  it('ignores malformed stored values', () => {
    window.localStorage.setItem('devnote-continue-learning', '{not json');

    expect(getContinueLearningItem()).toBeNull();
  });
});
