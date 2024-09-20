import { isValidPhoneNumber } from 'libphonenumber-js';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};

export const validatePhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
  return isValidPhoneNumber(phoneNumber, countryCode);
};

export const validatePostalCode = (postalCode: string, countryCode: string): boolean => {
  const postalCodeRegexes: { [key: string]: RegExp } = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
    // Add more country-specific regex patterns here
  };

  const regex = postalCodeRegexes[countryCode.toUpperCase()];
  if (!regex) {
    // If country code is not supported, return false or implement a default behavior
    return false;
  }

  return regex.test(postalCode);
};

export const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

export const validatePrice = (price: number): boolean => {
  const isPositive = price > 0;
  const hasTwoDecimalPlacesOrLess = /^\d+(\.\d{1,2})?$/.test(price.toString());
  return isPositive && hasTwoDecimalPlacesOrLess;
};

// TODO: Implement additional validation functions as needed (e.g., SKU, barcode)
// TODO: Add input sanitization functions to complement the validation functions
// TODO: Optimize performance for frequently used validation functions if necessary