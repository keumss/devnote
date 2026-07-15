import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NoteLink } from './MdxContent';

describe('NoteLink', () => {
  it('opens note links in a new tab with a protected opener', () => {
    const { getByRole } = render(
      <NoteLink href="https://docs.example.com" target="_self" rel="nofollow">
        공식 문서
      </NoteLink>,
    );

    expect(getByRole('link', { name: '공식 문서' })).toHaveAttribute('target', '_blank');
    expect(getByRole('link', { name: '공식 문서' })).toHaveAttribute('rel', 'noreferrer');
  });
});
