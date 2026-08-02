import type { SearchResult } from './content';

export type SearchContent = (query: string) => SearchResult[];

let searchContentPromise: Promise<SearchContent> | null = null;

export function loadSearchContent() {
  if (searchContentPromise) return searchContentPromise;

  const nextPromise = import('./search')
    .then(module => module.searchContent)
    .catch(error => {
      if (searchContentPromise === nextPromise) searchContentPromise = null;
      throw error;
    });
  searchContentPromise = nextPromise;
  return nextPromise;
}
