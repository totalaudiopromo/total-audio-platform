/**
 * PageHeader - Header for scenes pages
 */

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-white/[0.06]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-[#3AA9BE] rounded-full animate-pulse" />
            <h1
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-slate-400 text-sm mt-2 ml-6">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
