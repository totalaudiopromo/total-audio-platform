'use client';

import { ReactNode, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ExpandableProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function Expandable({ title, children, defaultExpanded = false }: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-3 border-postcraft-black rounded-xl overflow-hidden shadow-brutal">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-postcraft-white hover:bg-postcraft-gray-50 transition-all duration-150"
      >
        <span className="text-sm font-bold text-postcraft-black">{title}</span>
        <ChevronDownIcon
          className={clsx('w-5 h-5 text-postcraft-gray-700 transition-transform duration-150', {
            'rotate-180': isExpanded,
          })}
        />
      </button>
      {isExpanded && (
        <div className="p-4 bg-postcraft-gray-50 border-t-3 border-postcraft-black">
          {children}
        </div>
      )}
    </div>
  );
}
