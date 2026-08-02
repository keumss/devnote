import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CodeBlock from './CodeBlock';
import { loadHighlightedCode } from './highlightedCodeLoader';

vi.mock('./highlightedCodeLoader', () => ({
  loadHighlightedCode: vi.fn(),
}));

const mockedLoadHighlightedCode = vi.mocked(loadHighlightedCode);

describe('CodeBlock', () => {
  beforeEach(() => {
    mockedLoadHighlightedCode.mockReset();
    mockedLoadHighlightedCode.mockReturnValue(new Promise(() => {}));
  });

  afterEach(() => {
    cleanup();
  });

  it('changes the copy-button background without a color transition', () => {
    render(<CodeBlock code="print('hello')" language="python" />);

    expect(screen.getByText("print('hello')")).toBeInTheDocument();
    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    expect(copyButton).toHaveClass('transition-[color]', 'dark:hover:bg-dark-slate-700');
    expect(copyButton).not.toHaveClass('transition-all', 'transition-colors');
  });

  it('replaces the plain fallback after the highlighter loads', async () => {
    mockedLoadHighlightedCode.mockResolvedValue(({ code }) => (
      <pre data-testid="highlighted-code"><code>{code}</code></pre>
    ));
    render(<CodeBlock code="SELECT 1" language="sql" />);

    expect(screen.getByText('SELECT 1')).toBeInTheDocument();
    expect(await screen.findByTestId('highlighted-code')).toBeInTheDocument();
  });

  it('keeps code readable when the highlighter fails to load', async () => {
    mockedLoadHighlightedCode.mockRejectedValue(new Error('chunk failed'));
    render(<CodeBlock code="SELECT 1" language="sql" />);

    await waitFor(() => expect(mockedLoadHighlightedCode).toHaveBeenCalledOnce());
    expect(screen.getByText('SELECT 1')).toBeInTheDocument();
  });

  it('copies the original code while the plain fallback is visible', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<CodeBlock code="SELECT 1" language="sql" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('SELECT 1'));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
