import { memo, useEffect, useState, type CSSProperties } from 'react';
import { Check, Copy } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDarkMode } from '../hooks/useDarkMode';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('dockerfile', docker);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);

const sharedCodeStyle: CSSProperties = {
  background: 'transparent',
  textShadow: 'none',
  fontFamily: 'inherit',
  fontSize: '12px',
  lineHeight: '1.625'
};

const highlighterStyle: CSSProperties = {
  ...sharedCodeStyle,
  margin: 0,
  padding: '1rem'
};

const codeTagProps = {
  style: sharedCodeStyle
};

interface CodeBlockProps {
  code: string;
  language?: 'sql' | 'python' | string;
}

export default memo(function CodeBlock({ code, language = 'sql' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { isDark } = useDarkMode();

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
    <div className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0d1117] mt-4 font-mono text-sm transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language}</span>
        <button
          type="button"
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
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={highlighterStyle}
          codeTagProps={codeTagProps}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});
