import { render } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('shows the home-link focus ring only for keyboard navigation', () => {
    const { getByLabelText } = render(
      <HashRouter>
        <Header
          isDark={false}
          toggleDark={vi.fn()}
          onOpenSearch={vi.fn()}
        />
      </HashRouter>,
    );

    const homeLink = getByLabelText('DevNote 홈으로 이동');
    expect(homeLink).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-indigo-500/50');
    expect(homeLink).not.toHaveClass('focus:ring-2', 'focus:ring-indigo-500/50');

    const homeIcon = homeLink.firstElementChild;
    expect(homeIcon).toHaveClass('group-active:-translate-y-0.5', 'group-active:scale-105');
    expect(homeIcon).not.toHaveClass('group-hover:-translate-y-0.5', 'group-hover:scale-105');
  });
});
