import { Children, isValidElement } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import CodeBlock from './CodeBlock';

function Heading({ children, className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      {...props}
      className={`topic-heading scroll-mt-24 text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-dark-slate-300 ${className ?? ''}`}
    >
      {children}
    </h2>
  );
}

function Pre({ children }: ComponentProps<'pre'>) {
  const child = Children.only(children);
  if (!isValidElement<ComponentProps<'code'>>(child)) {
    return <pre>{children}</pre>;
  }

  const language = child.props.className?.replace('language-', '') ?? 'text';
  const code = String(child.props.children).replace(/\n$/, '');
  return <CodeBlock code={code} language={language} />;
}

function InlineCode({ children, className, ...props }: ComponentProps<'code'>) {
  if (className?.startsWith('language-')) return <code>{children}</code>;
  return (
    <code
      {...props}
      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-indigo-700 dark:bg-dark-slate-800 dark:text-dark-indigo-300"
    >
      {children}
    </code>
  );
}

function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-5 text-sm sm:text-base text-slate-600 dark:text-dark-slate-400 leading-relaxed">
      {children}
    </p>
  );
}

export function NoteLink({ children, ...props }: ComponentProps<'a'>) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-indigo-600 underline underline-offset-4 hover:text-indigo-700 dark:text-dark-indigo-400 dark:hover:text-dark-indigo-300"
    >
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  h2: Heading,
  h3: ({ children, ...props }) => (
    <h3 {...props} className="mt-8 mb-3 text-lg font-bold text-slate-900 dark:text-dark-slate-300">
      {children}
    </h3>
  ),
  p: Paragraph,
  pre: Pre,
  code: InlineCode,
  a: NoteLink,
  ul: ({ children, ...props }) => (
    <ul {...props} className="mb-5 ml-6 list-disc space-y-2 text-slate-600 dark:text-dark-slate-400">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="mb-5 ml-6 list-decimal space-y-2 text-slate-600 dark:text-dark-slate-400">
      {children}
    </ol>
  ),
};
