import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'theme';
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const THEME_TRANSITION_DURATION_MS = 200;

type ThemePreference = 'dark' | 'light' | null;

const listeners = new Set<() => void>();
let mediaQuery: MediaQueryList | null = null;
let isListeningToSystemTheme = false;
let isListeningToStorage = false;
let themeTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

function normalizePreference(value: string | null): ThemePreference {
  return value === 'dark' || value === 'light' ? value : null;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return null;

  try {
    return normalizePreference(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function getMediaQuery(): MediaQueryList | null {
  if (mediaQuery) return mediaQuery;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  try {
    mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    return mediaQuery;
  } catch {
    return null;
  }
}

function prefersDarkMode() {
  return getMediaQuery()?.matches ?? false;
}

function resolveIsDark(preference: ThemePreference) {
  return preference === null ? prefersDarkMode() : preference === 'dark';
}

function startThemeTransition() {
  if (typeof document === 'undefined') return;

  if (themeTransitionTimeout !== null) {
    clearTimeout(themeTransitionTimeout);
  }

  document.documentElement.classList.add('theme-transition');
  themeTransitionTimeout = setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
    themeTransitionTimeout = null;
  }, THEME_TRANSITION_DURATION_MS);
}

function applyTheme(isDark: boolean, withTransition = false) {
  if (typeof document === 'undefined') return;

  if (withTransition) {
    startThemeTransition();
  }
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

let themePreference = readStoredPreference();
let globalIsDark = resolveIsDark(themePreference);

// Keep direct imports and non-HTML test environments in sync as well. In the
// browser, the inline script in index.html has already done this before paint.
applyTheme(globalIsDark);

function setGlobalIsDark(next: boolean, withTransition = false) {
  if (globalIsDark === next) {
    applyTheme(next);
    return;
  }

  applyTheme(next, withTransition);
  globalIsDark = next;
  listeners.forEach(listener => listener());
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  if (themePreference === null) {
    setGlobalIsDark(event.matches, true);
  }
}

function startSystemThemeListener() {
  if (isListeningToSystemTheme || themePreference !== null) return;

  const query = getMediaQuery();
  if (!query) return;

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handleSystemThemeChange);
  } else {
    query.addListener(handleSystemThemeChange);
  }
  isListeningToSystemTheme = true;
}

function stopSystemThemeListener() {
  if (!isListeningToSystemTheme || !mediaQuery) return;

  if (typeof mediaQuery.removeEventListener === 'function') {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  } else {
    mediaQuery.removeListener(handleSystemThemeChange);
  }
  isListeningToSystemTheme = false;
}

function syncSystemThemeListener() {
  if (themePreference === null && listeners.size > 0) {
    startSystemThemeListener();
  } else {
    stopSystemThemeListener();
  }
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;

  themePreference = event.key === STORAGE_KEY
    ? normalizePreference(event.newValue)
    : readStoredPreference();
  syncSystemThemeListener();
  setGlobalIsDark(resolveIsDark(themePreference), true);
}

function startStorageListener() {
  if (isListeningToStorage || typeof window === 'undefined') return;

  window.addEventListener('storage', handleStorageChange);
  isListeningToStorage = true;
}

function stopStorageListener() {
  if (!isListeningToStorage || typeof window === 'undefined') return;

  window.removeEventListener('storage', handleStorageChange);
  isListeningToStorage = false;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startStorageListener();
  syncSystemThemeListener();

  // The system preference may have changed between module evaluation and the
  // first subscriber being registered.
  if (themePreference === null) {
    setGlobalIsDark(prefersDarkMode());
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopSystemThemeListener();
      stopStorageListener();
    }
  };
}

function getSnapshot() {
  return globalIsDark;
}

function getServerSnapshot() {
  return false;
}

function toggleDarkMode() {
  const nextPreference: Exclude<ThemePreference, null> = globalIsDark ? 'light' : 'dark';
  themePreference = nextPreference;

  try {
    window.localStorage.setItem(STORAGE_KEY, nextPreference);
  } catch {
    // The in-memory preference still makes the toggle work for this session.
  }

  syncSystemThemeListener();
  setGlobalIsDark(nextPreference === 'dark', true);
}

export function useDarkMode() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { isDark, toggle: toggleDarkMode };
}
