import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button, Card } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { Upload, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import ApiService from '../services/api';

const ModelContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  max-width: 800px;
`;

const AnalysisCard = styled(Card)`
  text-align: center;
  padding: 3rem;
`;

const UploadArea = styled.div`
  border: 2px dashed ${({ isDragging }) => (isDragging ? 'var(--primary)' : '#e5e7eb')};
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ isDragging }) => (isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent')};
  position: relative;
  &:hover {
    border-color: var(--primary);
    background: rgba(99, 102, 241, 0.05);
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const ResultContainer = styled.div`
  background: #f0fdf4;
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: left;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
`;

const ResultHeader = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: #16a34a;
  margin-bottom: 1rem;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
  margin-top: 1rem;
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  font-size: 1rem;
  &:last-child {
    border-bottom: none;
  }
`;

export const ModelPage = () => {
  const { modelId } = useParams();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      console.log('Sending image to API...');
      const response = await ApiService.analyzeImage(modelId, selectedFile);
      console.log('API Response:', response);

      if (response && response.predictions) {
        setResult({
          diagnosis: response.predictions[0].join(', '),
          classProbabilities: response.predictions[1] || {},
        });
      }
    } catch (err) {
      console.error('Error in API request:', err);
      setError(err.response?.data?.message || 'An error occurred during analysis');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <ModelContainer>
        <AnalysisCard>
          {!selectedFile ? (
            <UploadArea isDragging={isDragging} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <Upload size={48} color='var(--primary)' />
              <h3>Upload Medical Image</h3>
              <p>Drag and drop your image here, or click to select</p>
              <HiddenFileInput type='file' ref={fileInputRef} accept='image/*' onChange={handleFileSelect} />
            </UploadArea>
          ) : (
            <>
              <img src={previewUrl} alt='Selected' style={{ maxWidth: '100%', margin: '1rem 0' }} />
              <Button onClick={processImage} disabled={isProcessing}>Analyze Image</Button>
              <Button onClick={() => setSelectedFile(null)} style={{ marginLeft: '1rem', background: 'var(--text-light)' }}>Clear</Button>
            </>
          )}

          {result && (
            <ResultContainer>
              <ResultHeader><CheckCircle size={24} /> Analysis Complete</ResultHeader>
              <p><strong>Findings:</strong> {result.diagnosis}</p>
              <p><strong>Class Probabilities:</strong></p>
              <Table>
                {Object.entries(result.classProbabilities).map(([label, prob]) => (
                  <TableRow key={label}>
                    <span>{label}:</span>
                    <span>{(prob * 100).toFixed(2)}%</span>
                  </TableRow>
                ))}
              </Table>
            </ResultContainer>
          )}
        </AnalysisCard>
      </ModelContainer>
    </>
  );
};
