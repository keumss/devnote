import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TopicNav from './TopicNav';

const topics = [
  { id: 'setup', title: '설치와 설정 준비하기' },
  { id: 'query', title: '조회 쿼리 실행하기' },
];

describe('TopicNav', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows every topic and reports the selected topic', () => {
    const onSelectTopic = vi.fn();

    render(<TopicNav topics={topics} onSelectTopic={onSelectTopic} activeTopicId="query" />);

    const navigation = screen.getByRole('navigation', { name: '이 노트의 목차' });
    expect(screen.getByRole('button', { name: '2번 토픽: 조회 쿼리 실행하기' })).toHaveAttribute(
      'aria-current',
      'location',
    );

    fireEvent.click(screen.getByRole('button', { name: '2번 토픽: 조회 쿼리 실행하기' }));

    expect(onSelectTopic).toHaveBeenCalledWith('query');
    expect(navigation).toHaveTextContent('설치와 설정 준비하기');
  });
});
