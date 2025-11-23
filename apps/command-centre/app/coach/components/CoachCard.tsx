'use client';

/**
 * CoachCard Component
 * Reusable card component for CoachOS UI
 * Follows Flow State Design System
 */

import React from 'react';

interface CoachCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function CoachCard({
  title,
  children,
  className = '',
  headerAction,
}: CoachCardProps) {
  return (
    <div
      className={`
        bg-black/40 backdrop-blur-sm
        border border-[#3AA9BE]/20
        rounded-2xl
        p-6
        transition-all duration-300 ease-out
        hover:border-[#3AA9BE]/40
        hover:shadow-lg hover:shadow-[#3AA9BE]/10
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white/90 font-['Inter']">
            {title}
          </h3>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
