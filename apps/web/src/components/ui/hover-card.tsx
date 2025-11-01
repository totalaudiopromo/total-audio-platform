import React, { useState } from 'react';

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

const HoverCard = ({ trigger, content, className = '' }: HoverCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {trigger}
      {isVisible && (
        <div className="absolute z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white p-4 shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export { HoverCard };
