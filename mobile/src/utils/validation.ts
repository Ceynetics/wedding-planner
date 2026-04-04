// Shared form validation utilities
// Each validator returns an error string or undefined (valid)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;

export function required(value: string, fieldName: string): string | undefined {
  if (!value || !value.trim()) return `${fieldName} is required`;
}

export function email(value: string): string | undefined {
  if (value && !EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
}

export function phone(value: string): string | undefined {
  if (value && !PHONE_REGEX.test(value.trim())) return 'Please enter a valid phone number';
}

export function minLength(value: string, min: number, fieldName: string): string | undefined {
  if (value && value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
}

export function maxLength(value: string, max: number, fieldName: string): string | undefined {
  if (value && value.trim().length > max) return `${fieldName} must be at most ${max} characters`;
}

export function positiveNumber(value: string, fieldName: string): string | undefined {
  const num = parseFloat(value.replace(/,/g, ''));
  if (isNaN(num) || num <= 0) return `${fieldName} must be a positive number`;
}

export function ageRange(value: string, min = 16, max = 120): string | undefined {
  if (!value) return;
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) return `Age must be between ${min} and ${max}`;
}

/** Run validators in order, return first error */
export function validate(value: string, ...rules: Array<(v: string) => string | undefined>): string | undefined {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
}
