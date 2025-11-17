/**
 * CISCard - Standard card component for CIS
 */

import React from 'react';

export interface CISCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CISCard: React.FC<CISCardProps> = ({
  title,
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-[#1F2937] p-6 ${
        onClick ? 'cursor-pointer hover:bg-[#374151]' : ''
      } transition-all duration-240 ${className}`}
    >
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};
