import React from 'react';
import { Status } from '@/lib/types';

interface StatusChipProps {
  status: Status | string;
  size?: 'sm' | 'md';
}

const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
        return 'bg-neutral-100 text-black border-neutral-300';
      case 'risk':
        return 'bg-neutral-100 text-neutral-600 border-neutral-300';
      case 'scheduled':
        return 'bg-neutral-50 text-neutral-500 border-neutral-200';
      case 'completed':
      case 'complete':
        return 'bg-neutral-50 text-neutral-400 border-neutral-200';
      case 'paused':
        return 'bg-neutral-50 text-neutral-400 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getSize = () => {
    return size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium font-sans border rounded-full capitalize ${getStyles(status)} ${getSize()}`}
    >
      {status}
    </span>
  );
};

export default StatusChip;
