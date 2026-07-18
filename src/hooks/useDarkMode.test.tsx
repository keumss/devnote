import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function mockSystemTheme(matches: boolean) {
  let systemMatches = matches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    get matches() {
      return systemMatches;
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  } satisfies MediaQueryList;

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery));
  return {
    change(nextMatches: boolean) {
      systemMatches = nextMatches;
      const event = { matches: nextMatches } as MediaQueryListEvent;
      listeners.forEach(listener => listener(event));
    },
  };
}

describe('useDarkMode', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('applies a stored dark preference on first render', async () => {
    mockSystemTheme(false);
    window.localStorage.setItem('theme', 'dark');

    const { useDarkMode } = await import('./useDarkMode');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).not.toHaveClass('theme-transition');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('uses the system preference until the user toggles explicitly', async () => {
    vi.useFakeTimers();
    mockSystemTheme(true);

    const { useDarkMode } = await import('./useDarkMode');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);

    act(() => result.current.toggle());

    expect(result.current.isDark).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(document.documentElement).toHaveClass('theme-transition');

    act(() => vi.advanceTimersByTime(200));

    expect(document.documentElement).not.toHaveClass('theme-transition');
  });

  it('transitions a system theme change after the initial render', async () => {
    vi.useFakeTimers();
    const systemTheme = mockSystemTheme(false);

    const { useDarkMode } = await import('./useDarkMode');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).not.toHaveClass('theme-transition');

    act(() => systemTheme.change(true));

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark', 'theme-transition');

    act(() => vi.advanceTimersByTime(200));

    expect(document.documentElement).not.toHaveClass('theme-transition');
  });
});
