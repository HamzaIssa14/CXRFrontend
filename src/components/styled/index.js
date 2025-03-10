import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Button = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background-color: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text);
`;