import { useRef } from 'react';
import { BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SidebarNav from './SidebarNav';
import { useDialogFocus } from '../hooks/useDialogFocus';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId?: string;
  activeNoteId?: string;
}

export default function MobileNavDrawer({ isOpen, onClose, activeSectionId, activeNoteId }: MobileNavDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useDialogFocus({
    isOpen,
    onClose,
    dialogRef: drawerRef,
    initialFocusRef: closeButtonRef,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
          <motion.aside
            ref={drawerRef}
            id="mobile-navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-dark-slate-950 shadow-2xl lg:hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
          >
            <div className="flex-1 overflow-y-auto pt-6 px-6 pb-12 custom-scrollbar">
              <div className="flex items-center justify-between gap-2 mb-6 px-1">
                <div className="flex items-center gap-2 text-slate-800 dark:text-dark-slate-200 font-semibold text-sm uppercase tracking-wider">
                  <BookOpen size={16} />
                  <span id="mobile-navigation-title">학습 노트</span>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-dark-slate-400 dark:hover:text-dark-slate-100 dark:hover:bg-dark-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  aria-label="모바일 내비게이션 닫기"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarNav 
                activeSectionId={activeSectionId} 
                activeNoteId={activeNoteId}
                onNavigate={onClose}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
