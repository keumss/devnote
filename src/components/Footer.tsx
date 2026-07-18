export default function Footer() {
  return (
    <footer className="mt-16 flex items-center justify-center gap-1 px-4 pb-8 pt-8 text-sm text-slate-400 dark:text-dark-slate-500">
      <p>© DevNote · 개발 학습 노트</p>
      <span aria-hidden="true">·</span>
      <a
        href="https://github.com/keumss/devnote"
        target="_blank"
        rel="noreferrer"
        className="rounded outline-none transition-colors hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-dark-slate-300"
      >
        GitHub 프로젝트
      </a>
    </footer>
  );
}
