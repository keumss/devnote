import { fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('note search navigation', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/#/');
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('opens the selected note and scrolls to its topic', async () => {
    const { findByLabelText, findByRole, getByLabelText } = render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>,
    );

    fireEvent.click(await findByLabelText('Open search dialog', {}, { timeout: 5000 }));
    fireEvent.change(getByLabelText('Search query'), { target: { value: '조회 및 정렬 SELECT' } });
    fireEvent.click(await findByRole('button', { name: /조회 및 정렬.*SELECT/i }));

    await waitFor(() => {
      expect(window.location.hash).toMatch(/^#\/sql\/sql-part1#.+/);
    });
    await findByRole('heading', { name: /조회 및 정렬.*SELECT/i }, { timeout: 5000 });
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  }, 10_000);
});
