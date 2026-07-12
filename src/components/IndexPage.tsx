import { useEffect } from 'react';
import { navData } from '../content';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Layout from './Layout';

export default function IndexPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] dark:bg-[#090b10]">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl mb-4 shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Knowledge Directory
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Explore the complete index of topics, cheat sheets, and guidelines. Select a category below to dive in.
              </p>
            </motion.div>
          </div>

          {/* Masonry-like Grid Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
            {navData.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="break-inside-avoid mb-4 sm:mb-6 bg-white dark:bg-[#131620] rounded-xl shadow-sm border border-slate-200/70 dark:border-slate-800/80 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 leading-tight">
                      {section.title}
                    </h2>
                    <span className="flex-shrink-0 ml-3 inline-flex items-center justify-center h-5 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {section.categories.length}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {section.categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/${section.id}/${category.id}`}
                        className="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {category.title.split(':')[0]}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5 shrink-0 ml-2 opacity-0 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
