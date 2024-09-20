import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  background-color: #f8f9fa;
  padding: 1rem 0;
  margin-top: auto;
  width: 100%;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const FooterLink = styled(Link)`
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
  &:hover {
    color: #007bff;
    text-decoration: underline;
  }
`;

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <Copyright>&copy; {currentYear} Inventory Management and Fulfillment</Copyright>
        <FooterLinks>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterWrapper>
  );
};

// TODO: Add social media icons
// TODO: Implement responsive design for mobile devices
// TODO: Create unit tests
// TODO: Ensure accessibility with proper ARIA attributes
// TODO: Consider adding newsletter signup form
// TODO: Add translations for multiple languages support