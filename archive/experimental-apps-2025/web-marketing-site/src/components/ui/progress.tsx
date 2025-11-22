import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

const Progress = ({ value, max = 100, className = '' }: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { Progress };
