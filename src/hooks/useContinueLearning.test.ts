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
      sectionId: 'section-a',
      noteId: 'note-1',
      topicId: 'topic-a',
      topicTitle: 'Topic A',
    });

    expect(getContinueLearningItem()).toEqual({
      sectionId: 'section-a',
      noteId: 'note-1',
      topicId: 'topic-a',
      topicTitle: 'Topic A',
    });

    clearContinueLearningItem();
    expect(getContinueLearningItem()).toBeNull();
  });

  it('ignores malformed stored values', () => {
    window.localStorage.setItem('devnote-continue-learning', '{not json');

    expect(getContinueLearningItem()).toBeNull();
  });

  it('keeps stored values without a topic title compatible', () => {
    window.localStorage.setItem('devnote-continue-learning', JSON.stringify({
      sectionId: 'section-a',
      noteId: 'note-1',
      topicId: 'topic-a',
    }));

    expect(getContinueLearningItem()).toEqual({
      sectionId: 'section-a',
      noteId: 'note-1',
      topicId: 'topic-a',
    });
  });
});
