/**
 * MeshCyanButton Component
 * Primary action button with cyan accent
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface MeshCyanButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function MeshCyanButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: MeshCyanButtonProps) {
  const sizeStyles = {
    sm: { padding: '0.4rem 0.8rem', fontSize: '0.8rem' },
    md: { padding: '0.6rem 1.2rem', fontSize: '0.875rem' },
    lg: { padding: '0.8rem 1.6rem', fontSize: '1rem' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#3AA9BE',
      color: '#FFF',
      border: '1px solid #3AA9BE',
      hover: {
        backgroundColor: '#2D8A9D',
        boxShadow: '0 0 16px rgba(58, 169, 190, 0.4)',
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#3AA9BE',
      border: '1px solid #3AA9BE',
      hover: {
        backgroundColor: 'rgba(58, 169, 190, 0.1)',
        boxShadow: '0 0 12px rgba(58, 169, 190, 0.2)',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      hover: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#F9FAFB',
      },
    },
  };

  const baseStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...sizeStyle,
        ...baseStyle,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        borderRadius: '6px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: 'all 220ms ease-out',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, baseStyle.hover);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = baseStyle.backgroundColor;
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.color = baseStyle.color;
        }
      }}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
}
