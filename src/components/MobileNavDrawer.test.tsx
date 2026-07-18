import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MobileNavDrawer from './MobileNavDrawer';

describe('MobileNavDrawer', () => {
  afterEach(() => {
    cleanup();
  });

  it('focuses its close button, closes with Escape, and restores focus', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const onClose = vi.fn();
    const { getByRole, rerender } = render(
      <MemoryRouter>
        <MobileNavDrawer isOpen onClose={onClose} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(getByRole('button', { name: '모바일 내비게이션 닫기' })).toHaveFocus());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <MemoryRouter>
        <MobileNavDrawer isOpen={false} onClose={onClose} />
      </MemoryRouter>,
    );
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
