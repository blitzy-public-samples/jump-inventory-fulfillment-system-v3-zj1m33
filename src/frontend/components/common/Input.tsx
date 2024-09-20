import React from 'react';
import styled from 'styled-components';

interface InputProps {
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-bottom: 10px;
`;

const StyledInput = styled.input<{ size?: 'small' | 'medium' | 'large'; error?: string; disabled?: boolean }>`
  padding: ${props => {
    switch (props.size) {
      case 'small': return '6px 10px';
      case 'large': return '12px 16px';
      default: return '8px 12px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  border: 1px solid ${props => props.error ? 'red' : '#ccc'};
  border-radius: 4px;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

export const Input: React.FC<InputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  fullWidth,
  size = 'medium',
}) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      <StyledInput
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        size={size}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};