import React from 'react';
import { clsx } from 'clsx';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import type { ThemeId } from '../themes';

export interface OperatorWindowChromeProps {
  title: string;
  themeId: ThemeId;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

/**
 * OperatorWindowChrome Component
 *
 * Window-style container with theme-aware chrome.
 * - Title bar with window controls
 * - Theme-specific styling
 * - Optional grain/blur effects
 * - 240ms transitions matching Flow State
 */
export function OperatorWindowChrome({
  title,
  themeId,
  children,
  onClose,
  onMinimize,
  onMaximize,
  className,
}: OperatorWindowChromeProps) {
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg overflow-hidden',
        'border-2 transition-all duration-[240ms]',
        `operator-window operator-window--${themeId}`,
        className
      )}
      data-theme={themeId}
    >
      {/* Title Bar */}
      <div
        className={clsx(
          'flex items-center justify-between px-3 py-2',
          'operator-titlebar select-none',
          `operator-titlebar--${themeId}`
        )}
      >
        <span className="text-sm font-medium truncate">{title}</span>
        <div className="flex items-center gap-1">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1 hover:bg-black/10 rounded transition-colors duration-[240ms]"
              aria-label="Minimize"
            >
              {React.createElement(Minimize2 as any, { className: 'w-3 h-3' })}
            </button>
          )}
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="p-1 hover:bg-black/10 rounded transition-colors duration-[240ms]"
              aria-label="Maximize"
            >
              {React.createElement(Maximize2 as any, { className: 'w-3 h-3' })}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors duration-[240ms]"
              aria-label="Close"
            >
              {React.createElement(X as any, { className: 'w-3 h-3' })}
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={clsx('flex-1 operator-content', `operator-content--${themeId}`)}>
        {children}
      </div>
    </div>
  );
}
