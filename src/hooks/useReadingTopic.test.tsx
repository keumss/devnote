import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NoteTopic } from '../content';
import { useReadingTopic } from './useReadingTopic';

const CONTENT_ROOT_ID = 'reading-topic-test-root';

function ReadingTopicProbe({ topics, withHeadings = false }: { topics: NoteTopic[]; withHeadings?: boolean }) {
  const contentRootRef = useRef<HTMLElement>(null);
  const readingTopicId = useReadingTopic(topics, contentRootRef);

  return (
    <>
      <main ref={contentRootRef} id={CONTENT_ROOT_ID}>
        {withHeadings && topics.map(topic => <h2 key={topic.id} id={topic.id}>{topic.title}</h2>)}
      </main>
      <output aria-label="현재 읽는 토픽">{readingTopicId}</output>
    </>
  );
}

describe('useReadingTopic', () => {
  afterEach(() => {
    cleanup();
    document.querySelector('[data-previous-note-heading]')?.remove();
    vi.unstubAllGlobals();
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

    const nextTopics = [
      { id: 'previous-topic', title: '이전 토픽' },
      { id: 'next-topic', title: '다음 노트 토픽' },
    ];
    const { rerender } = render(<ReadingTopicProbe topics={[{ id: 'first-topic', title: '첫 번째 토픽' }]} />);

    rerender(<ReadingTopicProbe topics={nextTopics} />);

    const contentRoot = document.getElementById(CONTENT_ROOT_ID)!;
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

  it('ignores headings outside the current note content', () => {
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

    const previousNoteHeading = document.createElement('h2');
    previousNoteHeading.id = 'shared-topic';
    previousNoteHeading.dataset.previousNoteHeading = 'true';
    previousNoteHeading.getBoundingClientRect = () => ({ top: -20 } as DOMRect);
    document.body.append(previousNoteHeading);

    render(
      <ReadingTopicProbe
        topics={[
          { id: 'current-topic', title: '현재 토픽' },
          { id: 'shared-topic', title: '공유 토픽' },
        ]}
      />,
    );

    const contentRoot = document.getElementById(CONTENT_ROOT_ID)!;
    const currentHeading = document.createElement('h2');
    currentHeading.id = 'current-topic';
    currentHeading.getBoundingClientRect = () => ({ top: -20 } as DOMRect);
    const sharedHeading = document.createElement('h2');
    sharedHeading.id = 'shared-topic';
    sharedHeading.getBoundingClientRect = () => ({ top: 200 } as DOMRect);
    contentRoot.append(currentHeading, sharedHeading);

    const currentMutationObserver = MockMutationObserver.instances.at(-1);
    act(() => {
      currentMutationObserver?.callback([], currentMutationObserver as unknown as MutationObserver);
    });

    expect(screen.getByLabelText('현재 읽는 토픽')).toHaveTextContent('current-topic');
    previousNoteHeading.remove();
  });

  it('reuses cached heading elements across scroll updates', () => {
    const frameCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frameCallbacks.push(callback);
      return frameCallbacks.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const querySelectorAllSpy = vi.spyOn(Element.prototype, 'querySelectorAll');
    const topics = [
      { id: 'first-topic', title: '첫 번째 토픽' },
      { id: 'second-topic', title: '두 번째 토픽' },
    ];

    render(<ReadingTopicProbe topics={topics} withHeadings />);
    const headings = document.querySelectorAll<HTMLElement>(`#${CONTENT_ROOT_ID} h2`);
    headings[0].getBoundingClientRect = () => ({ top: -20 } as DOMRect);
    headings[1].getBoundingClientRect = () => ({ top: 80 } as DOMRect);

    act(() => {
      frameCallbacks.splice(0).forEach(callback => callback(0));
    });
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    act(() => {
      frameCallbacks.splice(0).forEach(callback => callback(0));
    });

    const topicQueries = querySelectorAllSpy.mock.calls.filter(([selector]) => selector === 'h2[id]');
    expect(topicQueries).toHaveLength(1);
    expect(screen.getByLabelText('현재 읽는 토픽')).toHaveTextContent('second-topic');
  });
});
