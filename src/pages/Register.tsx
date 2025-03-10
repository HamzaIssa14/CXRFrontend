import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SquareActivity } from 'lucide-react';
import { Button, Card, Input, FormGroup, Label } from '../components/styled';
import ApiService from "../services/api";

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 2rem;
`;

const RegisterForm = styled.form`
  margin-bottom: 1.5rem;
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  color: var(--primary);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log("Registering with:", { username, email, password });
      await ApiService.register({ username, email, password });

      // ✅ Show success message & redirect after a delay
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <SquareActivity size={32} />
          ACE Medical Imaging
        </Logo>
        <RegisterForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit" style={{ width: '100%' }}>Sign Up</Button>
        </RegisterForm>
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <LoginLink to="/login">Already have an account? Sign in</LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};
