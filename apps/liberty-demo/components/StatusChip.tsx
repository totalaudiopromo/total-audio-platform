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
        return 'bg-[#F5F5F5] text-black border-[#D9D7D2]';
      case 'risk':
        return 'bg-[#F5F5F5] text-[#525252] border-[#D9D7D2]';
      case 'scheduled':
        return 'bg-[#FAFAF8] text-[#737373] border-[#E8E6E1]';
      case 'completed':
      case 'complete':
        return 'bg-[#FAFAF8] text-[#9CA3AF] border-[#E8E6E1]';
      case 'paused':
        return 'bg-[#FAFAF8] text-[#9CA3AF] border-[#E8E6E1]';
      default:
        return 'bg-[#F5F5F5] text-[#525252] border-[#E8E6E1]';
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
