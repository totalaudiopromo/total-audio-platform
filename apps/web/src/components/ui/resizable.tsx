import React, { useState } from 'react';

interface ResizableProps {
  children: React.ReactNode;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  className?: string;
}

const Resizable = ({ 
  children, 
  defaultSize = { width: 300, height: 200 }, 
  minSize = { width: 100, height: 100 },
  maxSize = { width: 800, height: 600 },
  className = '' 
}: ResizableProps) => {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    setSize(prev => ({
      width: Math.min(Math.max(prev.width + deltaX, minSize.width), maxSize.width),
      height: Math.min(Math.max(prev.height + deltaY, minSize.height), maxSize.height)
    }));

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, startPos]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size.width, height: size.height }}
    >
      {children}
      <div
        className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
        onMouseDown={handleMouseDown}
      >
        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM22 14H20V12H22V14Z"/>
        </svg>
      </div>
    </div>
  );
};

export { Resizable }; 