import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from 'src/backend/models/User';
import { UserRole } from 'src/shared/types/index';
import { JWT_EXPIRY, MAX_LOGIN_ATTEMPTS } from 'src/shared/constants/index';
import { handleApiError } from 'src/shared/utils/index';

export class AuthService {
  async login(username: string, password: string): Promise<object> {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        throw new Error('Account locked due to too many failed attempts');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        user.loginAttempts += 1;
        await user.save();
        throw new Error('Invalid password');
      }

      user.loginAttempts = 0;
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: JWT_EXPIRY }
      );

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<object> {
    try {
      const existingUser = await User.findOne({
        where: { [Op.or]: [{ username: userData.username }, { email: userData.email }] },
      });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await User.create({
        ...userData,
        password: hashedPassword,
      });

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      // TODO: Implement email sending functionality
      console.log(`Password reset token for ${email}: ${resetToken}`);

      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async verifyToken(token: string): Promise<object> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return decoded as object;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}