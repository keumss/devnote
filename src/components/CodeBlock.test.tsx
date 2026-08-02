import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CodeBlock from './CodeBlock';

describe('CodeBlock', () => {
  afterEach(() => {
    cleanup();
  });

  it('changes the copy-button background without a color transition', () => {
    render(
      <CodeBlock code="print('hello')" language="python">
        <code className="language-python">print('hello')</code>
      </CodeBlock>,
    );

    expect(screen.getByText("print('hello')")).toBeInTheDocument();
    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    expect(copyButton).toHaveClass('transition-[color]', 'dark:hover:bg-dark-slate-700');
    expect(copyButton).not.toHaveClass('transition-all', 'transition-colors');
  });

  it('preserves build-time highlighted markup and pre attributes', () => {
    render(
      <CodeBlock
        code="SELECT 1"
        language="sql"
        preProps={{
          className: 'shiki shiki-themes one-light one-dark-pro',
          style: { '--shiki-light': '#383A42' } as CSSProperties,
        }}
      >
        <code className="language-sql">
          <span className="line" style={{ '--shiki-light': '#A626A4' } as CSSProperties}>
            SELECT 1
          </span>
        </code>
      </CodeBlock>,
    );

    const pre = screen.getByText('SELECT 1').closest('pre');
    expect(pre).toHaveClass('shiki', 'one-light', 'one-dark-pro');
    expect(pre).toHaveStyle({ '--shiki-light': '#383A42' });
  });

  it('copies the original code from build-time highlighted markup', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(
      <CodeBlock code={'SELECT 1\nFROM users'} language="sql">
        <code className="language-sql">
          <span className="line">SELECT 1</span>{'\n'}
          <span className="line">FROM users</span>
        </code>
      </CodeBlock>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('SELECT 1\nFROM users'));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
