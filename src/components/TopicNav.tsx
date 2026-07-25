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
  const currentIndex = Math.max(0, topics.findIndex(t => t.id === currentTopicId));
  const progressPercent = Math.round(((currentIndex + 1) / topics.length) * 100);

  return (
    <nav aria-label="이 노트의 목차" className="space-y-3.5">
      {!compact && (
        <div className="space-y-1.5 px-0.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-dark-slate-400">
            <span className="font-medium text-slate-600 dark:text-dark-slate-400">학습 진행</span>
            <span className="font-bold text-indigo-600 dark:text-dark-indigo-400">
              {currentIndex + 1} / {topics.length} ({progressPercent}%)
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-dark-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300 ease-out dark:bg-dark-indigo-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="ml-1 pl-2 border-l border-slate-200/70 dark:border-dark-slate-800/70">
        <ol className={compact ? 'space-y-1' : 'space-y-1'}>
          {topics.map((topic, index) => {
            const isActive = currentTopicId === topic.id;
            return (
              <li key={topic.id}>
                <button
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  aria-label={`${index + 1}번 토픽: ${topic.title}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs leading-normal outline-none transition-[color] duration-150 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-indigo-50/80 font-normal text-indigo-600 dark:bg-dark-indigo-500/10 dark:text-dark-indigo-300'
                      : 'text-slate-600 font-normal hover:bg-slate-100/60 hover:text-slate-900 dark:text-dark-slate-400 dark:hover:bg-dark-slate-800/70 dark:hover:text-dark-slate-200'
                  }`}
                >
                  <span className={`mt-0.5 shrink-0 text-[10px] font-bold ${
                    isActive ? 'text-indigo-500 dark:text-dark-indigo-400' : 'text-slate-400 dark:text-dark-slate-500'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">{topic.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

