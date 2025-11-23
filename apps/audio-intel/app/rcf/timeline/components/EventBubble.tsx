/**
 * Event Bubble Component
 * Individual event marker on timeline with type indicator and weight
 */

interface EventBubbleProps {
  eventType: string;
  weight: number;
  timestamp: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  playlist_add: 'bg-purple-500 border-purple-400',
  press_feature: 'bg-emerald-500 border-emerald-400',
  radio_spin: 'bg-blue-500 border-blue-400',
  blog_post: 'bg-amber-500 border-amber-400',
  social_mention: 'bg-pink-500 border-pink-400',
  creative_breakthrough: 'bg-red-500 border-red-400',
  default: 'bg-slate-500 border-slate-400',
};

const EVENT_TYPE_ICONS: Record<string, string> = {
  playlist_add: '🎵',
  press_feature: '📰',
  radio_spin: '📻',
  blog_post: '✍️',
  social_mention: '💬',
  creative_breakthrough: '💡',
  default: '📊',
};

const SIZE_STYLES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

export function EventBubble({ eventType, weight, timestamp, onClick, size = 'md' }: EventBubbleProps) {
  const color = EVENT_TYPE_COLORS[eventType] || EVENT_TYPE_COLORS.default;
  const icon = EVENT_TYPE_ICONS[eventType] || EVENT_TYPE_ICONS.default;

  // Scale bubble opacity based on weight (0.0-1.0)
  const opacity = Math.max(0.3, Math.min(weight, 1.0));

  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-full border-2 flex items-center justify-center
        transition-all duration-240 ease-out
        hover:scale-110 hover:z-10 hover:shadow-lg
        ${color}
        ${SIZE_STYLES[size]}
      `}
      style={{ opacity }}
      title={`${eventType} (${weight.toFixed(2)}) at ${new Date(timestamp).toLocaleString()}`}
    >
      <span>{icon}</span>

      {/* Weight indicator ring */}
      {weight >= 0.8 && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#3AA9BE] rounded-full border border-white animate-pulse" />
      )}
    </button>
  );
}
