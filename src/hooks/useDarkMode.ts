import { useState, useEffect, useCallback } from 'react';

// Global state for theme
let globalIsDark = false;
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme');
  if (stored) {
    globalIsDark = stored === 'dark';
  } else {
    globalIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

const listeners = new Set<(isDark: boolean) => void>();

function setGlobalIsDark(next: boolean) {
  if (globalIsDark === next) return;

  globalIsDark = next;
  const root = document.documentElement;
  if (globalIsDark) {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  listeners.forEach(listener => listener(globalIsDark));
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(globalIsDark);

  useEffect(() => {
    // Initial sync in case it changed before effect runs
    setIsDark(globalIsDark);
    
    const listener = (newIsDark: boolean) => {
      setIsDark(newIsDark);
    };
    
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(() => {
    setGlobalIsDark(!globalIsDark);
  }, []);

  return { isDark, toggle };
}
