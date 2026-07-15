import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NoteTopic } from '../content';
import { useReadingTopic } from './useReadingTopic';

const CONTENT_ROOT_ID = 'reading-topic-test-root';

function ReadingTopicProbe({ topics }: { topics: NoteTopic[] }) {
  const readingTopicId = useReadingTopic(topics, CONTENT_ROOT_ID);
  return <output aria-label="현재 읽는 토픽">{readingTopicId}</output>;
}

describe('useReadingTopic', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    document.getElementById(CONTENT_ROOT_ID)?.remove();
  });

  it('updates when headings are inserted after a note transition', () => {
    class MockMutationObserver {
      static instances: MockMutationObserver[] = [];
      readonly callback: MutationCallback;

      constructor(callback: MutationCallback) {
        this.callback = callback;
        MockMutationObserver.instances.push(this);
      }

      observe() {}
      disconnect() {}
    }

    vi.stubGlobal('MutationObserver', MockMutationObserver);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const contentRoot = document.createElement('main');
    contentRoot.id = CONTENT_ROOT_ID;
    document.body.append(contentRoot);

    const nextTopics = [
      { id: 'previous-topic', title: '이전 토픽' },
      { id: 'next-topic', title: '다음 노트 토픽' },
    ];
    const { rerender } = render(<ReadingTopicProbe topics={[{ id: 'first-topic', title: '첫 번째 토픽' }]} />);

    rerender(<ReadingTopicProbe topics={nextTopics} />);

    const previousHeading = document.createElement('h2');
    previousHeading.id = 'previous-topic';
    previousHeading.getBoundingClientRect = () => ({ top: -20 } as DOMRect);
    const nextHeading = document.createElement('h2');
    nextHeading.id = 'next-topic';
    nextHeading.getBoundingClientRect = () => ({ top: 80 } as DOMRect);
    contentRoot.append(previousHeading, nextHeading);

    const currentMutationObserver = MockMutationObserver.instances.at(-1);
    act(() => {
      currentMutationObserver?.callback([], currentMutationObserver as unknown as MutationObserver);
    });

    expect(screen.getByLabelText('현재 읽는 토픽')).toHaveTextContent('next-topic');
  });
});
