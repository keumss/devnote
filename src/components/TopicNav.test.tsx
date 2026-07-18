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
    const activeTopic = screen.getByRole('button', { name: '2번 토픽: 조회 쿼리 실행하기' });
    const inactiveTopic = screen.getByRole('button', { name: '1번 토픽: 설치와 설정 준비하기' });

    expect(activeTopic).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(activeTopic).toHaveClass('transition-[color]', 'dark:bg-dark-indigo-500/10');
    expect(inactiveTopic).toHaveClass('transition-[color]', 'dark:hover:bg-dark-slate-800/70');
    expect(activeTopic).not.toHaveClass('transition-colors');
    expect(inactiveTopic).not.toHaveClass('transition-colors');

    fireEvent.click(activeTopic);

    expect(onSelectTopic).toHaveBeenCalledWith('query');
    expect(navigation).toHaveTextContent('설치와 설정 준비하기');
  });
});
