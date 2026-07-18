import { cleanup, render, within } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navData } from '../content';
import { getNotePath } from '../navigation';
import { saveContinueLearningItem } from '../hooks/useContinueLearning';
import IndexPage from './IndexPage';

describe('IndexPage', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/#/');
    window.scrollTo = vi.fn();
    window.localStorage.clear();
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
        const accessibleTitle = note.navigationLabel
          ? `${note.navigationLabel} ${note.displayTitle}`
          : note.displayTitle;
        const noteLink = within(sectionCard!).getByRole('link', { name: accessibleTitle });
        expect(noteLink).toHaveAttribute(
          'href',
          `#${getNotePath(section.id, note.id)}`,
        );
        expect(noteLink).toHaveClass('transition-[color]', 'dark:hover:bg-dark-indigo-500/10');
        expect(noteLink).not.toHaveClass('transition-colors');
        if (note.navigationLabel) {
          expect(within(noteLink).getByText(note.navigationLabel)).toBeInTheDocument();
        }
      }
    }
  });

  it('shows a link to the GitHub project', () => {
    const { getByRole } = render(
      <HashRouter>
        <IndexPage />
      </HashRouter>,
    );

    expect(getByRole('link', { name: 'GitHub 프로젝트' })).toHaveAttribute(
      'href',
      'https://github.com/keumss/devnote',
    );
  });

  it('shows a link to continue from the last opened topic', () => {
    const section = navData[0];
    const note = section.notes[0];
    const topic = note.topics[0];
    saveContinueLearningItem({
      sectionId: section.id,
      noteId: note.id,
      topicId: topic.id,
    });

    const { getByRole } = render(
      <HashRouter>
        <IndexPage />
      </HashRouter>,
    );

    expect(getByRole('heading', { name: '이어서 학습하기' })).toBeInTheDocument();
    const continueLink = getByRole('link', { name: '이어서 읽기' });
    expect(continueLink).toHaveAttribute(
      'href',
      `#${getNotePath(section.id, note.id)}#${encodeURIComponent(topic.id)}`,
    );
    expect(continueLink).toHaveClass('transition-[color]', 'dark:hover:bg-dark-indigo-500/25');
    expect(continueLink).not.toHaveClass('transition-colors');
  });
});
