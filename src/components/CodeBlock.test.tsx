import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CodeBlock from './CodeBlock';

describe('CodeBlock', () => {
  afterEach(() => {
    cleanup();
  });

  it('changes the copy-button background without a color transition', () => {
    render(<CodeBlock code="print('hello')" language="python" />);

    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    expect(copyButton).toHaveClass('transition-[color]', 'dark:hover:bg-dark-slate-700');
    expect(copyButton).not.toHaveClass('transition-all', 'transition-colors');
  });
});
