import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ENCRYPTION_KEY, ENCRYPTION_ALGORITHM, SALT_ROUNDS } from 'src/shared/constants/index';

export async function hashPassword(password: string): Promise<string> {
  // Generate a salt using bcrypt.genSalt with SALT_ROUNDS
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  
  // Hash the password using bcrypt.hash with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Return the hashed password
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  // Use bcrypt.compare to check if the plain-text password matches the hashed password
  const isMatch = await bcrypt.compare(password, hashedPassword);
  
  // Return the result of the comparison
  return isMatch;
}

export function encrypt(data: string): string {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);
  
  // Create a cipher using crypto.createCipheriv with ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, and IV
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  // Encrypt the data using the cipher
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Combine the IV and encrypted data
  const result = iv.toString('hex') + ':' + encrypted;
  
  // Return the result as a base64 encoded string
  return Buffer.from(result).toString('base64');
}

export function decrypt(encryptedData: string): string {
  // Decode the base64 encoded encrypted data
  const buff = Buffer.from(encryptedData, 'base64');
  const parts = buff.toString('utf8').split(':');
  
  // Extract the IV from the decoded data
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  
  // Create a decipher using crypto.createDecipheriv with ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, and IV
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  // Decrypt the data using the decipher
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  // Return the decrypted data as a string
  return decrypted.toString();
}