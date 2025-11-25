'use client';

import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  accentType?: 'crm' | 'radio' | 'press' | 'playlist' | 'pitch' | 'momentum';
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color,
  showDots = false,
  accentType = 'momentum',
}) => {
  if (!data || data.length === 0) return null;

  // TAP accent color mapping
  const accentColors = {
    crm: '#3AA9BE',
    radio: '#22C55E',
    press: '#EC4899',
    playlist: '#A855F7',
    pitch: '#F59E0B',
    momentum: '#EAB308',
  };

  const strokeColor = color || accentColors[accentType];

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {showDots &&
        data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return <circle key={index} cx={x} cy={y} r="2.5" fill={strokeColor} opacity="0.8" />;
        })}
    </svg>
  );
};

export default Sparkline;
