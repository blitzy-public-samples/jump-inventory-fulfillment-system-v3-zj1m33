import express from 'express';
import { AuthController } from 'src/backend/controllers/authController';
import { 
  validateLoginInput, 
  validateRegistrationInput, 
  validatePasswordChangeInput, 
  validatePasswordResetInput 
} from 'src/backend/middleware/validationMiddleware';
import { authMiddleware } from 'src/backend/middleware/authMiddleware';

const setupAuthRoutes = (authController: AuthController): express.Router => {
  const router = express.Router();

  // Login route
  router.post('/login', validateLoginInput, authController.login);

  // Registration route
  router.post('/register', validateRegistrationInput, authController.register);

  // Change password route (requires authentication)
  router.post('/change-password', authMiddleware, validatePasswordChangeInput, authController.changePassword);

  // Reset password route
  router.post('/reset-password', validatePasswordResetInput, authController.resetPassword);

  return router;
};

export default setupAuthRoutes;