import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button, Card } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { Upload, CheckCircle } from 'lucide-react';

// For multi-page PDF
import html2pdf from 'html2pdf.js';

// Zoom & Pan
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import ApiService from '../services/api';

/* ----------------------
   STYLED COMPONENTS
---------------------- */
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

/** 
 * Only capture the child content for PDF.
 * We'll put the "Download PDF" button outside this ID 
 * so it won't appear in the PDF.
 */
const AnalysisResultWrapper = styled.div`
  font-family: 'Helvetica', 'Arial', sans-serif;
`;

/** 
 * A light border around the X-ray for clarity.
 * This ensures a visible boundary for zoom/pan area.
 */
const XRayContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  display: inline-block;
`;

const ReportTitle = styled.h2`
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ReportDate = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #555;
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

const Disclaimer = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;

  ul {
    margin-top: 0.5rem;
    margin-left: 1.2rem;
    list-style: disc;
  }
`;

/* ----------------------
   FULL DISEASE DESCRIPTIONS
---------------------- */
const DISEASE_DESCRIPTIONS = {
  Atelectasis: `Atelectasis is a collapse or closure of the lung resulting in reduced or absent gas exchange. 
  On a chest X-ray, you may see increased opacity, volume loss, and shift of the mediastinum toward the affected side.`,
  
  Cardiomegaly: `Cardiomegaly refers to an enlarged heart. On a chest X-ray, it is recognized by an increased cardiothoracic ratio (the heart is more than half the width of the thorax). 
  Possible causes include hypertension, valvular disease, or dilated cardiomyopathy.`,
  
  Consolidation: `Consolidation occurs when alveolar air is replaced by fluid, pus, blood, cells, or other substances. 
  On X-ray, it appears as an opaque area that can obscure normal lung markings. Pneumonia is a common cause of consolidation.`,
  
  Edema: `Pulmonary edema is fluid accumulation in the alveolar spaces and interstitium of the lungs, often due to congestive heart failure. 
  On X-ray, you might see Kerley B lines, perihilar 'batwing' opacities, or diffuse haziness in severe cases.`,
  
  Effusion: `A pleural effusion is fluid in the pleural space. On an X-ray, it can manifest as blunting of the costophrenic angle, a meniscus sign, or layering on a lateral decubitus view.`,
  
  Emphysema: `Emphysema involves destruction of alveolar walls, leading to enlarged air spaces and reduced surface area for gas exchange. 
  On X-ray, look for hyperinflation, flattened diaphragms, and decreased vascular markings.`,
  
  Fibrosis: `Pulmonary fibrosis is a chronic, progressive lung disease characterized by scarring (fibrosis) of the lung parenchyma. 
  On X-ray, you may see reticular patterns, honeycombing, and reduced lung volumes, especially in the lower lobes.`,
  
  Hernia: `A hiatal or diaphragmatic hernia may appear on a chest X-ray as loops of bowel or stomach in the thoracic cavity. 
  You might see an air-fluid level behind the heart if it's a hiatal hernia.`,
  
  Infiltration: `Infiltration is a general term for an abnormal substance (fluid, cells, etc.) within the lung parenchyma. 
  Radiologically, it can appear as patchy or diffuse opacities, often associated with infection or inflammation.`,
  
  Mass: `A lung mass is generally defined as a lesion larger than 3 cm in diameter. On X-ray, it appears as a distinct opacity, which can be solitary or multiple. Further imaging or biopsy is often required to rule out malignancy.`,
  
  Nodule: `A pulmonary nodule is a round or oval opacity less than 3 cm. It may be benign or malignant, and further evaluation (CT, PET, or biopsy) is often needed to determine etiology.`,
  
  Pleural_Thickening: `Pleural thickening involves fibrotic changes to the pleura. 
  On X-ray, it can appear as thickened pleural surfaces, sometimes calcified (as in asbestos-related disease). It may restrict lung expansion.`,
  
  Pneumonia: `Pneumonia is an infection of the lung parenchyma. 
  On X-ray, it typically appears as localized or patchy consolidation, often with air bronchograms. Common causes include bacteria, viruses, or fungi.`,
  
  Pneumothorax: `Pneumothorax is air in the pleural space, causing partial or complete lung collapse. 
  On X-ray, look for a visible visceral pleural line and absence of lung markings peripheral to that line. A tension pneumothorax is a medical emergency.`,
  
  'No Finding': `No obvious abnormality was detected in the chest X-ray. This does not exclude very subtle or early pathology; 
  clinical correlation and further imaging might still be necessary.`
};

/* ----------------------
   PROFESSIONAL HEATMAP
---------------------- */
const ProfessionalHeatmap = ({ probabilities }) => {
  const sortedEntries = Object.entries(probabilities).sort(([, a], [, b]) => b - a);

  const values = Object.values(probabilities);
  const minProb = Math.min(...values);
  const maxProb = Math.max(...values);

  const scaleValue = (p) => {
    if (maxProb === minProb) return 0.5;
    return (p - minProb) / (maxProb - minProb);
  };

  const getColor = (p) => {
    const s = scaleValue(p);
    const hue = (1 - s) * 120;
    return `hsl(${hue}, 85%, 50%)`;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Heatmap Visualization</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
        <div
          style={{
            width: '180px',
            height: '10px',
            background: `
              linear-gradient(
                to right,
                hsl(120, 85%, 50%) 0%,
                hsl(60, 85%, 50%) 50%,
                hsl(0, 85%, 50%) 100%
              )
            `
          }}
        />
        <div style={{ fontSize: '0.9rem', color: '#444' }}>
          <span style={{ marginRight: '0.5rem' }}>Low</span>
          <span style={{ marginRight: '0.5rem' }}>→</span>
          <span>High</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px'
        }}
      >
        {sortedEntries.map(([label, prob]) => {
          const color = getColor(prob);
          return (
            <div
              key={label}
              title={`${label}: ${(prob * 100).toFixed(2)}%`}
              style={{
                backgroundColor: color,
                color: '#fff',
                padding: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                textAlign: 'center',
                fontWeight: 'bold',
                transition: 'background-color 0.5s ease'
              }}
            >
              <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                {label}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {(prob * 100).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ----------------------
   MAIN COMPONENT
---------------------- */
export const ModelPage = () => {
  const { modelId } = useParams();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Confidence threshold
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);

  // PDF generation using html2pdf.js
  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('analysisResult');
      if (!element) return;

      const options = {
        margin: 10,
        filename: 'analysis_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

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
      const response = await ApiService.analyzeImage(modelId, selectedFile);
      if (response && response.predictions) {
        setResult({
          diagnosis: response.predictions[0].join(', '),
          classProbabilities: response.predictions[1] || {}
        });
      }
    } catch (err) {
      console.error('Error in API request:', err);
      setError(err.response?.data?.message || 'An error occurred during analysis');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter probabilities by threshold
  let filteredEntries = [];
  if (result) {
    filteredEntries = Object.entries(result.classProbabilities).filter(
      ([, prob]) => prob * 100 >= confidenceThreshold
    );
  }
  const filteredProbabilities = Object.fromEntries(filteredEntries);

  return (
    <>
      <Navbar />
      <ModelContainer>
        <AnalysisCard>
          {/* Upload / Clear / Analyze Section */}
          {!selectedFile ? (
            <UploadArea
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={48} color="var(--primary)" />
              <h3>Upload Medical Image</h3>
              <p>Drag and drop your image here, or click to select</p>
              <HiddenFileInput
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
              />
            </UploadArea>
          ) : (
            <>
              {/* Instructions about zoom/pan */}
              <h4 style={{ marginTop: '1rem' }}>Zoom & Pan Instructions</h4>
              <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '0.75rem' }}>
                You can scroll or pinch to zoom into specific areas of the chest X-ray, 
                and click-drag to pan around. This allows for a closer inspection of any region.
              </p>

              {/* Bordered container for X-ray */}
              <XRayContainer>
                <TransformWrapper minScale={0.5} maxScale={4} limitToWrapperBounds>
                  <TransformComponent>
                    <img
                      src={previewUrl}
                      alt="Selected"
                      style={{ maxWidth: '100%' }}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </XRayContainer>

              <Button onClick={processImage} disabled={isProcessing}>
                Analyze Image
              </Button>
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setResult(null);
                }}
                style={{ marginLeft: '1rem', background: 'var(--text-light)' }}
              >
                Clear
              </Button>
            </>
          )}

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

          {/* Results Section */}
          {result && (
            <ResultContainer>
              {/* 
                We capture only this wrapper in the PDF (id="analysisResult").
                The "Download PDF" button is below, so it's excluded.
              */}
              <AnalysisResultWrapper id="analysisResult">
                <ReportTitle>Chest X-Ray Analysis Report</ReportTitle>
                <ReportDate>{new Date().toLocaleString()}</ReportDate>

                <ResultHeader>
                  <CheckCircle size={24} /> Analysis Complete
                </ResultHeader>

                {/* Confidence Threshold Slider */}
                <div style={{ marginTop: '1rem' }}>
                  <label htmlFor="confidenceSlider" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Confidence Threshold: {confidenceThreshold}%
                  </label>
                  <input
                    id="confidenceSlider"
                    type="range"
                    min="0"
                    max="100"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <p style={{ marginTop: '1rem' }}>
                  <strong>Findings:</strong> {result.diagnosis}
                </p>
                {result.diagnosis && (
                  <div style={{ marginTop: '1rem' }}>
                    {result.diagnosis.split(',').map((rawFinding) => {
                      const finding = rawFinding.trim();
                      const description = DISEASE_DESCRIPTIONS[finding] || 'Description not available.';
                      return (
                        <div key={finding} style={{ marginBottom: '1rem' }}>
                          <strong>{finding}:</strong>
                          <p style={{ marginTop: '0.25rem' }}>
                            {description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p><strong>Class Probabilities (≥ {confidenceThreshold}%):</strong></p>
                <Table>
                  {filteredEntries.map(([label, prob]) => (
                    <TableRow key={label}>
                      <span>{label}:</span>
                      <span>{(prob * 100).toFixed(2)}%</span>
                    </TableRow>
                  ))}
                </Table>

                <ProfessionalHeatmap probabilities={filteredProbabilities} />
              </AnalysisResultWrapper>

              {/* Explanation + Centered PDF Button */}
              <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                You can download a PDF version of this analysis for your records. 
              </p>
              <Button
                onClick={handleDownloadPDF}
                style={{
                  display: 'block',
                  margin: '0.5rem auto 0 auto',
                  backgroundColor: '#dc2626', // red
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                Download PDF
              </Button>
            </ResultContainer>
          )}
        </AnalysisCard>

        {/* Disclaimer */}
        <Disclaimer>
          <strong>Disclaimer:</strong> This tool is for educational purposes only and is not
          intended to replace professional medical diagnosis. This tool aims to assist such medical diagnosis, however, it should not be used in isolation.
          <br />
          <br />
          For more information, visit:
          <ul>
            <li>
              <a href="https://radiopaedia.org/" target="_blank" rel="noreferrer">
                Radiopaedia
              </a>
            </li>
            <li>
              <a href="https://www.cdc.gov/" target="_blank" rel="noreferrer">
                CDC
              </a>
            </li>
          </ul>
        </Disclaimer>
      </ModelContainer>
    </>
  );
};
