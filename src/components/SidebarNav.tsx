import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { navData, type CheatSheetCategory, type NavSection } from '../content';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategoryPath } from '../navigation';

interface SidebarNavProps {
  activeSectionId?: string;
  activeCategoryId?: string;
  onNavigate?: () => void;
}

const NavCategoryItem = memo(({ 
  category, 
  isActive, 
  onClick 
}: { 
  category: CheatSheetCategory,
  isActive: boolean, 
  onClick: () => void 
}) => {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
          isActive
            ? 'text-indigo-700 dark:text-indigo-300 font-medium'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
        }`}
      >
        {isActive && (
          <div
            className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          />
        )}
        <span className={`text-sm leading-snug relative z-10 transition-all duration-200`}>
          {category.displayTitle}
        </span>
        {isActive && (
          <ChevronRight size={14} className="text-indigo-500 min-w-4 relative z-10" />
        )}
      </button>
    </li>
  );
});

const NavSectionItem = memo(({ 
  section, 
  isExpanded, 
  activeCategoryId, 
  onToggle, 
  onNavigate 
}: { 
  section: NavSection,
  isExpanded: boolean, 
  activeCategoryId?: string, 
  onToggle: () => void, 
  onNavigate?: () => void 
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1.5 rounded transition-colors ${
          isExpanded 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <span>{section.title}</span>
        <ChevronDown size={14} className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="space-y-1 pb-2">
              {section.categories.map((category) => (
                <NavCategoryItem
                  key={category.id}
                  category={category}
                  isActive={activeCategoryId === category.id}
                  onClick={() => {
                    navigate(getCategoryPath(section.id, category.id));
                    if (onNavigate) onNavigate();
                  }}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function SidebarNav({ activeSectionId, activeCategoryId, onNavigate }: SidebarNavProps) {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(activeSectionId || null);

  useEffect(() => {
    if (activeSectionId) {
      setExpandedSectionId(activeSectionId);
    }
  }, [activeSectionId]);

  return (
    <nav className="space-y-4">
      {navData.map((section) => (
        <NavSectionItem
          key={section.id}
          section={section}
          isExpanded={expandedSectionId === section.id}
          activeCategoryId={activeCategoryId}
          onToggle={() => {
            setExpandedSectionId(prev => prev === section.id ? null : section.id);
          }}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
