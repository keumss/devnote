import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SidebarNav from './SidebarNav';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId?: string;
  activeCategoryId?: string;
}

export default function MobileNavDrawer({ isOpen, onClose, activeSectionId, activeCategoryId }: MobileNavDrawerProps) {
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
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex-1 overflow-y-auto pt-6 px-6 pb-12 custom-scrollbar">
              <div className="flex items-center gap-2 mb-6 px-1 text-slate-800 dark:text-slate-200 font-semibold text-sm uppercase tracking-wider">
                <BookOpen size={16} />
                <span>Curriculum</span>
              </div>
              <SidebarNav 
                activeSectionId={activeSectionId} 
                activeCategoryId={activeCategoryId} 
                onNavigate={onClose}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
