// String utility functions for use across the application

/**
 * Capitalizes the first letter of a given string
 * @param str - The input string to capitalize
 * @returns The input string with its first letter capitalized
 */
export function capitalize(str: string): string {
  // Check if the input string is empty or undefined
  if (!str) {
    return '';
  }
  // Return the string with its first character capitalized and the rest unchanged
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and adds an ellipsis if truncated
 * @param str - The input string to truncate
 * @param maxLength - The maximum length of the resulting string
 * @returns The truncated string with ellipsis if necessary
 */
export function truncate(str: string, maxLength: number): string {
  // Check if the input string is shorter than or equal to maxLength
  if (str.length <= maxLength) {
    return str;
  }
  // Truncate the string to maxLength - 3 characters and append '...'
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Converts a string into a URL-friendly slug
 * @param str - The input string to convert to a slug
 * @returns A URL-friendly slug version of the input string
 */
export function slugify(str: string): string {
  // Convert the string to lowercase
  let slug = str.toLowerCase();
  // Replace all non-alphanumeric characters with hyphens
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  // Remove any consecutive hyphens
  slug = slug.replace(/-+/g, '-');
  // Remove leading and trailing hyphens
  slug = slug.replace(/^-|-$/g, '');
  return slug;
}

/**
 * Formats a number as a currency string
 * @param amount - The number to format as currency
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns A formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  // Use Intl.NumberFormat to create a formatter with the given currency code
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  // Format the amount using the created formatter
  return formatter.format(amount);
}

/**
 * Removes HTML tags from a string to prevent XSS attacks
 * @param html - The input string containing HTML
 * @returns The input string with all HTML tags removed
 */
export function sanitizeHtml(html: string): string {
  // Use a regular expression to match all HTML tags
  const htmlTagRegex = /<[^>]*>/g;
  // Replace all matched tags with an empty string
  return html.replace(htmlTagRegex, '');
}

/**
 * Generates a random string of specified length
 * @param length - The desired length of the random string
 * @returns A random string of the specified length
 */
export function generateRandomString(length: number): string {
  // Define a character set containing uppercase, lowercase letters, and numbers
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  // Use a loop to randomly select characters from the set
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

// Human tasks:
// - Review and test the implemented string utility functions
// - Consider adding more utility functions as needed during development
// - Ensure proper error handling for edge cases in each function