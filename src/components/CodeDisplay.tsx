import styled from '@emotion/styled';
import { useState } from 'react';

const Container = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CodeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CodeTitle = styled.h3`
  margin: 0;
  color: #343a40;
  font-size: 16px;
  font-weight: 500;
`;

const CodeBlock = styled.pre`
  background-color: #282c34;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto;
  margin: 0;
  color: #abb2bf;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
`;

const CopyButton = styled.button`
  padding: 5px 10px;
  background-color: #343a40;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

interface CodeDisplayProps {
  html?: string;
  styles?: string;
}

export function CodeDisplay({ html, styles }: CodeDisplayProps) {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const handleCopyHtml = async () => {
    await navigator.clipboard.writeText(html || '');
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyCss = async () => {
    await navigator.clipboard.writeText(styles || '');
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  if (!html && !styles) {
    return null;
  }

  return (
    <Container>
      {html && (
        <CodeSection>
          <CodeHeader>
            <CodeTitle>HTML</CodeTitle>
            <CopyButton onClick={handleCopyHtml}>
              {copiedHtml ? 'Copied!' : 'Copy HTML'}
            </CopyButton>
          </CodeHeader>
          <CodeBlock>{html}</CodeBlock>
        </CodeSection>
      )}
      {styles && (
        <CodeSection>
          <CodeHeader>
            <CodeTitle>CSS</CodeTitle>
            <CopyButton onClick={handleCopyCss}>
              {copiedCss ? 'Copied!' : 'Copy CSS'}
            </CopyButton>
          </CodeHeader>
          <CodeBlock>{styles}</CodeBlock>
        </CodeSection>
      )}
    </Container>
  );
}
