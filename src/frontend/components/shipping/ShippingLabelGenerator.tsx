import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useShipping } from 'src/frontend/hooks/useShipping';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Select } from 'src/frontend/components/common/Select';
import { Modal } from 'src/frontend/components/common/Modal';
import { Order, ShippingLabel } from 'src/shared/types/index';

interface ShippingLabelGeneratorProps {
  order: Order;
  onLabelGenerated: (label: ShippingLabel) => void;
}

const LabelGeneratorContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
`;

export const ShippingLabelGenerator: React.FC<ShippingLabelGeneratorProps> = ({ order, onLabelGenerated }) => {
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [weight, setWeight] = useState('');
  const [shippingService, setShippingService] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const { generateShippingLabel } = useShipping();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in dimensions) {
      setDimensions(prev => ({ ...prev, [name]: value }));
    } else if (name === 'weight') {
      setWeight(value);
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingService(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const label = await generateShippingLabel({
        orderId: order.id,
        dimensions,
        weight: parseFloat(weight),
        shippingService
      });
      onLabelGenerated(label);
      setModalContent('Shipping label generated successfully!');
      setIsModalOpen(true);
    } catch (error) {
      setModalContent('Failed to generate shipping label. Please try again.');
      setIsModalOpen(true);
    }
  };

  return (
    <LabelGeneratorContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="length">Length (cm)</Label>
          <Input
            id="length"
            name="length"
            type="number"
            value={dimensions.length}
            onChange={handleInputChange}
            required
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="width">Width (cm)</Label>
          <Input
            id="width"
            name="width"
            type="number"
            value={dimensions.width}
            onChange={handleInputChange}
            required
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            value={dimensions.height}
            onChange={handleInputChange}
            required
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            value={weight}
            onChange={handleInputChange}
            required
            min="0"
            step="0.1"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="shippingService">Shipping Service</Label>
          <Select
            id="shippingService"
            name="shippingService"
            value={shippingService}
            onChange={handleServiceChange}
            required
          >
            <option value="">Select a shipping service</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </Select>
        </FormGroup>
        <Button type="submit">Generate Shipping Label</Button>
      </Form>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>{modalContent}</p>
      </Modal>
    </LabelGeneratorContainer>
  );
};