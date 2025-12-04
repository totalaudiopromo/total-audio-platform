'use client';

interface HealthProgressBarProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthProgressBar({
  score,
  showLabel = true,
  size = 'sm',
}: HealthProgressBarProps) {
  const getHealthColour = (value: number) => {
    if (value > 80) return 'bg-green-500';
    if (value > 50) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  const barHeight = size === 'lg' ? 'h-3' : size === 'md' ? 'h-2' : 'h-1.5';
  const barWidth = size === 'lg' ? 'w-full' : size === 'md' ? 'w-24' : 'w-16';

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="font-mono text-sm font-bold text-gray-900 min-w-[2rem]">
          {score}
        </span>
      )}
      <div
        className={`${barWidth} ${barHeight} bg-gray-200 rounded-full overflow-hidden border border-gray-300`}
      >
        <div
          className={`h-full ${getHealthColour(score)} transition-all duration-300`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
