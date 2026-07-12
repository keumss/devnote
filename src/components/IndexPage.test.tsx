import { cleanup, render, within } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navData } from '../content';
import { getNotePath } from '../navigation';
import IndexPage from './IndexPage';

describe('IndexPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/#/');
    window.scrollTo = vi.fn();
  });

  it('shows content totals and every section', () => {
    const { getByRole } = render(
      <HashRouter>
        <IndexPage />
      </HashRouter>,
    );

    const indexPage = within(getByRole('main'));
    const totalNotes = navData.reduce((count, section) => count + section.notes.length, 0);
    expect(indexPage.getByText('학습 섹션', { selector: 'dt' }).parentElement).toHaveTextContent(`${navData.length}개`);
    expect(indexPage.getByText('학습 노트', { selector: 'dt' }).parentElement).toHaveTextContent(`${totalNotes}개`);

    for (const section of navData) {
      const sectionHeading = indexPage.getByRole('heading', { name: section.title });
      const sectionCard = sectionHeading.closest('article');

      expect(sectionCard).not.toBeNull();
      expect(within(sectionCard!).getByText(`${section.notes.length}개`)).toBeInTheDocument();
    }
  });

  it('links every note to its existing route', () => {
    const { getByRole } = render(
      <HashRouter>
        <IndexPage />
      </HashRouter>,
    );

    const indexPage = within(getByRole('main'));
    for (const section of navData) {
      const sectionHeading = indexPage.getByRole('heading', { name: section.title });
      const sectionCard = sectionHeading.closest('article');

      expect(sectionCard).not.toBeNull();
      for (const note of section.notes) {
        expect(within(sectionCard!).getByRole('link', { name: note.displayTitle })).toHaveAttribute(
          'href',
          `#${getNotePath(section.id, note.id)}`,
        );
      }
    }
  });
});
