/**
 * Neobrutalist UI Components - Consistent design system for Command Centre
 * Matching Audio Intel styling
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

export const NeoCard: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const variantStyles = {
    default: 'border-black',
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    yellow: 'border-yellow-500',
    red: 'border-red-500',
  };

  return (
    <div
      className={`bg-white rounded-xl border-4 ${variantStyles[variant]} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  variant?: 'default' | 'blue' | 'green' | 'purple' | 'yellow';
}

export const NeoMetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-black',
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    yellow: 'border-yellow-500',
  };

  const iconBgStyles = {
    default: 'bg-gray-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100',
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl border-4 ${variantStyles[variant]} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm font-bold mt-2 ${
                changeType === 'positive'
                  ? 'text-green-600'
                  : changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 ${iconBgStyles[variant]} rounded-lg border-2 border-black flex items-center justify-center`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const NeoButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
}

export const NeoBadge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Loading Component
export const NeoLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-black border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-black text-gray-900 mb-2">{message}</h2>
      </div>
    </div>
  );
};

// Section Header Component
interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
}

export const NeoSectionHeader: React.FC<SectionHeaderProps> = ({ title, description, badge }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-3xl font-black text-gray-900">{title}</h2>
        {badge && <NeoBadge variant="blue">{badge}</NeoBadge>}
      </div>
      {description && <p className="text-lg text-gray-600 font-medium">{description}</p>}
    </div>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const NeoInput: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border-2 border-black rounded-lg font-medium bg-white placeholder-gray-500 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
};

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const NeoSelect: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border-2 border-black rounded-lg font-bold bg-white focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const NeoEmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => {
  return (
    <div className="text-center p-12 bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-600" />
        </div>
      )}
      <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 font-medium mb-6">{description}</p>
      {action && <NeoButton onClick={action.onClick}>{action.label}</NeoButton>}
    </div>
  );
};
