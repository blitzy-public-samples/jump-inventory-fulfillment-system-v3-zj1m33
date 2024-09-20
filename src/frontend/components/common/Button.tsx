import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<ButtonProps>`
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  // Size styles
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'large':
        return `
          padding: 16px 24px;
          font-size: 18px;
        `;
      default:
        return `
          padding: 12px 20px;
          font-size: 16px;
        `;
    }
  }}

  // Variant styles
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: #f0f0f0;
          color: #333;
          &:hover {
            background-color: #e0e0e0;
          }
          &:active {
            background-color: #d0d0d0;
          }
        `;
      case 'danger':
        return `
          background-color: #ff4d4f;
          color: white;
          &:hover {
            background-color: #ff7875;
          }
          &:active {
            background-color: #d9363e;
          }
        `;
      default:
        return `
          background-color: #1890ff;
          color: white;
          &:hover {
            background-color: #40a9ff;
          }
          &:active {
            background-color: #096dd9;
          }
        `;
    }
  }}

  // Full width style
  ${props => props.fullWidth && `
    width: 100%;
  `}

  // Disabled state
  ${props => props.disabled && `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background-color: inherit;
    }
  `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button',
  ...rest
}) => {
  return (
    <StyledButton
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      type={type}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};