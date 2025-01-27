import styled from '@emotion/styled';

const PreviewContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const PreviewHeader = styled.div`
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 500;
  color: #343a40;
  flex-shrink: 0;
`;

const IframeContainer = styled.div`
  height: 90vh;
  overflow-y: auto;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

interface PreviewProps {
  html?: string;
  styles?: string;
}

export function Preview({ html, styles }: PreviewProps) {
  if (!html || !styles) {
    return null;
  }

  // Remove any backticks that might be in the CSS
  const cleanStyles = styles.replace(/^(?:css`|`|'|")|(?:`|'|")$/g, '');

  const combinedCode = `
    <!DOCTYPE html>
    <html style="height:100%">
      <head>
        <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        ${cleanStyles}
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  return (
    <PreviewContainer>
      <PreviewHeader>Live Preview</PreviewHeader>
      <IframeContainer>
        <StyledIframe
          srcDoc={combinedCode}
          title="Preview"
        />
      </IframeContainer>
    </PreviewContainer>
  );
}
