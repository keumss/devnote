import { useState, memo } from 'react';
import { Check, Copy } from 'lucide-react';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: 'sql' | 'python' | string;
}

export default memo(function CodeBlock({ code, language = 'sql' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0d1117] mt-4 font-mono text-sm transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
        <div className="dark:hidden">
          <SyntaxHighlighter
            language={language}
            style={oneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              textShadow: 'none',
              fontFamily: 'inherit',
              fontSize: '12px',
              lineHeight: '1.625'
            }}
            codeTagProps={{
              style: {
                fontFamily: 'inherit',
                fontSize: '12px',
                background: 'transparent',
                textShadow: 'none',
                lineHeight: '1.625'
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="hidden dark:block">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              textShadow: 'none',
              fontFamily: 'inherit',
              fontSize: '12px',
              lineHeight: '1.625'
            }}
            codeTagProps={{
              style: {
                fontFamily: 'inherit',
                fontSize: '12px',
                background: 'transparent',
                textShadow: 'none',
                lineHeight: '1.625'
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
});
