import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function mockSystemTheme(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    matches,
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
  return mediaQuery;
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
  });

  it('applies a stored dark preference on first render', async () => {
    mockSystemTheme(false);
    window.localStorage.setItem('theme', 'dark');

    const { useDarkMode } = await import('./useDarkMode');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('uses the system preference until the user toggles explicitly', async () => {
    mockSystemTheme(true);

    const { useDarkMode } = await import('./useDarkMode');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);

    act(() => result.current.toggle());

    expect(result.current.isDark).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });
});
