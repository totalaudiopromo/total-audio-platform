/**
 * Velocity Bar Component
 * Visual bar chart showing velocity metrics with acceleration indicator
 */

interface VelocityBarProps {
  velocity: number;
  acceleration: number;
  maxVelocity?: number;
}

export function VelocityBar({ velocity, acceleration, maxVelocity = 10 }: VelocityBarProps) {
  const percentage = Math.min((velocity / maxVelocity) * 100, 100);
  const isAccelerating = acceleration > 0;
  const isDecelerating = acceleration < 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">Velocity</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-slate-200">
            {velocity.toFixed(2)} <span className="text-slate-500">ev/hr</span>
          </span>
          {isAccelerating && (
            <span className="text-xs text-green-400" title="Accelerating">
              ↗
            </span>
          )}
          {isDecelerating && (
            <span className="text-xs text-red-400" title="Decelerating">
              ↘
            </span>
          )}
        </div>
      </div>

      <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className={`
            absolute left-0 top-0 h-full rounded-full
            transition-all duration-500 ease-out
            ${isAccelerating ? 'bg-[#3AA9BE]' : 'bg-slate-600'}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {acceleration !== 0 && (
        <div className="text-xs font-mono text-slate-500">
          Acceleration: {acceleration > 0 ? '+' : ''}
          {acceleration.toFixed(3)}
        </div>
      )}
    </div>
  );
}
