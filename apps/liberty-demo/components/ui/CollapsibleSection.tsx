'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string | number;
  className?: string;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
  badge,
  className = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-[#D9D7D2] last:border-b-0 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#111]">{title}</span>
          {badge !== undefined && (
            <span className="px-2 py-0.5 bg-[#F5F5F5] text-[#737373] text-xs font-mono rounded-full">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-[#737373] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${
          isOpen ? 'max-h-[2000px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default CollapsibleSection;
