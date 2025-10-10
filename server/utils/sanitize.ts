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
  const email = data.email?.trim() || '';
  
  return {
    name: sanitizeString(data.name),
    email: validator.isEmail(email) ? (validator.normalizeEmail(email) || email) : email,
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
