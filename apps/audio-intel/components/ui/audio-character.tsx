import React from 'react';
import { cn } from '@/lib/utils';

interface AudioCharacterProps {
  tool?: 'intel' | 'pulse' | 'radar' | 'track' | 'clone' | 'predict';
  state?: 'idle' | 'working' | 'success' | 'celebration' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const toolColors = {
  intel: {
    primary: '#1E88E5',
    secondary: '#1976D2',
    gradient: 'from-blue-600 to-blue-500',
  },
  pulse: {
    primary: '#43A047',
    secondary: '#388E3C',
    gradient: 'from-green-600 to-green-500',
  },
  radar: {
    primary: '#FF9800',
    secondary: '#F57C00',
    gradient: 'from-orange-600 to-orange-500',
  },
  track: {
    primary: '#9C27B0',
    secondary: '#7B1FA2',
    gradient: 'from-blue-600 to-blue-500',
  },
  clone: {
    primary: '#E91E63',
    secondary: '#C2185B',
    gradient: 'from-blue-600 to-blue-500',
  },
  predict: {
    primary: '#00BCD4',
    secondary: '#0097A7',
    gradient: 'from-cyan-600 to-cyan-500',
  },
};

const stateAnimations = {
  idle: 'animate-pulse',
  working: 'animate-spin',
  success: 'animate-bounce',
  celebration: 'animate-ping',
  thinking: 'animate-pulse',
};

export function AudioCharacter({
  tool = 'intel',
  state = 'idle',
  size = 'md',
  className,
  showText = false,
}: AudioCharacterProps) {
  const colors = toolColors[tool];
  const animation = stateAnimations[state];

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const isActive = state === 'working' || state === 'success' || state === 'celebration';

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center transition-all duration-800',
          sizeClasses[size],
          {
            'bg-gradient-to-br from-gray-200 to-gray-300': !isActive,
            [`bg-gradient-to-br ${colors.gradient}`]: isActive,
            'shadow-lg': isActive,
            'shadow-md': !isActive,
          }
        )}
      >
        {/* Audio Character SVG */}
        <svg
          viewBox="0 0 100 100"
          className={cn(
            'w-3/4 h-3/4 transition-all duration-800',
            {
              'text-gray-600': !isActive,
              'text-white': isActive,
            },
            animation
          )}
          style={{
            filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
          }}
        >
          {/* Dog head shape */}
          <ellipse cx="50" cy="45" rx="25" ry="20" fill="currentColor" />

          {/* Ears */}
          <ellipse cx="35" cy="35" rx="8" ry="12" fill="currentColor" />
          <ellipse cx="65" cy="35" rx="8" ry="12" fill="currentColor" />

          {/* Eyes */}
          <circle cx="42" cy="40" r="3" fill="white" />
          <circle cx="58" cy="40" r="3" fill="white" />
          <circle cx="42" cy="40" r="1.5" fill="currentColor" />
          <circle cx="58" cy="40" r="1.5" fill="currentColor" />

          {/* Nose */}
          <ellipse cx="50" cy="48" rx="2" ry="1" fill="white" />

          {/* Mouth */}
          <path
            d="M 45 52 Q 50 55 55 52"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Headphones for intel tool */}
          {tool === 'intel' && (
            <>
              <circle cx="30" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="70" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M 30 45 Q 50 35 70 45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Writing pose for pulse tool */}
          {tool === 'pulse' && (
            <>
              <rect x="60" y="60" width="15" height="2" fill="currentColor" rx="1" />
              <rect x="60" y="65" width="12" height="2" fill="currentColor" rx="1" />
              <rect x="60" y="70" width="10" height="2" fill="currentColor" rx="1" />
            </>
          )}

          {/* Success sparkles */}
          {state === 'success' && (
            <>
              <circle cx="20" cy="20" r="1" fill="white" className="animate-ping" />
              <circle
                cx="80"
                cy="20"
                r="1"
                fill="white"
                className="animate-ping"
                style={{ animationDelay: '0.2s' }}
              />
              <circle
                cx="20"
                cy="80"
                r="1"
                fill="white"
                className="animate-ping"
                style={{ animationDelay: '0.4s' }}
              />
              <circle
                cx="80"
                cy="80"
                r="1"
                fill="white"
                className="animate-ping"
                style={{ animationDelay: '0.6s' }}
              />
            </>
          )}
        </svg>

        {/* Working indicator */}
        {state === 'working' && (
          <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
        )}
      </div>

      {showText && (
        <div className="text-center">
          <div
            className={cn('text-sm font-semibold transition-colors duration-800', {
              'text-gray-600': !isActive,
              'text-gray-900': isActive,
            })}
          >
            Audio {tool.charAt(0).toUpperCase() + tool.slice(1)}
          </div>
          <div
            className={cn('text-xs transition-colors duration-800', {
              'text-gray-500': !isActive,
              [`text-${colors.primary}`]: isActive,
            })}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </div>
        </div>
      )}
    </div>
  );
}
