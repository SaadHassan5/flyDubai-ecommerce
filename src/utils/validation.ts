// Validation utility functions

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const isValidPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

// String length validation
export const isValidLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

// Numeric validation
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Form validation helper
export const validateForm = (fields: Record<string, any>, rules: Record<string, any>): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  
  Object.keys(rules).forEach(fieldName => {
    const fieldValue = fields[fieldName];
    const fieldRules = rules[fieldName];
    const fieldErrors: string[] = [];
    
    // Required validation
    if (fieldRules.required && !isRequired(fieldValue)) {
      fieldErrors.push(`${fieldName} is required`);
    }
    
    // Email validation
    if (fieldRules.email && fieldValue && !isValidEmail(fieldValue)) {
      fieldErrors.push(`${fieldName} must be a valid email address`);
    }
    
    // Phone validation
    if (fieldRules.phone && fieldValue && !isValidPhone(fieldValue)) {
      fieldErrors.push(`${fieldName} must be a valid phone number`);
    }
    
    // Length validation
    if (fieldRules.minLength && fieldValue && !isValidLength(fieldValue, fieldRules.minLength, Infinity)) {
      fieldErrors.push(`${fieldName} must be at least ${fieldRules.minLength} characters long`);
    }
    
    if (fieldRules.maxLength && fieldValue && !isValidLength(fieldValue, 0, fieldRules.maxLength)) {
      fieldErrors.push(`${fieldName} must be no more than ${fieldRules.maxLength} characters long`);
    }
    
    // Numeric validation
    if (fieldRules.numeric && fieldValue && !isNumeric(fieldValue)) {
      fieldErrors.push(`${fieldName} must be a valid number`);
    }
    
    // URL validation
    if (fieldRules.url && fieldValue && !isValidUrl(fieldValue)) {
      fieldErrors.push(`${fieldName} must be a valid URL`);
    }
    
    // Custom validation
    if (fieldRules.custom && fieldValue) {
      const customResult = fieldRules.custom(fieldValue);
      if (customResult && !customResult.isValid) {
        fieldErrors.push(...customResult.errors);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  });
  
  return errors;
};
