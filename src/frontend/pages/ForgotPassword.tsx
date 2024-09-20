import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

// Interface for the forgot password form data
interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  // Initialize state for form data, errors, and success message
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get the forgotPassword function from the useAuth hook
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  // Define handleSubmit function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      await forgotPassword(formData.email);
      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' });
    }
  };

  // Define handleInputChange function to update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Render the forgot password form with Material-UI components
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        margin: 'auto',
        padding: '2rem',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Forgot Password
      </Typography>

      {/* Display success message or error alerts if applicable */}
      {successMessage && (
        <Alert severity="success" sx={{ width: '100%', marginBottom: '1rem' }}>
          {successMessage}
        </Alert>
      )}
      {errors.email && (
        <Alert severity="error" sx={{ width: '100%', marginBottom: '1rem' }}>
          {errors.email}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Reset Password
        </Button>
      </form>

      {/* Provide a link to return to the login page */}
      <Button onClick={() => navigate('/login')} sx={{ mt: 2 }}>
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;

// Human tasks:
// TODO: Implement proper error handling and display user-friendly error messages
// TODO: Add rate limiting to prevent abuse of the forgot password functionality
// TODO: Implement logging for security auditing purposes
// TODO: Consider adding CAPTCHA or other anti-bot measures to the form
// TODO: Ensure the page is fully accessible and complies with WCAG guidelines