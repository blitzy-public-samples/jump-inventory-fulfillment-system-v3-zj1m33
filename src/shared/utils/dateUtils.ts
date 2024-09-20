import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Formats a date string or Date object to a specified format
 * @param date - The date to format
 * @param format - The desired format string
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: string): string {
  // Convert input date to dayjs object
  const dayjsDate = dayjs(date);
  
  // Format the date using the specified format string
  const formattedDate = dayjsDate.format(format);
  
  // Return the formatted date string
  return formattedDate;
}

/**
 * Parses a date string into a Date object
 * @param dateString - The date string to parse
 * @returns Parsed Date object
 */
export function parseDate(dateString: string): Date {
  // Use dayjs to parse the input date string
  const parsedDate = dayjs(dateString);
  
  // Convert the parsed dayjs object to a native Date object
  const nativeDate = parsedDate.toDate();
  
  // Return the Date object
  return nativeDate;
}

/**
 * Calculates the difference between two dates in the specified unit
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The unit to measure the difference in (e.g., 'days', 'months', 'years')
 * @returns Difference between dates in the specified unit
 */
export function getDateDifference(date1: Date, date2: Date, unit: string): number {
  // Convert both input dates to dayjs objects
  const dayjsDate1 = dayjs(date1);
  const dayjsDate2 = dayjs(date2);
  
  // Calculate the difference between the dates using the specified unit
  const difference = dayjsDate2.diff(dayjsDate1, unit as any);
  
  // Return the difference as a number
  return difference;
}

/**
 * Checks if a date is before another date
 * @param date - The date to check
 * @param dateToCompare - The date to compare against
 * @returns True if date is before dateToCompare, false otherwise
 */
export function isDateBefore(date: Date, dateToCompare: Date): boolean {
  // Convert both input dates to dayjs objects
  const dayjsDate = dayjs(date);
  const dayjsDateToCompare = dayjs(dateToCompare);
  
  // Use dayjs's isBefore method to compare the dates
  const result = dayjsDate.isBefore(dayjsDateToCompare);
  
  // Return the boolean result
  return result;
}

/**
 * Checks if a date is after another date
 * @param date - The date to check
 * @param dateToCompare - The date to compare against
 * @returns True if date is after dateToCompare, false otherwise
 */
export function isDateAfter(date: Date, dateToCompare: Date): boolean {
  // Convert both input dates to dayjs objects
  const dayjsDate = dayjs(date);
  const dayjsDateToCompare = dayjs(dateToCompare);
  
  // Use dayjs's isAfter method to compare the dates
  const result = dayjsDate.isAfter(dayjsDateToCompare);
  
  // Return the boolean result
  return result;
}

/**
 * Converts a date to a specified timezone
 * @param date - The date to convert
 * @param timezone - The target timezone
 * @returns Date object in the specified timezone
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  // Convert input date to dayjs object
  const dayjsDate = dayjs(date);
  
  // Use dayjs's tz method to convert the date to the specified timezone
  const convertedDate = dayjsDate.tz(timezone);
  
  // Return the converted date as a native Date object
  return convertedDate.toDate();
}

// Human tasks:
// TODO: Verify that the timezone conversion function works correctly for all edge cases
// TODO: Add unit tests for each utility function
// TODO: Consider adding more specific date formatting functions for common use cases in the application
// TODO: Evaluate if additional date utility functions are needed based on application requirements