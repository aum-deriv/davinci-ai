import styled from '@emotion/styled';
import { LoadingSpinner } from './LoadingSpinner';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingText = styled.div`
  margin-top: 20px;
  color: #007bff;
  font-size: 1.1rem;
  font-weight: 500;
`;

export function FullScreenLoader() {
  return (
    <Overlay>
      <LoadingSpinner />
      <LoadingText>Generating code...</LoadingText>
    </Overlay>
  );
}
