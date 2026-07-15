import { useEffect, useState } from 'react';
import type { NoteTopic } from '../content';

const ACTIVE_TOPIC_OFFSET = 120;

export function useReadingTopic(
  topics: NoteTopic[],
  contentRootId: string,
  selectedTopicId?: string,
) {
  const [readingTopicId, setReadingTopicId] = useState<string | undefined>(
    selectedTopicId ?? topics[0]?.id,
  );

  useEffect(() => {
    const matchingSelectedTopic = selectedTopicId && topics.some(topic => topic.id === selectedTopicId);
    setReadingTopicId(matchingSelectedTopic ? selectedTopicId : topics[0]?.id);
  }, [selectedTopicId, topics]);

  useEffect(() => {
    const topicElements = new Map<string, HTMLElement>();
    const collectTopics = () => {
      topics.forEach((topic) => {
        const element = document.getElementById(topic.id);
        if (element) topicElements.set(topic.id, element);
      });
    };

    const updateReadingTopic = () => {
      const availableTopics = topics
        .map(topic => topicElements.get(topic.id))
        .filter((element): element is HTMLElement => element !== undefined);
      if (availableTopics.length === 0) return;

      const readingTopic = availableTopics.reduce<HTMLElement | null>((currentTopic, topic) => (
        topic.getBoundingClientRect().top <= ACTIVE_TOPIC_OFFSET ? topic : currentTopic
      ), null) ?? availableTopics[0];
      setReadingTopicId(readingTopic.id);
    };

    let animationFrameId: number | null = null;
    const scheduleReadingTopicUpdate = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateReadingTopic();
      });
    };

    collectTopics();
    scheduleReadingTopicUpdate();

    const contentRoot = document.getElementById(contentRootId);
    const mutationObserver = typeof MutationObserver === 'undefined' || !contentRoot
      ? null
      : new MutationObserver(() => {
        collectTopics();
        updateReadingTopic();
      });
    mutationObserver?.observe(contentRoot, { childList: true, subtree: true });
    window.addEventListener('scroll', scheduleReadingTopicUpdate, { passive: true });

    return () => {
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', scheduleReadingTopicUpdate);
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    };
  }, [contentRootId, topics]);

  return readingTopicId;
}
