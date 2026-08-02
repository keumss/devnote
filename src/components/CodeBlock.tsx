import { memo, useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { HighlightedCodeProps } from './HighlightedCode';
import {
  loadHighlightedCode,
  type HighlightedCodeComponent,
} from './highlightedCodeLoader';

function PlainCode({ code }: Pick<HighlightedCodeProps, 'code'>) {
  return (
    <pre className="m-0 p-4 text-xs leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function DeferredHighlightedCode(props: HighlightedCodeProps) {
  const [HighlightedCode, setHighlightedCode] = useState<HighlightedCodeComponent | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void loadHighlightedCode()
      .then(Component => {
        if (isCurrent) setHighlightedCode(() => Component);
      })
      .catch(() => {
        // Plain code remains readable when the optional highlighter chunk fails.
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  return HighlightedCode ? <HighlightedCode {...props} /> : <PlainCode code={props.code} />;
}

interface CodeBlockProps {
  code: string;
  language?: 'sql' | 'python' | string;
}

export default memo(function CodeBlock({ code, language = 'sql' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-dark-slate-800 bg-[#f8fafc] dark:bg-surface-code mt-4 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-surface-code-header border-b border-slate-200 dark:border-dark-slate-800">
        <span className="text-xs font-semibold text-slate-500 dark:text-dark-slate-400 uppercase tracking-wider">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-dark-slate-400 hover:text-slate-900 dark:hover:text-dark-slate-200 hover:bg-slate-200 dark:hover:bg-dark-slate-700 transition-[color] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          aria-label="Copy code"
        >
          {copied ? (
            <><Check size={14} className="text-emerald-500" /> <span className="text-emerald-500">Copied!</span></>
          ) : (
            <><Copy size={14} /> <span>Copy</span></>
          )}
        </button>
      </div>
      <div className="custom-scrollbar relative leading-relaxed overflow-x-auto syntax-highlighter-container">
        <DeferredHighlightedCode code={code} language={language} />
      </div>
    </div>
  );
});
