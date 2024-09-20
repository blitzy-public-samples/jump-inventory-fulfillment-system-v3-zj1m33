import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AlertProps } from '../../../shared/types/alert';
import { colors } from '../../styles/colors';
import { fadeIn, fadeOut } from '../../styles/animations';

// Styled components for the Alert
const AlertContainer = styled.div<{ type: string; isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 4px;
  background-color: ${({ type }) => colors[type] || colors.default};
  color: ${colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.3s ease-in-out;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  autoClose = true,
  duration = 5000,
  onClose
}) => {
  // State to control the visibility of the alert
  const [isVisible, setIsVisible] = useState(true);

  // Effect to handle auto-closing of the alert
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      // Clean up the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  // Function to handle closing the alert
  const handleClose = () => {
    setIsVisible(false);
    // Delay the onClose callback to allow the fade-out animation to complete
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  // Render the alert only if it's visible
  if (!isVisible) return null;

  return (
    <AlertContainer type={type} isVisible={isVisible}>
      <AlertContent>
        <span>{message}</span>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
      </AlertContent>
    </AlertContainer>
  );
};

export default Alert;

// Human tasks:
// TODO: Implement unit tests for the Alert component
// TODO: Consider adding more customization options, such as custom icons or additional styling props
// TODO: Evaluate accessibility improvements, such as adding ARIA attributes
// TODO: Review color contrast ratios for different alert types to ensure WCAG compliance