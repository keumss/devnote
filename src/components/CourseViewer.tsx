import { Suspense, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import NavigationButton from './NavigationButton';
import SidebarNav from './SidebarNav';
import Layout from './Layout';
import { navData } from '../content';
import { mdxComponents } from './MdxContent';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategoryPath, getHashTarget, resolveCategory } from '../navigation';

function ScrollToContent({ hash, navigationKey }: { hash: string; navigationKey: string }) {
  useEffect(() => {
    const targetId = getHashTarget(hash);
    if (!targetId) {
      window.scrollTo(0, 0);
      return;
    }

    const prefersReducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(targetId)?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [hash, navigationKey]);

  return null;
}

function ContentLoader() {
  return (
    <div className="space-y-4 py-4" role="status" aria-label="문서 불러오는 중">
      <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}

const allCategories = navData.flatMap(section => (
  section.categories.map(category => ({
    sectionId: section.id,
    sectionTitle: section.title,
    category,
  }))
));

export default function CourseViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId: paramSectionId, categoryId: paramCategoryId } = useParams();

  const resolvedCategory = resolveCategory(navData, paramSectionId, paramCategoryId);
  if (!resolvedCategory) {
    return <Navigate to="/" replace />;
  }

  const { section: activeSection, category: activeCategory, isExact } = resolvedCategory;
  
  const activeSectionId = activeSection.id;
  const activeCategoryId = activeCategory.id;

  const currentCategoryIndex = allCategories.findIndex(categoryInfo => (
    categoryInfo.sectionId === activeSectionId && categoryInfo.category.id === activeCategoryId
  ));
  const prevCategoryInfo = currentCategoryIndex > 0 ? allCategories[currentCategoryIndex - 1] : null;
  const nextCategoryInfo = currentCategoryIndex < allCategories.length - 1 ? allCategories[currentCategoryIndex + 1] : null;

  if (!isExact) {
    return (
      <Navigate
        to={getCategoryPath(activeSectionId, activeCategoryId)}
        replace
      />
    );
  }

  return (
    <Layout activeSectionId={activeSectionId} activeCategoryId={activeCategoryId}>
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row shadow-sm bg-white dark:bg-[#090b10] transition-colors duration-200">
        
        {/* Desktop Left Sidebar Navigation */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 min-h-[calc(100vh-4rem)] transition-colors duration-200">
          <div className="sticky top-16 pt-8 px-6 pb-12 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-6 px-1 text-slate-800 dark:text-slate-200 font-semibold text-sm uppercase tracking-wider">
              <BookOpen size={16} />
              <span>Curriculum</span>
            </div>
            <SidebarNav activeSectionId={activeSectionId} activeCategoryId={activeCategoryId} />
          </div>
        </aside>

        {/* Main Learning Content Area */}
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 lg:py-12 min-h-[calc(100vh-4rem)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-10 block">
                <span className="inline-block py-1.5 px-3 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-widest mb-4 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                  {activeSection.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                  {activeCategory.title}
                </h2>
              </div>

              <div className="lesson-content">
                <Suspense fallback={<ContentLoader />}>
                  <activeCategory.Content components={mdxComponents} />
                  <ScrollToContent hash={location.hash} navigationKey={location.key} />
                </Suspense>
              </div>
              
              {/* Page Navigation */}
              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                {prevCategoryInfo ? (
                  <NavigationButton 
                    direction="prev"
                    info={prevCategoryInfo}
                    onClick={() => navigate(getCategoryPath(prevCategoryInfo.sectionId, prevCategoryInfo.category.id))}
                  />
                ) : <div />}
                
                {nextCategoryInfo ? (
                  <NavigationButton 
                    direction="next"
                    info={nextCategoryInfo}
                    onClick={() => navigate(getCategoryPath(nextCategoryInfo.sectionId, nextCategoryInfo.category.id))}
                  />
                ) : <div />}
              </div>

              {/* Navigation Footer */}
              <div className="mt-16 pt-8 flex justify-center items-center text-sm text-slate-400 dark:text-slate-500 pb-8">
                 <p>© DevNote - Knowledge Base</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
