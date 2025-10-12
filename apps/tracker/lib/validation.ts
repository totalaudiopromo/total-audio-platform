/**
 * Unified Form Validation System
 *
 * Provides consistent validation patterns, error messages,
 * and recovery suggestions across all forms in the Tracker app.
 */

export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

/**
 * Validate a single field against multiple rules
 */
export function validateField(
  value: any,
  rules: ValidationRule[]
): ValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];

  for (const rule of rules) {
    let isValid = true;

    switch (rule.type) {
      case 'required':
        isValid = value !== null && value !== undefined && value !== '';
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = typeof value === 'string' && emailRegex.test(value);
        break;

      case 'url':
        try {
          new URL(value);
          isValid = true;
        } catch {
          isValid = false;
        }
        break;

      case 'min':
        if (typeof value === 'number') {
          isValid = value >= rule.value;
        } else if (typeof value === 'string') {
          isValid = value.length >= rule.value;
        }
        break;

      case 'max':
        if (typeof value === 'number') {
          isValid = value <= rule.value;
        } else if (typeof value === 'string') {
          isValid = value.length <= rule.value;
        }
        break;

      case 'pattern':
        isValid = typeof value === 'string' && rule.value.test(value);
        break;

      case 'custom':
        isValid = rule.value(value);
        break;
    }

    if (!isValid) {
      errors.push(rule.message);
      if (rule.suggestion) {
        suggestions.push(rule.suggestion);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
  };
}

/**
 * Common validation rules for campaign forms
 */
export const campaignValidation = {
  name: [
    {
      type: 'required' as const,
      message: 'Campaign name is required',
      suggestion: 'Enter a descriptive name for your campaign',
    },
    {
      type: 'min' as const,
      value: 3,
      message: 'Campaign name must be at least 3 characters',
      suggestion: 'Use a longer, more descriptive name',
    },
    {
      type: 'max' as const,
      value: 100,
      message: 'Campaign name must be less than 100 characters',
      suggestion: 'Shorten your campaign name',
    },
  ],

  artist_name: [
    {
      type: 'required' as const,
      message: 'Artist name is required',
      suggestion: 'Enter the name of the artist or band',
    },
    {
      type: 'min' as const,
      value: 2,
      message: 'Artist name must be at least 2 characters',
    },
  ],

  platform: [
    {
      type: 'required' as const,
      message: 'Platform is required',
      suggestion: 'Select the platform for this campaign (e.g., Radio, Spotify, TikTok)',
    },
  ],

  genre: [
    {
      type: 'required' as const,
      message: 'Genre is required',
      suggestion: 'Select a genre that best describes the music',
    },
  ],

  budget: [
    {
      type: 'required' as const,
      message: 'Budget is required',
      suggestion: 'Enter the budget in GBP (£)',
    },
    {
      type: 'min' as const,
      value: 0,
      message: 'Budget must be a positive number',
      suggestion: 'Enter a budget greater than £0',
    },
    {
      type: 'max' as const,
      value: 1000000,
      message: 'Budget must be less than £1,000,000',
      suggestion: 'If your budget is higher, contact support',
    },
  ],

  target_reach: [
    {
      type: 'required' as const,
      message: 'Target reach is required',
      suggestion: 'Enter your target audience size',
    },
    {
      type: 'min' as const,
      value: 1,
      message: 'Target reach must be at least 1',
      suggestion: 'Enter a realistic target reach',
    },
  ],

  actual_reach: [
    {
      type: 'min' as const,
      value: 0,
      message: 'Actual reach must be a positive number',
      suggestion: 'Enter the actual reach achieved (or leave at 0)',
    },
  ],

  start_date: [
    {
      type: 'required' as const,
      message: 'Start date is required',
      suggestion: 'Select when the campaign starts or started',
    },
  ],

  status: [
    {
      type: 'required' as const,
      message: 'Status is required',
      suggestion: 'Select a status: Planning, Active, Completed, or Paused',
    },
    {
      type: 'custom' as const,
      value: (status: string) =>
        ['planning', 'active', 'completed', 'paused'].includes(status),
      message: 'Invalid status value',
      suggestion: 'Choose one of: Planning, Active, Completed, Paused',
    },
  ],

  notes: [
    {
      type: 'max' as const,
      value: 1000,
      message: 'Notes must be less than 1000 characters',
      suggestion: 'Shorten your notes or move details to a separate document',
    },
  ],
};

/**
 * Common validation rules for user forms
 */
export const userValidation = {
  email: [
    {
      type: 'required' as const,
      message: 'Email address is required',
      suggestion: 'Enter your email address',
    },
    {
      type: 'email' as const,
      message: 'Invalid email address',
      suggestion: 'Check your email format (e.g., name@example.com)',
    },
  ],

  password: [
    {
      type: 'required' as const,
      message: 'Password is required',
      suggestion: 'Enter a secure password',
    },
    {
      type: 'min' as const,
      value: 8,
      message: 'Password must be at least 8 characters',
      suggestion: 'Use a longer password for better security',
    },
    {
      type: 'pattern' as const,
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain uppercase, lowercase, and number',
      suggestion: 'Include at least one uppercase letter, one lowercase letter, and one number',
    },
  ],

  name: [
    {
      type: 'required' as const,
      message: 'Name is required',
      suggestion: 'Enter your full name',
    },
    {
      type: 'min' as const,
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  ],
};

/**
 * Validate an entire form object
 */
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ValidationRule[]>
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>;

  for (const key in rules) {
    results[key] = validateField(data[key], rules[key]);
  }

  return results;
}

/**
 * Check if form is valid (all fields pass validation)
 */
export function isFormValid<T extends Record<string, any>>(
  validationResults: Record<keyof T, ValidationResult>
): boolean {
  return Object.values(validationResults).every((result: any) => result.isValid);
}

/**
 * Get all errors from form validation results
 */
export function getFormErrors<T extends Record<string, any>>(
  validationResults: Record<keyof T, ValidationResult>
): Record<keyof T, string[]> {
  const errors = {} as Record<keyof T, string[]>;

  for (const key in validationResults) {
    errors[key] = validationResults[key].errors;
  }

  return errors;
}

/**
 * Get all suggestions from form validation results
 */
export function getFormSuggestions<T extends Record<string, any>>(
  validationResults: Record<keyof T, ValidationResult>
): Record<keyof T, string[]> {
  const suggestions = {} as Record<keyof T, string[]>;

  for (const key in validationResults) {
    suggestions[key] = validationResults[key].suggestions;
  }

  return suggestions;
}
