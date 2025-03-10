import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { ImageIcon, TextIcon, CodeIcon } from 'lucide-react';

const Hero = styled.div`
  padding: 4rem 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-light);
  margin-bottom: 3rem;
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
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ModelIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const ModelTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ModelDescription = styled.p`
  color: var(--text-light);
`;

const models = [
  {
    id: 1,
    title: 'Image Recognition',
    description: 'Identify objects and scenes in images with high accuracy',
    icon: ImageIcon,
    path: '/models/image-recognition'
  },
  {
    id: 2,
    title: 'Text Generation',
    description: 'Generate human-like text for various applications',
    icon: TextIcon,
    path: '/models/text-generation'
  },
  {
    id: 3,
    title: 'Code Analysis',
    description: 'Analyze and improve code quality automatically',
    icon: CodeIcon,
    path: '/models/code-analysis'
  }
];

export const Home = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Hero>
          <Title>Welcome to ACE Medical Imaging</Title>
          <Subtitle>
            Access state-of-the-art machine learning models through a simple interface
          </Subtitle>
        </Hero>
        <ModelsGrid>
          {models.map((model) => (
            <ModelCard key={model.id} to={model.path}>
              <ModelIcon>
                <model.icon size={24} />
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