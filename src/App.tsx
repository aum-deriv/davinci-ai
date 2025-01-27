import { useState } from 'react';
import styled from '@emotion/styled';
import { InputSection } from './components/InputSection';
import { CodeDisplay } from './components/CodeDisplay';
import { Preview } from './components/Preview';
import { FullScreenLoader } from './components/FullScreenLoader';
import { LangflowClient } from './services/LangflowClient';

const AppContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Title = styled.h1`
  text-align: center;
  color: #343a40;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 20% 80%;
  gap: 20px;
  flex: 1;
  min-height: 0;
`;

const LeftSection = styled.div`
  grid-column: 1;
  overflow-y: auto;
`;

const RightSection = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  flex-shrink: 0;
`;

interface LangflowResponse {
  outputs: Array<{
    outputs: Array<{
      outputs: {
        message: {
          message: {
            text: string;
          };
        };
        artifacts?: {
          stream_url?: string;
        };
      };
    }>;
  }>;
}

interface ApiResponse {
  html: string;
  css: string;
  description?: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [html, setHtml] = useState<string>();
  const [styles, setStyles] = useState<string>();
  const [error, setError] = useState<string>();

  const langflowClient = new LangflowClient(
    '',  // Empty baseURL to use the proxy
    import.meta.env.VITE_ASTRA_DB_TOKEN
  );

  const parseCssFromResponse = (cssString: string): string => {
    return cssString.replace(/^(?:css`|`|'|")|(?:`|'|")$/g, '').trim();
  };

  const truncateInput = (input: string): string => {
    const maxLength = 400 * 4;
    if (input.length > maxLength) {
      return input.substring(0, maxLength) + "...";
    }
    return input;
  };

  const handleSubmit = async (input: string, image?: File) => {
    setIsLoading(true);
    setHtml(undefined);
    setStyles(undefined);
    setError(undefined);

    try {
      const truncatedInput = truncateInput(input);
      const flowIdOrName = import.meta.env.VITE_FLOW_ID;
      const langflowId = import.meta.env.VITE_LANGFLOW_ID;
      const tweaks = {
        "ChatInput-ivyVt": {},
        "Prompt-lpeoJ": {},
        "ChatOutput-eV0ob": {},
        "OpenAIModel-SzTnW": {}
      };

      const response = image 
        ? await langflowClient.runFlowWithImage(
            flowIdOrName,
            langflowId,
            truncatedInput,
            image,
            'chat',
            'chat',
            tweaks,
            false,
            (data: { chunk?: string }) => {
              if (data.chunk) {
                console.log("Received:", data.chunk);
              }
            },
            (message: string) => console.log("Stream Closed:", message),
            (error: unknown) => {
              console.log("Stream Error:", error);
              setError(error instanceof Error ? error.message : String(error));
            }
          )
        : await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            truncatedInput,
            'chat',
            'chat',
            tweaks,
            false,
            (data: { chunk?: string }) => {
              if (data.chunk) {
                console.log("Received:", data.chunk);
              }
            },
            (message: string) => console.log("Stream Closed:", message),
            (error: unknown) => {
              console.log("Stream Error:", error);
              setError(error instanceof Error ? error.message : String(error));
            }
          );

      const typedResponse = response as unknown as LangflowResponse;
      if (typedResponse?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
        const text = typedResponse.outputs[0].outputs[0].outputs.message.message.text;
        
        try {
          // Try to parse the response as JSON
          const jsonResponse: ApiResponse = JSON.parse(text);
          setHtml(jsonResponse.html.trim());
          setStyles(parseCssFromResponse(jsonResponse.css));
        } catch {
          // If JSON parsing fails, try to extract code blocks
          const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/);
          const cssMatch = text.match(/```css\n([\s\S]*?)\n```/);
          
          if (htmlMatch && cssMatch) {
            setHtml(htmlMatch[1].trim());
            setStyles(parseCssFromResponse(cssMatch[1]));
          } else {
            // Try to extract from a single HTML block that might contain style tags
            const codeBlockMatch = text.match(/```html\n([\s\S]*?)\n```/);
            if (codeBlockMatch && codeBlockMatch[1]) {
              const fullCode = codeBlockMatch[1];
              
              // Extract CSS from style tags
              const styleMatch = fullCode.match(/<style>\s*([\s\S]*?)\s*<\/style>/);
              const cssContent = styleMatch ? styleMatch[1].trim() : '';
              
              // Get HTML by removing style tags
              const htmlContent = fullCode
                .replace(/<style>[\s\S]*?<\/style>/, '')
                .trim();
              
              setHtml(htmlContent);
              setStyles(parseCssFromResponse(cssContent));
            } else {
              setError('Invalid response format: Could not find code blocks');
            }
          }
        }
      } else {
        setError('Invalid response format: Missing message text');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <AppContainer>
        <Title>Code Generator</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <MainContent>
          <LeftSection>
            <InputSection 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
            />
          </LeftSection>
          <RightSection>
            <CodeDisplay html={html} styles={styles} />
            <Preview html={html} styles={styles} />
          </RightSection>
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;
