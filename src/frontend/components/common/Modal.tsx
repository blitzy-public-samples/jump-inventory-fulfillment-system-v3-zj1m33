import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/frontend/components/common/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ size?: string }>`
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '300px';
      case 'large':
        return '800px';
      default:
        return '500px';
    }
  }};
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent size={size}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};