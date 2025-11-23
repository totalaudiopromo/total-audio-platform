/**
 * Graph Node Component
 * Individual node in the media ecosystem graph
 */

interface GraphNodeProps {
  id: string;
  nodeType: 'publication' | 'playlist' | 'station' | 'blog';
  name: string;
  credibilityScore?: number;
  influenceScore?: number;
  category?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const NODE_TYPE_COLORS: Record<string, string> = {
  publication: 'bg-emerald-500 border-emerald-400',
  playlist: 'bg-purple-500 border-purple-400',
  station: 'bg-blue-500 border-blue-400',
  blog: 'bg-amber-500 border-amber-400',
};

const NODE_TYPE_ICONS: Record<string, string> = {
  publication: '📰',
  playlist: '🎵',
  station: '📻',
  blog: '✍️',
};

export function GraphNode({
  id,
  nodeType,
  name,
  credibilityScore,
  influenceScore,
  category,
  onClick,
  style,
}: GraphNodeProps) {
  const color = NODE_TYPE_COLORS[nodeType] || NODE_TYPE_COLORS.publication;
  const icon = NODE_TYPE_ICONS[nodeType] || '📊';

  // Scale node size based on influence score
  const scale = influenceScore ? 0.8 + influenceScore * 0.4 : 1;

  return (
    <div
      onClick={onClick}
      className={`
        absolute w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center
        cursor-pointer transition-all duration-240 ease-out
        hover:scale-110 hover:z-10 hover:shadow-lg hover:shadow-[#3AA9BE]/30
        ${color}
      `}
      style={{ ...style, transform: `${style?.transform || ''} scale(${scale})` }}
      title={`${name} (${nodeType}) - Credibility: ${credibilityScore?.toFixed(2) || 'N/A'}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-white font-semibold truncate w-16 text-center mt-1">
        {name}
      </span>

      {credibilityScore && credibilityScore >= 0.8 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3AA9BE] rounded-full border border-white flex items-center justify-center text-xs">
          ⭐
        </span>
      )}
    </div>
  );
}
