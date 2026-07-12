import { useEffect } from 'react';
import { navData } from '../content';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, FileText, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import Layout from './Layout';
import { getNotePath } from '../navigation';

const totalNotes = navData.reduce((count, section) => count + section.notes.length, 0);

export default function IndexPage() {
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
            className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-white px-5 py-7 shadow-sm dark:border-indigo-500/15 dark:bg-[#131620] sm:mb-10 sm:px-8 sm:py-9"
            aria-labelledby="index-page-title"
          >
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-100/70 blur-3xl dark:bg-indigo-500/10" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="h-4 w-4" strokeWidth={2.5} />
                  DEVNOTE LIBRARY
                </p>
                <h1 id="index-page-title" className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  개발 학습 노트
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                  기술별로 정리한 노트를 탐색하세요.
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-[22rem]">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/70 dark:bg-slate-900/60">
                  <dt className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Layers className="h-4 w-4 text-indigo-500" />
                    학습 섹션
                  </dt>
                  <dd className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {navData.length}<span className="ml-1 text-sm font-semibold text-slate-500 dark:text-slate-400">개</span>
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/70 dark:bg-slate-900/60">
                  <dt className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    학습 노트
                  </dt>
                  <dd className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {totalNotes}<span className="ml-1 text-sm font-semibold text-slate-500 dark:text-slate-400">개</span>
                  </dd>
                </div>
              </dl>
            </div>
          </motion.section>

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
