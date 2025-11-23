import { cn } from '@/lib/utils';

interface ScorePillProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScorePill({ score, label, size = 'md', className }: ScorePillProps) {
  const percentage = Math.round(score * 100);
  const color = getScoreColor(score);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium",
        size === 'sm' && "px-2.5 py-1 text-xs",
        size === 'md' && "px-3 py-1.5 text-sm",
        size === 'lg' && "px-4 py-2 text-base",
        color.bg,
        color.text,
        className
      )}
    >
      {label && <span className="font-mono">{label}:</span>}
      <span className="font-bold">{percentage}%</span>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 0.8) {
    return {
      bg: 'bg-emerald-500/10 border border-emerald-500/20',
      text: 'text-emerald-400'
    };
  }
  if (score >= 0.6) {
    return {
      bg: 'bg-[#3AA9BE]/10 border border-[#3AA9BE]/20',
      text: 'text-[#3AA9BE]'
    };
  }
  if (score >= 0.4) {
    return {
      bg: 'bg-amber-500/10 border border-amber-500/20',
      text: 'text-amber-400'
    };
  }
  return {
    bg: 'bg-slate-500/10 border border-slate-500/20',
    text: 'text-slate-400'
  };
}
