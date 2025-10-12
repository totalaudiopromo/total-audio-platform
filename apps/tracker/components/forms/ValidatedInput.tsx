'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { validateField, type ValidationRule, type ValidationResult } from '@/lib/validation';

interface ValidatedInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'url' | 'date' | 'textarea';
  value: string | number;
  onChange: (value: string | number) => void;
  rules?: ValidationRule[];
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  rows?: number; // For textarea
}

export function ValidatedInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  rules = [],
  placeholder,
  helpText,
  disabled = false,
  required = false,
  validateOnChange = false,
  validateOnBlur = true,
  rows = 4,
}: ValidatedInputProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    suggestions: [],
  });
  const [touched, setTouched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Validate field
  const validate = () => {
    if (rules.length === 0) return;
    const result = validateField(value, rules);
    setValidationResult(result);
  };

  // Validate on change if enabled
  useEffect(() => {
    if (validateOnChange && touched) {
      validate();
    }
  }, [value, validateOnChange, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);

    if (validateOnChange && touched) {
      validate();
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      validate();
    }
  };

  const showErrors = touched && !validationResult.isValid;
  const showSuccess = touched && validationResult.isValid && value;

  const inputClasses = `w-full px-4 py-3 rounded-xl font-bold border-2 transition-all focus:outline-none focus:ring-2 ${
    showErrors
      ? 'border-red-500 focus:border-red-600 focus:ring-red-200 bg-red-50'
      : showSuccess
      ? 'border-green-500 focus:border-green-600 focus:ring-green-200 bg-green-50'
      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
  } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`;

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-black text-gray-900 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>

        {/* Help Icon */}
        {(helpText || validationResult.suggestions.length > 0) && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Show help"
          >
            <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Input Field */}
      <div className="relative">
        <InputComponent
          id={name}
          name={name}
          type={type === 'textarea' ? undefined : type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={type === 'textarea' ? rows : undefined}
          className={inputClasses}
          aria-invalid={showErrors}
          aria-describedby={showErrors ? `${name}-error` : undefined}
        />

        {/* Validation Icon */}
        {(showErrors || showSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showErrors ? (
              <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && !showErrors && !showSuggestions && (
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
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && validationResult.suggestions.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 space-y-2 animate-in slide-in-from-top-2">
          <p className="text-xs font-black text-blue-900 uppercase tracking-wider">
            Suggestions:
          </p>
          {validationResult.suggestions.map((suggestion, index) => (
            <p key={index} className="text-sm font-bold text-blue-700 flex items-start gap-2">
              <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{suggestion}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
