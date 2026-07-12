export function getCategoryPath(sectionId: string, categoryId: string) {
  return `/${encodeURIComponent(sectionId)}/${encodeURIComponent(categoryId)}`;
}

export function getItemHash(itemId: string) {
  return `#${encodeURIComponent(itemId)}`;
}

export function getHashTarget(hash: string) {
  if (!hash) return null;

  const encodedTarget = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!encodedTarget) return null;

  try {
    return decodeURIComponent(encodedTarget);
  } catch {
    return encodedTarget;
  }
}

interface NavigableCategory {
  id: string;
}

interface NavigableSection {
  id: string;
  categories: readonly NavigableCategory[];
}

export function resolveCategory<TSection extends NavigableSection>(
  sections: readonly TSection[],
  sectionId: string | undefined,
  categoryId: string | undefined,
): {
  section: TSection;
  category: TSection['categories'][number];
  isExact: boolean;
} | null {
  const requestedSection = sections.find(section => section.id === sectionId);
  const section = requestedSection ?? sections[0];
  const requestedCategory = requestedSection?.categories.find(category => category.id === categoryId) as
    | TSection['categories'][number]
    | undefined;
  const fallbackCategory = section?.categories[0] as TSection['categories'][number] | undefined;
  const category = requestedCategory ?? fallbackCategory;

  if (!section || !category) return null;

  return {
    section,
    category,
    isExact: Boolean(requestedSection && requestedCategory),
  };
}
