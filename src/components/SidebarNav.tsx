import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navGroupData, type Note, type Section } from '../content';
import { ChevronDown } from 'lucide-react';
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
        className={`w-full flex items-start justify-between px-2.5 py-1.5 rounded-md text-left transition-[color] duration-150 ${
          isActive
            ? 'bg-indigo-50/80 dark:bg-dark-indigo-500/15 text-indigo-600 dark:text-dark-indigo-300 font-normal'
            : 'text-slate-600 dark:text-dark-slate-400 hover:text-slate-900 dark:hover:text-dark-slate-200 hover:bg-slate-100 dark:hover:bg-dark-slate-800/50 font-normal'
        }`}
      >
        <span className="min-w-0">
          {note.navigationLabel && (
            <span className="block text-[11px] font-semibold text-indigo-500/90 dark:text-dark-indigo-400 mb-0.5">
              {note.navigationLabel}
            </span>
          )}
          <span className="block text-[13px] leading-normal">
            {note.displayTitle}
          </span>
        </span>
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
  const isSectionActive = activeNoteId ? section.notes.some((n) => n.id === activeNoteId) : false;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={`w-full flex items-center justify-between text-left text-[13px] font-semibold px-2.5 py-1.5 rounded-md transition-colors ${
          isSectionActive
            ? 'text-indigo-600 dark:text-dark-indigo-400'
            : 'text-slate-700 dark:text-dark-slate-300 hover:text-slate-900 dark:hover:text-dark-slate-100 hover:bg-slate-100 dark:hover:bg-dark-slate-800/50'
        }`}
      >
        <span className="truncate">{section.title}</span>
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          <span className="text-[11px] font-medium text-slate-400 dark:text-dark-slate-500">
            {section.notes.length}
          </span>
          <ChevronDown size={14} className={`transform transition-transform duration-200 text-slate-400 dark:text-dark-slate-500 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        aria-hidden={isExpanded ? undefined : true}
        inert={isExpanded ? undefined : true}
      >
        <div className="overflow-hidden">
          <div className="ml-3 pl-2.5 my-1 border-l border-slate-200/70 dark:border-dark-slate-800/70">
              <ul className="space-y-0.5">
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
          </div>
        </div>
      </div>
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
      {navGroupData.map((group) => (
        <div
          key={group.id}
          className="pt-3 first:pt-0 space-y-0.5"
        >
          {group.title && (
            <div className="px-2 py-1 text-xs font-bold tracking-wider text-slate-400 dark:text-dark-slate-500 uppercase truncate">
              {group.title}
            </div>
          )}
          <div className="space-y-0.5">
            {group.sections.map((section) => (
              <NavSectionItem
                key={section.id}
                section={section}
                isExpanded={expandedSectionId === section.id}
                activeNoteId={activeNoteId}
                onToggle={() => {
                  setExpandedSectionId((prev) => (prev === section.id ? null : section.id));
                }}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
