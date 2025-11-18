/**
 * MeshCard Component
 * Standard card container for MeshOS UI
 */

import { ReactNode } from 'react';

interface MeshCardProps {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export function MeshCard({ children, hover = false, glow = false, className = '' }: MeshCardProps) {
  return (
    <div
      className={`mesh-card ${className}`}
      style={{
        backgroundColor: '#14171C',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '1.25rem',
        transition: 'all 220ms ease-out',
        ...(glow && {
          boxShadow: '0 0 20px rgba(58, 169, 190, 0.15)',
          border: '1px solid rgba(58, 169, 190, 0.2)',
        }),
        ...(hover && {
          cursor: 'pointer',
        }),
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.borderColor = 'rgba(58, 169, 190, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = glow
            ? '0 0 20px rgba(58, 169, 190, 0.15)'
            : 'none';
          e.currentTarget.style.borderColor = glow
            ? 'rgba(58, 169, 190, 0.2)'
            : 'rgba(255, 255, 255, 0.05)';
        }
      }}
    >
      {children}
    </div>
  );
}
