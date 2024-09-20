import React, { useState } from 'react';
import styled from 'styled-components';
import { useInventory } from 'src/frontend/hooks/useInventory';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Select } from 'src/frontend/components/common/Select';
import { InventoryItem } from 'src/shared/types/index';

interface InventoryAdjustmentProps {
  inventoryItem: InventoryItem;
  onAdjustment: (adjustedItem: InventoryItem) => void;
  onCancel: () => void;
}

const AdjustmentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const InventoryAdjustment: React.FC<InventoryAdjustmentProps> = ({ inventoryItem, onAdjustment, onCancel }) => {
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const { adjustInventory } = useInventory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adjustedItem = await adjustInventory(inventoryItem.id, adjustmentQuantity, adjustmentReason);
      onAdjustment(adjustedItem);
    } catch (error) {
      // TODO: Implement error handling
      console.error('Failed to adjust inventory:', error);
    }
  };

  return (
    <AdjustmentForm onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Current Quantity</Label>
        <Input type="number" value={inventoryItem.quantity} disabled />
      </FormGroup>
      <FormGroup>
        <Label>Adjustment Quantity</Label>
        <Input
          type="number"
          value={adjustmentQuantity}
          onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Adjustment Reason</Label>
        <Select
          value={adjustmentReason}
          onChange={(e) => setAdjustmentReason(e.target.value)}
          required
        >
          <option value="">Select a reason</option>
          <option value="recount">Recount</option>
          <option value="damaged">Damaged Goods</option>
          <option value="received">New Stock Received</option>
          <option value="other">Other</option>
        </Select>
      </FormGroup>
      <ButtonGroup>
        <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
        <Button type="submit">Submit Adjustment</Button>
      </ButtonGroup>
    </AdjustmentForm>
  );
};