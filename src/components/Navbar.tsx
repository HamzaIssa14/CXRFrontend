import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SquareActivity, LogOut } from 'lucide-react';
import { Container } from './styled';
import ApiService from '../services/api';
const Nav = styled.nav`
  background-color: var(--surface);
  padding: 1rem 0;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`;

const NavContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  font-weight: 500;
  
  &:hover {
    color: var(--primary);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text);
  font-weight: 500;
  
  &:hover {
    color: var(--error);
  }
`;

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout button clicked!"); // ✅ Debugging log
    ApiService.logout();
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <SquareActivity size={24} />
          ACE Medical Imaging
        </Logo>
        <NavLinks>
          <NavLink to="/models">Models</NavLink>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </LogoutButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};