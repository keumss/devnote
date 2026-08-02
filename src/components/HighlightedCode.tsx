import type { CSSProperties } from 'react';
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
  lineHeight: '1.625',
};

const highlighterStyle: CSSProperties = {
  ...sharedCodeStyle,
  margin: 0,
  padding: '1rem',
};

const codeTagProps = {
  style: sharedCodeStyle,
};

export interface HighlightedCodeProps {
  code: string;
  language: string;
}

export default function HighlightedCode({ code, language }: HighlightedCodeProps) {
  const { isDark } = useDarkMode();

  return (
    <SyntaxHighlighter
      language={language}
      style={isDark ? oneDark : oneLight}
      customStyle={highlighterStyle}
      codeTagProps={codeTagProps}
    >
      {code}
    </SyntaxHighlighter>
  );
}
