import { fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import Layout from './Layout';

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="current location">{location.pathname}{location.hash}</output>;
}

describe('Layout search flow', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/#/');
  });

  it('loads the search index, displays results, and navigates to a heading', async () => {
    const { findByRole, getByLabelText } = render(
      <StrictMode>
        <HashRouter>
          <Layout>
            <LocationProbe />
          </Layout>
        </HashRouter>
      </StrictMode>,
    );

    fireEvent.click(getByLabelText('Open search dialog'));
    fireEvent.change(getByLabelText('Search query'), { target: { value: 'SELECT' } });

    const result = await findByRole('button', { name: /조회 및 정렬.*SELECT/i });
    fireEvent.click(result);

    await waitFor(() => {
      expect(getByLabelText('current location').textContent).toMatch(/^\/sql\/sql-part1#.+/);
      expect(window.location.hash).toMatch(/^#\/sql\/sql-part1#.+/);
    });
  });
});
