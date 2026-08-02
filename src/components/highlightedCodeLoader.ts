import type { ComponentType } from 'react';
import type { HighlightedCodeProps } from './HighlightedCode';

export type HighlightedCodeComponent = ComponentType<HighlightedCodeProps>;

let highlightedCodePromise: Promise<HighlightedCodeComponent> | null = null;

export function loadHighlightedCode() {
  highlightedCodePromise ??= import('./HighlightedCode')
    .then(module => module.default)
    .catch(error => {
      highlightedCodePromise = null;
      throw error;
    });
  return highlightedCodePromise;
}
