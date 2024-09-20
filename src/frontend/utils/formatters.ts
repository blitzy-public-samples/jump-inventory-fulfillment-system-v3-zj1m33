import dayjs from 'dayjs';
import { DATE_FORMAT, CURRENCY } from 'src/shared/constants/index';

/**
 * Formats a date string or Date object to the application's standard date format
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format(DATE_FORMAT);
};

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY,
  }).format(amount);
};

/**
 * Formats a phone number string
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Apply formatting based on the length of the number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else {
    // If the number doesn't match expected formats, return it as-is
    return phoneNumber;
  }
};

/**
 * Formats an address object into a string
 * @param address - The address object to format
 * @returns Formatted address string
 */
export const formatAddress = (address: {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}): string => {
  const { street1, street2, city, state, postalCode, country } = address;
  let formattedAddress = `${street1}`;
  if (street2) formattedAddress += `, ${street2}`;
  formattedAddress += `, ${city}, ${state} ${postalCode}, ${country}`;
  return formattedAddress;
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the truncated text
 * @returns Truncated text string
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};