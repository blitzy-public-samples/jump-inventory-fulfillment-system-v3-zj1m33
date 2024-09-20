import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'src/frontend/hooks/useAuth';
import Button from 'src/frontend/components/common/Button';
import Input from 'src/frontend/components/common/Input';
import Alert from 'src/frontend/components/common/Alert';

// Interface for the reset password form data
interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// Initial state for the reset password form
const initialFormData: ResetPasswordFormData = {
  newPassword: '',
  confirmPassword: '',
};

const ResetPassword: React.FC = () => {
  // Initialize state for form data, loading state, and error message
  const [formData, setFormData] = useState<ResetPasswordFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get the reset token from URL parameters
  const { token } = useParams<{ token: string }>();

  // Get the resetPassword function from the useAuth hook
  const { resetPassword } = useAuth();

  // Initialize the navigate function for redirection
  const navigate = useNavigate();

  // Define handleInputChange function to update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Define handleSubmit function to process form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token!, formData.newPassword);
      navigate('/login', { state: { message: 'Password reset successful. Please log in with your new password.' } });
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the reset password form with input fields and submit button
  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          placeholder="New Password"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm New Password"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;

// Human tasks:
// - Implement password strength validation
// - Add unit tests for the ResetPassword component
// - Integrate with backend API for password reset functionality
// - Implement proper error handling for various API response scenarios
// - Add accessibility features (e.g., aria labels, keyboard navigation)