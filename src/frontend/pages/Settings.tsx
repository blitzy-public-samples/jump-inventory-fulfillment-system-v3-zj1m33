import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Select } from 'src/frontend/components/common/Select';
import { Switch } from 'src/frontend/components/common/Switch';
import { Modal } from 'src/frontend/components/common/Modal';
import { useSettings } from 'src/frontend/hooks/useSettings';
import { useAuth } from 'src/frontend/hooks/useAuth';

const SettingsPageContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const SettingsSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const Settings: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [formValues, setFormValues] = useState(settings);
  const [errors, setErrors] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormValues(settings);
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormValues((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    // Implement validation logic here
    // Return true if valid, false otherwise
    return true;
  };

  const handleSaveSettings = async () => {
    if (validateForm()) {
      setIsSaving(true);
      try {
        await updateSettings(formValues);
        // Show success message
      } catch (error) {
        // Show error message
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleResetSettings = async () => {
    setIsResetModalOpen(false);
    try {
      await resetSettings();
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <SettingsPageContainer>
      <Header>Settings</Header>

      <SettingsSection>
        <SectionTitle>General Settings</SectionTitle>
        <FormGroup>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formValues.companyName}
            onChange={handleInputChange}
          />
        </FormGroup>
        {/* Add more general settings fields */}
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>Shopify Integration</SectionTitle>
        <FormGroup>
          <Label htmlFor="shopifyApiKey">Shopify API Key</Label>
          <Input
            id="shopifyApiKey"
            name="shopifyApiKey"
            value={formValues.shopifyApiKey}
            onChange={handleInputChange}
            type="password"
          />
        </FormGroup>
        {/* Add more Shopify integration fields */}
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>Sendle Integration</SectionTitle>
        <FormGroup>
          <Label htmlFor="sendleApiKey">Sendle API Key</Label>
          <Input
            id="sendleApiKey"
            name="sendleApiKey"
            value={formValues.sendleApiKey}
            onChange={handleInputChange}
            type="password"
          />
        </FormGroup>
        {/* Add more Sendle integration fields */}
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>Notification Preferences</SectionTitle>
        <FormGroup>
          <Label htmlFor="emailNotifications">Email Notifications</Label>
          <Switch
            id="emailNotifications"
            name="emailNotifications"
            checked={formValues.emailNotifications}
            onChange={(checked) => handleSwitchChange('emailNotifications', checked)}
          />
        </FormGroup>
        {/* Add more notification preference fields */}
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>User Interface Preferences</SectionTitle>
        <FormGroup>
          <Label htmlFor="theme">Theme</Label>
          <Select
            id="theme"
            name="theme"
            value={formValues.theme}
            onChange={handleInputChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </FormGroup>
        {/* Add more UI preference fields */}
      </SettingsSection>

      <Button onClick={handleSaveSettings} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
      <Button onClick={() => setIsResetModalOpen(true)} variant="secondary">
        Reset to Defaults
      </Button>

      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Reset"
      >
        <p>Are you sure you want to reset all settings to their default values?</p>
        <Button onClick={handleResetSettings}>Yes, Reset</Button>
        <Button onClick={() => setIsResetModalOpen(false)} variant="secondary">
          Cancel
        </Button>
      </Modal>
    </SettingsPageContainer>
  );
};