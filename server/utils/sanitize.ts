import validator from 'validator';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeString(str: string | undefined | null): string {
  if (!str) return '';
  
  // Remove HTML tags and escape special characters
  return validator.escape(validator.stripLow(str.trim()));
}

/**
 * Sanitize contact form data
 */
export function sanitizeContactData(data: any) {
  return {
    name: sanitizeString(data.name),
    email: validator.normalizeEmail(data.email) || data.email,
    phone: data.phone ? sanitizeString(data.phone) : undefined,
    company: data.company ? sanitizeString(data.company) : undefined,
    message: sanitizeString(data.message),
  };
}

/**
 * Validate and limit string length
 */
export function limitLength(str: string, max: number): string {
  return str.slice(0, max);
}
