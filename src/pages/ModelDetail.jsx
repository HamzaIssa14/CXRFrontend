import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { Settings as Lungs, Brain, Bone, Star, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ModelHeader = styled.div`
  padding: 3rem 0;
  background: linear-gradient(to right, #1e3a8a, #1e40af);
  color: white;
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
`;

const ModelIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ModelDetails = styled.div`
  flex: 1;
`;

const ModelTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ModelDescription = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  max-width: 700px;
`;

const ModelStats = styled.div`
  display: flex;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.div`
  padding: 3rem 0;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--text);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const TryButton = styled(Button)`
  font-size: 1.25rem;
  padding: 1rem 2rem;
  margin-top: 2rem;
`;

const models = {
  'chest-xray': {
    title: 'Chest X-Ray Analysis',
    description: 'State-of-the-art deep learning model for analyzing chest X-rays and detecting various pulmonary conditions with high accuracy',
    icon: Lungs,
    accuracy: '97.8%',
    avgTime: '3.2 seconds',
    validationScore: '0.95'
  },
  'brain-mri': {
    title: 'Brain MRI Segmentation',
    description: 'Advanced neural network for precise segmentation of brain MRI scans, enabling accurate tumor detection and analysis',
    icon: Brain,
    accuracy: '96.5%',
    avgTime: '4.8 seconds',
    validationScore: '0.93'
  },
  'bone-xray': {
    title: 'Bone Fracture Detection',
    description: 'AI-powered analysis of bone X-rays for rapid and accurate detection of fractures and abnormalities',
    icon: Bone,
    accuracy: '95.9%',
    avgTime: '2.9 seconds',
    validationScore: '0.94'
  }
};

export const ModelDetail = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const model = models[modelId];

  if (!model) {
    return <div>Model not found</div>;
  }

  return (
    <>
      <Navbar />
      <ModelHeader>
        <Container>
          <ModelInfo>
            <ModelIcon>
              <model.icon size={40} />
            </ModelIcon>
            <ModelDetails>
              <ModelTitle>{model.title}</ModelTitle>
              <ModelDescription>{model.description}</ModelDescription>
              <ModelStats>
                <Stat>
                  <Star size={20} />
                  Accuracy: {model.accuracy}
                </Stat>
                <Stat>
                  <Clock size={20} />
                  Avg. Processing: {model.avgTime}
                </Stat>
                <Stat>
                  <CheckCircle size={20} />
                  Validation Score: {model.validationScore}
                </Stat>
              </ModelStats>
            </ModelDetails>
          </ModelInfo>
        </Container>
      </ModelHeader>

      <Container>
        <Content>
          <Section>
            <SectionTitle>Key Features</SectionTitle>
            <Grid>
              <FeatureCard>
                <h3>High Accuracy</h3>
                <p>Trained on a diverse dataset of over 100,000 medical images</p>
              </FeatureCard>
              <FeatureCard>
                <h3>Rapid Analysis</h3>
                <p>Results delivered in seconds for immediate clinical decision support</p>
              </FeatureCard>
              <FeatureCard>
                <h3>Detailed Reports</h3>
                <p>Comprehensive analysis with probability scores and region highlighting</p>
              </FeatureCard>
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Clinical Applications</SectionTitle>
            <p>This model assists healthcare professionals in:</p>
            <ul>
              <li>Early detection of abnormalities</li>
              <li>Monitoring disease progression</li>
              <li>Treatment planning and evaluation</li>
              <li>Research and clinical trials</li>
            </ul>
          </Section>

          <TryButton onClick={() => navigate(`/models/${modelId}/analyze`)}>
            Try the Model
          </TryButton>
        </Content>
      </Container>
    </>
  );
};