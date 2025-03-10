import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../components/styled';
import { Navbar } from '../components/Navbar';
import { ImageIcon, TextIcon, CodeIcon, Star } from 'lucide-react';

const ModelHeader = styled.div`
  padding: 3rem 0;
  background-color: var(--surface);
  border-bottom: 1px solid #e5e7eb;
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
`;

const ModelIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: var(--primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ModelDetails = styled.div`
  flex: 1;
`;

const ModelTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ModelDescription = styled.p`
  color: var(--text-light);
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const ModelStats = styled.div`
  display: flex;
  gap: 2rem;
  color: var(--text-light);
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem 0;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const models = {
  'image-recognition': {
    title: 'Image Recognition',
    description: 'State-of-the-art computer vision model for identifying objects and scenes in images',
    icon: ImageIcon,
    accuracy: '98.5%',
    requests: '1.2M'
  },
  'text-generation': {
    title: 'Text Generation',
    description: 'Advanced language model capable of generating human-like text for various applications',
    icon: TextIcon,
    accuracy: '96.8%',
    requests: '2.5M'
  },
  'code-analysis': {
    title: 'Code Analysis',
    description: 'Intelligent code analysis model for improving code quality and identifying potential issues',
    icon: CodeIcon,
    accuracy: '94.2%',
    requests: '800K'
  }
};

export const ModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const model = modelId ? models[modelId as keyof typeof models] : null;

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
              <model.icon size={32} />
            </ModelIcon>
            <ModelDetails>
              <ModelTitle>{model.title}</ModelTitle>
              <ModelDescription>{model.description}</ModelDescription>
              <ModelStats>
                <Stat>
                  <Star size={18} />
                  Accuracy: {model.accuracy}
                </Stat>
                <Stat>
                  Total Requests: {model.requests}
                </Stat>
              </ModelStats>
            </ModelDetails>
          </ModelInfo>
        </Container>
      </ModelHeader>
      <Container>
        <Content>
          <Section>
            <SectionTitle>Overview</SectionTitle>
            <p>
              This model represents the cutting edge in machine learning technology,
              offering high accuracy and reliable results for real-world applications.
              Built on advanced neural networks and trained on extensive datasets,
              it provides robust performance across a wide range of use cases.
            </p>
          </Section>
          <Section>
            <SectionTitle>Features</SectionTitle>
            <ul>
              <li>High accuracy and reliability</li>
              <li>Fast processing times</li>
              <li>Support for multiple input formats</li>
              <li>Detailed output analysis</li>
            </ul>
          </Section>
        </Content>
      </Container>
    </>
  );
};