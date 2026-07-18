import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navData, type Note, type Section } from '../content';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNotePath } from '../navigation';

interface SidebarNavProps {
  activeSectionId?: string;
  activeNoteId?: string;
  onNavigate?: () => void;
}

function NavNoteItem({
  sectionId,
  note,
  isActive,
  onNavigate,
}: {
  sectionId: string;
  note: Note;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <li>
      <Link
        to={getNotePath(sectionId, note.id)}
        onClick={onNavigate}
        aria-label={`${note.navigationLabel ? `${note.navigationLabel} ` : ''}${note.displayTitle}`}
        aria-current={isActive ? 'page' : undefined}
        className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-[color] duration-200 ${
          isActive
            ? 'text-indigo-700 dark:text-dark-indigo-300 font-medium'
            : 'text-slate-600 dark:text-dark-slate-400 hover:text-slate-900 dark:hover:text-dark-slate-200 hover:bg-slate-100/50 dark:hover:bg-dark-slate-800/30'
        }`}
      >
        {isActive && (
          <div
            className="absolute inset-0 bg-indigo-50 dark:bg-dark-indigo-500/10 rounded-lg border border-indigo-100 dark:border-dark-indigo-500/20 shadow-sm"
          />
        )}
        <span className="relative z-10 min-w-0">
          {note.navigationLabel && (
            <span className="mb-0.5 block text-[10px] font-bold tracking-wide text-indigo-500 dark:text-dark-indigo-400">
              {note.navigationLabel}
            </span>
          )}
          <span className="block text-sm leading-snug transition-all duration-200">
            {note.displayTitle}
          </span>
        </span>
        {isActive && (
          <ChevronRight size={14} className="text-indigo-500 min-w-4 relative z-10" />
        )}
      </Link>
    </li>
  );
}

function NavSectionItem({
  section, 
  isExpanded, 
  activeNoteId,
  onToggle, 
  onNavigate 
}: { 
  section: Section,
  isExpanded: boolean, 
  activeNoteId?: string,
  onToggle: () => void, 
  onNavigate?: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1.5 rounded transition-colors ${
          isExpanded 
            ? 'text-indigo-600 dark:text-dark-indigo-400'
            : 'text-slate-400 dark:text-dark-slate-500 hover:text-slate-700 dark:hover:text-dark-slate-300'
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
              {section.notes.map((note) => (
                <NavNoteItem
                  key={note.id}
                  sectionId={section.id}
                  note={note}
                  isActive={activeNoteId === note.id}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SidebarNav({ activeSectionId, activeNoteId, onNavigate }: SidebarNavProps) {
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
          activeNoteId={activeNoteId}
          onToggle={() => {
            setExpandedSectionId(prev => prev === section.id ? null : section.id);
          }}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
