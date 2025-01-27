import { useState, FormEvent, ChangeEvent } from 'react';
import styled from '@emotion/styled';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  margin-top: 10px;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a6268;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

interface InputSectionProps {
  onSubmit: (input: string, image?: File) => void;
  isLoading: boolean;
}

export function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim(), image);
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
        disabled={isLoading}
      />
      <ImageUploadContainer>
        <FileInput
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
        />
        <UploadButton
          type="button"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={isLoading}
        >
          {image ? 'Change Image' : 'Upload Image'}
        </UploadButton>
        {image && (
          <>
            {previewUrl && <ImagePreview src={previewUrl} alt="Preview" />}
            <UploadButton type="button" onClick={handleRemoveImage} disabled={isLoading}>
              Remove Image
            </UploadButton>
          </>
        )}
      </ImageUploadContainer>
      <SubmitButton type="submit" disabled={isLoading || !input.trim()}>
        {isLoading ? 'Processing...' : 'Generate Code'}
      </SubmitButton>
    </Form>
  );
}
