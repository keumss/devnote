import { useEffect, useRef } from 'react';
import { BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SidebarNav from './SidebarNav';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId?: string;
  activeNoteId?: string;
}

export default function MobileNavDrawer({ isOpen, onClose, activeSectionId, activeNoteId }: MobileNavDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

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
