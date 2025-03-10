import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { Settings as Lungs, Brain, Bone } from 'lucide-react';

const Hero = styled.div`
  padding: 4rem 0;
  text-align: center;
  background: linear-gradient(to right, #1e3a8a, #1e40af);
  color: white;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
`;

const ModelCard = styled(Link)`
  background-color: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
`;

const ModelIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
`;

const ModelTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text);
`;

const ModelDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

const models = [
  {
    id: 'chest-xray',
    title: 'Chest X-Ray Analysis',
    description: 'Advanced AI model for detecting various chest conditions including COVID-19, pneumonia, and other abnormalities',
    icon: Lungs,
    path: '/models/chest-xray'
  },
  {
    id: 'brain-mri',
    title: 'Brain MRI Segmentation',
    description: 'Precise segmentation of brain MRI scans for tumor detection and analysis',
    icon: Brain,
    path: '/models/brain-mri'
  },
  {
    id: 'bone-xray',
    title: 'Bone Fracture Detection',
    description: 'Rapid identification of bone fractures and abnormalities in X-ray images',
    icon: Bone,
    path: '/models/bone-xray'
  }
];

export const Home = () => {
  return (
    <>
      <Navbar />
      <Hero>
        <Container>
          <Title>Medical Imaging AI Platform</Title>
          <Subtitle>
            Advanced AI-powered analysis for medical imaging, providing rapid and accurate diagnostics support
          </Subtitle>
        </Container>
      </Hero>
      <Container>
        <ModelsGrid>
          {models.map((model) => (
            <ModelCard key={model.id} to={model.path}>
              <ModelIcon>
                <model.icon size={32} />
              </ModelIcon>
              <ModelTitle>{model.title}</ModelTitle>
              <ModelDescription>{model.description}</ModelDescription>
            </ModelCard>
          ))}
        </ModelsGrid>
      </Container>
    </>
  );
};