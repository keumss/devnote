import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDialogFocus } from './useDialogFocus';

function DialogProbe({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useDialogFocus({ isOpen, onClose, dialogRef, initialFocusRef });

  if (!isOpen) return null;
  return (
    <div ref={dialogRef} role="dialog" aria-label="테스트 다이얼로그">
      <button ref={initialFocusRef} type="button">첫 번째</button>
      <button type="button">마지막</button>
    </div>
  );
}

describe('useDialogFocus', () => {
  afterEach(() => {
    cleanup();
  });

  it('focuses the initial control, closes with Escape, and restores focus', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const onClose = vi.fn();
    const { getByRole, rerender } = render(<DialogProbe isOpen onClose={onClose} />);

    await waitFor(() => expect(getByRole('button', { name: '첫 번째' })).toHaveFocus());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(<DialogProbe isOpen={false} onClose={onClose} />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('keeps Tab navigation inside the dialog', async () => {
    const { getByRole } = render(<DialogProbe isOpen onClose={vi.fn()} />);
    const first = getByRole('button', { name: '첫 번째' });
    const last = getByRole('button', { name: '마지막' });

    await waitFor(() => expect(first).toHaveFocus());
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });
});
