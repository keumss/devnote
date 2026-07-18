import type { NoteTopic } from '../content';

interface TopicNavProps {
  topics: NoteTopic[];
  onSelectTopic: (topicId: string) => void;
  activeTopicId?: string;
  compact?: boolean;
}

export default function TopicNav({
  topics,
  onSelectTopic,
  activeTopicId,
  compact = false,
}: TopicNavProps) {
  if (topics.length === 0) return null;

  const currentTopicId = activeTopicId ?? topics[0]?.id;

  return (
    <nav aria-label="이 노트의 목차">
      <ol className={compact ? 'space-y-1.5' : 'space-y-2'}>
        {topics.map((topic, index) => {
          const isActive = currentTopicId === topic.id;
          return (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => onSelectTopic(topic.id)}
                aria-label={`${index + 1}번 토픽: ${topic.title}`}
                aria-current={isActive ? 'location' : undefined}
                className={`group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm leading-snug outline-none transition-[color] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-dark-indigo-500/10 dark:text-dark-indigo-300'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-dark-slate-400 dark:hover:bg-dark-slate-800/70 dark:hover:text-dark-slate-200'
                }`}
              >
                <span className={`mt-0.5 shrink-0 text-xs font-bold ${
                  isActive ? 'text-indigo-500' : 'text-slate-400 dark:text-dark-slate-500'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{topic.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
