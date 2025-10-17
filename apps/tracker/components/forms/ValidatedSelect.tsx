'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { validateField, type ValidationRule, type ValidationResult } from '@/lib/validation';

interface SelectOption {
  value: string;
  label: string;
}

interface ValidatedSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  rules?: ValidationRule[];
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ValidatedSelect({
  label,
  name,
  value,
  onChange,
  options,
  rules = [],
  placeholder = 'Select an option',
  helpText,
  disabled = false,
  required = false,
}: ValidatedSelectProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    suggestions: [],
  });
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (rules.length > 0) {
      const result = validateField(value, rules);
      setValidationResult(result);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    if (touched && rules.length > 0) {
      const result = validateField(e.target.value, rules);
      setValidationResult(result);
    }
  };

  const showErrors = touched && !validationResult.isValid;
  const showSuccess = touched && validationResult.isValid && value;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-black text-gray-900 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {/* Select Field */}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 rounded-xl font-bold border-2 transition-all focus:outline-none focus:ring-2 appearance-none bg-white ${
            showErrors
              ? 'border-red-500 focus:border-red-600 focus:ring-red-200 bg-red-50'
              : showSuccess
              ? 'border-green-500 focus:border-green-600 focus:ring-green-200 bg-green-50'
              : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
          aria-invalid={showErrors}
          aria-describedby={showErrors ? `${name}-error` : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon or Validation Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
          {showErrors ? (
            <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
          ) : showSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Help Text */}
      {helpText && !showErrors && (
        <p className="text-xs font-bold text-gray-600">{helpText}</p>
      )}

      {/* Error Messages */}
      {showErrors && (
        <div
          id={`${name}-error`}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-3 space-y-2 animate-in slide-in-from-top-2"
          role="alert"
          aria-live="assertive"
        >
          {validationResult.errors.map((error, index) => (
            <p key={index} className="text-sm font-bold text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </p>
          ))}

          {/* Show suggestions in errors */}
          {validationResult.suggestions.map((suggestion, index) => (
            <p key={`suggestion-${index}`} className="text-sm font-bold text-red-600 flex items-start gap-2 mt-2 pt-2 border-t border-red-200">
              <span className="text-xs bg-red-200 px-2 py-0.5 rounded font-black">TIP</span>
              <span>{suggestion}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
