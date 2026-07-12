import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const IndexPage = React.lazy(() => import('./components/IndexPage'));
const CourseViewer = React.lazy(() => import('./components/CourseViewer'));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/:sectionId/:noteId" element={<CourseViewer />} />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
