const crypto = require('crypto');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');

// Global constants
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Generates a new encryption key using AWS KMS
 * @returns {Promise<string>} A promise that resolves to the generated encryption key
 */
async function generateEncryptionKey() {
    // Initialize AWS KMS client
    const kms = new AWS.KMS();

    // Call KMS generateDataKey method
    const params = {
        KeyId: process.env.AWS_KMS_KEY_ID, // Ensure this environment variable is set
        KeySpec: 'AES_256'
    };

    try {
        const data = await kms.generateDataKey(params).promise();
        // Return the plaintext key as a base64 encoded string
        return data.Plaintext.toString('base64');
    } catch (error) {
        console.error('Error generating encryption key:', error);
        throw error;
    }
}

/**
 * Encrypts the given data using AES-256-GCM
 * @param {string} data - The data to encrypt
 * @param {string} key - The encryption key
 * @returns {string} Encrypted data as a base64 encoded string
 */
function encrypt(data, key) {
    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create a cipher using the encryption algorithm, key, and IV
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(key, 'base64'), iv);

    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the authentication tag
    const authTag = cipher.getAuthTag();

    // Concatenate IV, encrypted data, and auth tag
    const result = Buffer.concat([iv, Buffer.from(encrypted, 'hex'), authTag]);

    // Return the result as a base64 encoded string
    return result.toString('base64');
}

/**
 * Decrypts the given encrypted data using AES-256-GCM
 * @param {string} encryptedData - The encrypted data to decrypt
 * @param {string} key - The decryption key
 * @returns {string} Decrypted data as a UTF-8 string
 */
function decrypt(encryptedData, key) {
    // Decode the base64 encrypted data
    const buffer = Buffer.from(encryptedData, 'base64');

    // Extract IV, encrypted content, and auth tag
    const iv = buffer.slice(0, IV_LENGTH);
    const encrypted = buffer.slice(IV_LENGTH, -AUTH_TAG_LENGTH);
    const authTag = buffer.slice(-AUTH_TAG_LENGTH);

    // Create a decipher using the encryption algorithm, key, and IV
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(key, 'base64'), iv);

    // Set the auth tag
    decipher.setAuthTag(authTag);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Return the decrypted data as a UTF-8 string
    return decrypted;
}

/**
 * Hashes a password using bcrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} A promise that resolves to the hashed password
 */
async function hashPassword(password) {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Return the hashed password
    return hashedPassword;
}

/**
 * Compares a plain-text password with a hashed password
 * @param {string} plainPassword - The plain-text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise
 */
async function comparePassword(plainPassword, hashedPassword) {
    // Use bcrypt to compare the plain-text password with the hashed password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    // Return the result of the comparison
    return isMatch;
}

module.exports = {
    generateEncryptionKey,
    encrypt,
    decrypt,
    hashPassword,
    comparePassword
};

// Human tasks:
// TODO: Implement key rotation mechanism for AWS KMS
// TODO: Add unit tests for all encryption functions
// TODO: Consider implementing a key derivation function for additional security
// TODO: Review and update encryption methods periodically to ensure they meet current security standards