import React, { useState } from 'react';
import styled from '@emotion/styled';

// Define interfaces for component props and options
interface SelectProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

interface Option {
  value: string;
  label: string;
}

// Styled components for the Select
const SelectWrapper = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const SelectElement = styled.select<{ error?: string; disabled?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
  background-color: white;
  cursor: pointer;

  ${(props) =>
    props.disabled &&
    `
    background-color: #f0f0f0;
    cursor: not-allowed;
  `}

  ${(props) =>
    props.error &&
    `
    border-color: #ff0000;
  `}
`;

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

// Main Select component
const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Handle change event
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <SelectWrapper>
      <Label htmlFor={id}>{label}</Label>
      <SelectElement
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        error={error}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectElement>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectWrapper>
  );
};

export default Select;