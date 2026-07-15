import { useEffect } from 'react';
import { navData } from '../content';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Clock3, FileText, Layers, Play } from 'lucide-react';
import { motion } from 'motion/react';
import Layout from './Layout';
import { getNotePath, getTopicHash } from '../navigation';
import { getContinueLearningItem } from '../hooks/useContinueLearning';

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
      <main className="flex-1 bg-slate-50 px-4 py-8 dark:bg-[#090b10] sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.section
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-7"
            aria-labelledby="index-page-title"
          >
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.5} />
                DEVNOTE LIBRARY
              </p>
              <h1 id="index-page-title" className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                개발 학습 노트
              </h1>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                기술별로 정리한 노트를 탐색하세요.
              </p>
            </div>

            <dl className="flex items-center divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white/60 text-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-1 items-center gap-2 px-3 py-2.5 sm:px-4">
                <Layers className="h-4 w-4 shrink-0 text-indigo-500" />
                <div>
                  <dt className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">학습 섹션</dt>
                  <dd className="font-bold text-slate-900 dark:text-white">{navData.length}개</dd>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 px-3 py-2.5 sm:px-4">
                <FileText className="h-4 w-4 shrink-0 text-indigo-500" />
                <div>
                  <dt className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">학습 노트</dt>
                  <dd className="font-bold text-slate-900 dark:text-white">{totalNotes}개</dd>
                </div>
              </div>
            </dl>
          </motion.section>

          {continueLearning && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="mb-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-slate-900/60 sm:mb-10 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6"
              aria-labelledby="continue-learning-title"
            >
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-indigo-600 dark:text-indigo-300">
                  <Clock3 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  CONTINUE LEARNING
                </p>
                <h2 id="continue-learning-title" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  이어서 학습하기
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {continueLearning.section.title} · {continueLearning.note.title}
                </p>
                {continueLearning.topic && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    마지막으로 읽은 토픽: {continueLearning.topic.title}
                  </p>
                )}
              </div>
              <Link
                to={{
                  pathname: getNotePath(continueLearning.section.id, continueLearning.note.id),
                  hash: continueLearning.topic ? getTopicHash(continueLearning.topic.id) : '',
                }}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-950 sm:mt-0 sm:shrink-0"
              >
                이어서 읽기
                <Play className="h-4 w-4" fill="currentColor" />
              </Link>
            </motion.section>
          )}

          <section aria-labelledby="section-list-title">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-5 flex items-end justify-between gap-4 sm:mb-6"
            >
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-indigo-600 dark:text-indigo-400">EXPLORE BY TOPIC</p>
                <h2 id="section-list-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                  학습 노트 둘러보기
                </h2>
              </div>
              <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                {totalNotes}개의 노트
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {navData.map((section, idx) => (
                <motion.article
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-[#131620]"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800/80">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-extrabold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">학습 섹션</p>
                        <h3 className="mt-1 text-base font-bold leading-tight text-slate-900 dark:text-slate-50">
                          {section.title}
                        </h3>
                      </div>
                    </div>
                    <span className="ml-3 inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {section.notes.length}개
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-2.5">
                    {section.notes.map((note) => (
                      <Link
                        key={note.id}
                        to={getNotePath(section.id, note.id)}
                        className="group flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:focus-visible:bg-indigo-500/10"
                      >
                        <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-indigo-700 group-focus-visible:text-indigo-700 dark:text-slate-300 dark:group-hover:text-indigo-300 dark:group-focus-visible:text-indigo-300">
                          {note.displayTitle}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-300 dark:group-focus-visible:text-indigo-300" />
                      </Link>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
