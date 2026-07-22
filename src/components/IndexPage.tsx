import { useEffect } from 'react';
import { navData } from '../content';
import { Link } from 'react-router-dom';
import { BookOpen, Clock3, FileText, Layers, Play } from 'lucide-react';
import { motion } from 'motion/react';
import Layout from './Layout';
import { getNotePath, getTopicHash } from '../navigation';
import { getContinueLearningItem } from '../hooks/useContinueLearning';
import LearningSectionCard from './LearningSectionCard';

const totalNotes = navData.reduce((count, section) => count + section.notes.length, 0);

function getContinueLearning() {
  const item = getContinueLearningItem();
  if (!item) return null;

  const section = navData.find(candidate => candidate.id === item.sectionId);
  const note = section?.notes.find(candidate => candidate.id === item.noteId);
  if (!section || !note) return null;

  const topic = item.topicId
    ? note.topics.find(candidate => candidate.id === item.topicId)
    : undefined;

  return { section, note, topic };
}

export default function IndexPage() {
  const continueLearning = getContinueLearning();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <main className="flex-1 bg-slate-50 px-3 py-3.5 dark:bg-surface-canvas sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.section
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex flex-row items-center justify-between gap-2 border-b border-slate-200 pb-3.5 dark:border-dark-slate-800 sm:mb-5 sm:gap-4 sm:pb-4"
            aria-labelledby="index-page-title"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 flex items-center gap-1 text-[9px] font-bold tracking-[0.16em] text-indigo-600 dark:text-dark-indigo-400 sm:mb-1 sm:gap-1.5 sm:text-[10px]">
                <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                DEVNOTE LIBRARY
              </p>
              <h1 id="index-page-title" className="text-base font-bold tracking-tight text-slate-950 dark:text-dark-slate-200 sm:text-xl">
                개발 학습 노트
              </h1>
              <p className="mt-0.5 truncate text-[11px] text-slate-600 dark:text-dark-slate-400 sm:text-sm">
                기술별로 정리한 노트를 탐색하세요.
              </p>
            </div>

            <dl className="flex shrink-0 items-center divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white/60 text-xs dark:divide-dark-slate-800 dark:border-dark-slate-800 dark:bg-dark-slate-900/40 sm:rounded-xl sm:text-sm">
              <div className="flex items-center gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-3.5">
                <Layers className="h-3.5 w-3.5 shrink-0 text-indigo-500 sm:h-4 sm:w-4" />
                <div>
                  <dt className="text-[9px] font-semibold text-slate-500 dark:text-dark-slate-400 sm:text-[10px]">학습 섹션</dt>
                  <dd className="font-bold text-slate-900 dark:text-dark-slate-200">{navData.length}개</dd>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-3.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-indigo-500 sm:h-4 sm:w-4" />
                <div>
                  <dt className="text-[9px] font-semibold text-slate-500 dark:text-dark-slate-400 sm:text-[10px]">학습 노트</dt>
                  <dd className="font-bold text-slate-900 dark:text-dark-slate-200">{totalNotes}개</dd>
                </div>
              </div>
            </dl>
          </motion.section>

          {continueLearning && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="mb-4 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-3.5 shadow-sm dark:border-dark-indigo-500/20 dark:from-dark-indigo-500/10 dark:to-dark-slate-900/60 sm:mb-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-4"
              aria-labelledby="continue-learning-title"
            >
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-indigo-600 dark:text-dark-indigo-300">
                  <Clock3 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  CONTINUE LEARNING
                </p>
                <h2 id="continue-learning-title" className="text-base font-bold tracking-tight text-slate-900 dark:text-dark-slate-200 sm:text-lg">
                  이어서 학습하기
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-700 dark:text-dark-slate-200 sm:text-sm">
                  {continueLearning.section.title} · {continueLearning.note.title}
                </p>
                {continueLearning.topic && (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-dark-slate-400">
                    마지막으로 읽은 토픽: {continueLearning.topic.title}
                  </p>
                )}
              </div>
              <Link
                to={{
                  pathname: getNotePath(continueLearning.section.id, continueLearning.note.id),
                  hash: continueLearning.topic ? getTopicHash(continueLearning.topic.id) : '',
                }}
                className="mt-3 inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 transition-[color] hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-dark-indigo-400/20 dark:bg-dark-indigo-500/15 dark:text-dark-indigo-200 dark:hover:bg-dark-indigo-500/25 dark:focus-visible:ring-dark-indigo-400 dark:focus-visible:ring-offset-dark-slate-950 sm:mt-0 sm:shrink-0 sm:text-sm"
              >
                이어서 읽기
                <Play className="h-3.5 w-3.5" fill="currentColor" />
              </Link>
            </motion.section>
          )}

          <section aria-labelledby="section-list-title">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-3.5 flex items-end justify-between gap-4 sm:mb-4"
            >
              <div>
                <p className="mb-0.5 flex items-center gap-1 text-[9px] font-bold tracking-[0.16em] text-indigo-600 dark:text-dark-indigo-400 sm:mb-1 sm:gap-1.5 sm:text-[10px]">
                  <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                  EXPLORE BY TOPIC
                </p>
                <h2 id="section-list-title" className="mt-0.5 text-base font-bold tracking-tight text-slate-900 dark:text-dark-slate-200 sm:mt-1 sm:text-xl">
                  학습 노트 둘러보기
                </h2>
              </div>
              <p className="hidden text-sm text-slate-500 dark:text-dark-slate-400 sm:block">
                {totalNotes}개의 노트
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 sm:gap-5">
              {navData.map((section, idx) => (
                <LearningSectionCard
                  key={section.id}
                  section={section}
                  index={idx}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
