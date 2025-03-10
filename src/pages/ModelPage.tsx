import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button, Card } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { Upload, RefreshCw } from 'lucide-react';
import api from '../api';

const ModelContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const InputSection = styled(Card)`
  margin-bottom: 2rem;
`;

const OutputSection = styled(Card)`
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${props => (props.$isDragging ? 'var(--primary)' : '#e5e7eb')};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--primary);
  }
`;

const UploadIcon = styled.div`
  color: var(--primary);
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const ProcessingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ProcessingCard = styled(Card)`
  text-align: center;
`;

const SpinningIcon = styled(RefreshCw)`
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  color: var(--primary);

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ModelPage = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processInput(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processInput(e.target.files[0]);
    }
  };

  const processInput = async (file: File) => {
    console.log("processInput function called with file:", file); // ✅ Check if function runs

    setIsProcessing(true);
    setError(null);
    setPredictions([]); 

    try {
        console.log("Calling api.analyzeImage..."); // ✅ Ensure API is called
        const response = await api.analyzeImage(Number(modelId), file);
        
        console.log("API Response:", response);  // ✅ Log API response

        if (response && response.predictions) {
            console.log("Setting predictions state:", response.predictions);
            setPredictions([...response.predictions]); // ✅ Ensure React state updates
        } else {
            console.log("No findings detected.");
            setPredictions(["No abnormalities detected."]);
        }
    } catch (err) {
        console.error("API Error:", err);
        setError('Failed to analyze the image. Ensure the backend is running and accessible.');
    } finally {
        setIsProcessing(false);
    }
};

  return (
    <>
      <Navbar />
      <ModelContainer>
        <InputSection>
          <h2 style={{ marginBottom: '1rem' }}>Upload Medical Image</h2>
          <UploadArea
            $isDragging={isDragging} // ✅ Updated to use transient prop
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon>
              <Upload size={48} />
            </UploadIcon>

            <UploadText>Drag and drop your file here, or click to select</UploadText>
            <Button as="label" htmlFor="fileInput">
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef} // ✅ Using useRef instead of document.getElementById
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </UploadArea>
        </InputSection>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {predictions.length > 0 && (
          <OutputSection>
            <h2 style={{ marginBottom: '1rem' }}>Analysis Complete</h2>
            <p><strong>Findings:</strong></p>
            <ul>
              {predictions.map((prediction, index) => (
                <li key={index}>{prediction}</li>
              ))}
            </ul>
          </OutputSection>
        )}

        {isProcessing && (
          <ProcessingOverlay>
            <ProcessingCard>
              <SpinningIcon size={48} />
              <h3>Processing...</h3>
              <p>Please wait while we analyze your input</p>
            </ProcessingCard>
          </ProcessingOverlay>
        )}
      </ModelContainer>
    </>
  );
};
