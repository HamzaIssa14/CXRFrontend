import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SquareActivity } from 'lucide-react';
import { Button, Card, Input, FormGroup, Label } from '../components/styled';
import ApiService from "../services/api";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(Card)`
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

const LoginForm = styled.form`
  margin-bottom: 1.5rem;
`;

const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  color: var(--primary);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
  
    try {
      const response = await ApiService.login({ 
        usernameOrEmail: email,  
        password: password
      });
  
      console.log("Login successful!", response);
      navigate('/');  // 🔹 Redirect to homepage instead of `/dashboard`
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    }
  };
  
  

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <SquareActivity size={32} />
          Scanalyze Imaging
        </Logo>
        <LoginForm onSubmit={handleSubmit}>
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
          <Button type="submit" style={{ width: '100%' }}>Sign In</Button>
        </LoginForm>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <RegisterLink to="/register">Don't have an account? Sign up</RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};
