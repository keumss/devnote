import { useEffect } from 'react';
import { navData, navGroupData } from '../content';
import { Link } from 'react-router-dom';
import { BookOpen, Clock3, FileText, FolderKanban, Layers, Play } from 'lucide-react';
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
            className="mb-4 flex flex-col gap-3 border-b border-slate-200/80 pb-4 dark:border-dark-slate-800/80 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5"
            aria-labelledby="index-page-title"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] text-indigo-600 dark:text-dark-indigo-400 sm:text-[10px]">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.5} />
                DEVNOTE ROADMAP
              </p>
              <h1 id="index-page-title" className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-dark-slate-100 sm:text-2xl whitespace-nowrap">
                개발 학습 노트
              </h1>
              <p className="mt-1 text-xs text-slate-600 dark:text-dark-slate-400 sm:text-sm">
                체계적인 학습 순서에 따른 개발 기술 스택 로드맵을 탐색하세요.
              </p>
            </div>

            <dl className="flex shrink-0 items-center divide-x divide-slate-200/80 rounded-xl border border-slate-200/80 bg-white/80 p-1 shadow-xs backdrop-blur-xs dark:divide-dark-slate-800/80 dark:border-dark-slate-800/80 dark:bg-dark-slate-900/50 text-xs sm:text-sm self-start sm:self-auto">
              <div className="flex items-center gap-1.5 px-2 py-1.5 sm:gap-2.5 sm:px-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-dark-indigo-500/10 text-indigo-600 dark:text-dark-indigo-400">
                  <FolderKanban className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <dt className="text-[9px] font-semibold text-slate-500 dark:text-dark-slate-400 sm:text-[10px]">학습 그룹</dt>
                  <dd className="font-bold text-slate-900 dark:text-dark-slate-200">{navGroupData.length}개</dd>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 sm:gap-2.5 sm:px-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-dark-indigo-500/10 text-indigo-600 dark:text-dark-indigo-400">
                  <Layers className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <dt className="text-[9px] font-semibold text-slate-500 dark:text-dark-slate-400 sm:text-[10px]">학습 섹션</dt>
                  <dd className="font-bold text-slate-900 dark:text-dark-slate-200">{navData.length}개</dd>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 sm:gap-2.5 sm:px-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-dark-indigo-500/10 text-indigo-600 dark:text-dark-indigo-400">
                  <FileText className="h-4 w-4 shrink-0" />
                </div>
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
              className="mb-5 overflow-hidden rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-white p-4 shadow-xs dark:border-dark-indigo-500/20 dark:from-dark-indigo-500/15 dark:via-dark-indigo-500/5 dark:to-dark-slate-900/60 sm:mb-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5"
              aria-labelledby="continue-learning-title"
            >
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-indigo-600 dark:text-dark-indigo-300">
                  <Clock3 className="h-3.5 w-3.5 text-indigo-500 animate-pulse" strokeWidth={2.5} />
                  CONTINUE LEARNING
                </p>
                <h2 id="continue-learning-title" className="text-base font-bold tracking-tight text-slate-900 dark:text-dark-slate-200 sm:text-lg">
                  이어서 학습하기
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-dark-slate-200 sm:text-sm">
                  {continueLearning.section.title} · {continueLearning.note.title}
                </p>
                {continueLearning.topic && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-dark-slate-400 flex items-center gap-1.5">
                    <span>마지막으로 읽은 토픽:</span>
                    <span className="font-medium text-indigo-700 dark:text-dark-indigo-300 bg-indigo-100/60 dark:bg-dark-indigo-500/20 px-2 py-0.5 rounded text-[11px]">
                      {continueLearning.topic.title}
                    </span>
                  </p>
                )}
              </div>
              <Link
                to={{
                  pathname: getNotePath(continueLearning.section.id, continueLearning.note.id),
                  hash: continueLearning.topic ? getTopicHash(continueLearning.topic.id) : '',
                }}
                className="group mt-3.5 inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 transition-[color] hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-dark-indigo-400/20 dark:bg-dark-indigo-500/15 dark:text-dark-indigo-200 dark:hover:bg-dark-indigo-500/25 dark:focus-visible:ring-dark-indigo-400 dark:focus-visible:ring-offset-dark-slate-950 sm:mt-0 sm:shrink-0 sm:text-sm shadow-2xs"
              >
                이어서 읽기
                <Play className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="currentColor" />
              </Link>
            </motion.section>
          )}

          <section aria-labelledby="section-list-title">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-4 flex items-end justify-between gap-4 sm:mb-6"
            >
              <div>
                <p className="mb-0.5 flex items-center gap-1 text-[9px] font-bold tracking-[0.16em] text-indigo-600 dark:text-dark-indigo-400 sm:mb-1 sm:gap-1.5 sm:text-[10px]">
                  <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                  ROADMAP BY GROUPS
                </p>
                <h2 id="section-list-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 dark:text-dark-slate-200 sm:mt-1 sm:text-xl">
                  학습 로드맵 둘러보기
                </h2>
              </div>
              <p className="hidden text-sm text-slate-500 dark:text-dark-slate-400 sm:block">
                {navGroupData.length}개 그룹 · {totalNotes}개의 노트
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {navGroupData.map((group, groupIdx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * groupIdx }}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/40 p-4 shadow-xs dark:border-dark-slate-800/80 dark:bg-dark-slate-900/30 sm:p-5"
                >
                  <div className="mb-3.5 flex flex-col gap-1 border-b border-slate-200/60 pb-3 dark:border-dark-slate-800/60">
                    <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-dark-slate-100">
                      {group.title}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-slate-500 dark:text-dark-slate-400">
                        {group.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {group.sections.map((section, idx) => (
                      <LearningSectionCard
                        key={section.id}
                        section={section}
                        index={idx}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
