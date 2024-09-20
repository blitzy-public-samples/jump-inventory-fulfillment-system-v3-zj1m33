import { Request, Response } from 'express';
import { AuthService } from 'src/backend/services/authService';
import { handleApiError, validateEmail, validatePassword } from 'src/shared/utils/index';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      const result = await this.authService.login(username, password);
      res.json(result);
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, ...userData } = req.body;

      // Validate email and password
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password does not meet requirements');
      }

      const result = await this.authService.register({ email, password, ...userData });
      res.status(201).json(result);
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId, currentPassword, newPassword } = req.body;

      // Validate new password
      if (!validatePassword(newPassword)) {
        throw new Error('New password does not meet requirements');
      }

      await this.authService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // Validate email
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      await this.authService.resetPassword(email);
      res.json({ message: 'Password reset instructions sent to email' });
    } catch (error) {
      handleApiError(error, res);
    }
  }
}