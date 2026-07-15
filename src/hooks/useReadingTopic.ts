import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { NoteTopic } from '../content';

const ACTIVE_TOPIC_OFFSET = 120;

function getInitialTopicId(topics: NoteTopic[], selectedTopicId?: string) {
  const hasSelectedTopic = selectedTopicId && topics.some(topic => topic.id === selectedTopicId);
  return hasSelectedTopic ? selectedTopicId : topics[0]?.id;
}

export function useReadingTopic(
  topics: NoteTopic[],
  contentRootRef: RefObject<HTMLElement | null>,
  selectedTopicId?: string,
) {
  const [readingTopicId, setReadingTopicId] = useState<string | undefined>(() => (
    getInitialTopicId(topics, selectedTopicId)
  ));
  const readingTopicIdRef = useRef(readingTopicId);

  const updateReadingTopicId = useCallback((nextTopicId: string | undefined) => {
    if (readingTopicIdRef.current === nextTopicId) return;

    readingTopicIdRef.current = nextTopicId;
    setReadingTopicId(nextTopicId);
  }, []);

  useEffect(() => {
    updateReadingTopicId(getInitialTopicId(topics, selectedTopicId));
  }, [selectedTopicId, topics, updateReadingTopicId]);

  useEffect(() => {
    const getTopicElements = () => {
      const contentRoot = contentRootRef.current;
      if (!contentRoot) return [];

      const elementsById = new Map(
        Array.from(contentRoot.querySelectorAll<HTMLElement>('h2[id]'))
          .map(element => [element.id, element]),
      );
      return topics
        .map(topic => elementsById.get(topic.id))
        .filter((element): element is HTMLElement => element !== undefined);
    };

    const updateReadingTopic = () => {
      const availableTopics = getTopicElements();
      if (availableTopics.length === 0) return;

      const readingTopic = availableTopics.reduce<HTMLElement | null>((currentTopic, topic) => (
        topic.getBoundingClientRect().top <= ACTIVE_TOPIC_OFFSET ? topic : currentTopic
      ), null) ?? availableTopics[0];
      updateReadingTopicId(readingTopic.id);
    };

    let animationFrameId: number | null = null;
    const scheduleReadingTopicUpdate = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateReadingTopic();
      });
    };

    scheduleReadingTopicUpdate();

    const contentRoot = contentRootRef.current;
    const mutationObserver = typeof MutationObserver === 'undefined' || !contentRoot
      ? null
      : new MutationObserver(() => {
        updateReadingTopic();
      });
    mutationObserver?.observe(contentRoot, { childList: true, subtree: true });
    window.addEventListener('scroll', scheduleReadingTopicUpdate, { passive: true });

    return () => {
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', scheduleReadingTopicUpdate);
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    };
  }, [contentRootRef, topics, updateReadingTopicId]);

  return readingTopicId;
}
