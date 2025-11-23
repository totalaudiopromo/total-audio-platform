/**
 * Entity Tag Component
 * Styled tag for entity types (artist, scene, publication, etc.)
 */

type EntityType = 'artist' | 'scene' | 'playlist' | 'publication' | 'source' | 'event';

interface EntityTagProps {
  type: EntityType;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const ENTITY_COLORS: Record<EntityType, string> = {
  artist: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  scene: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  playlist: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  publication: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  source: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  event: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

const ENTITY_ICONS: Record<EntityType, string> = {
  artist: '🎤',
  scene: '🌐',
  playlist: '🎵',
  publication: '📰',
  source: '📡',
  event: '📊',
};

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function EntityTag({ type, label, size = 'md', onClick }: EntityTagProps) {
  const color = ENTITY_COLORS[type];
  const icon = ENTITY_ICONS[type];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        inline-flex items-center space-x-1.5 rounded border font-mono font-medium
        transition-all duration-240 ease-out
        ${onClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        ${color}
        ${SIZE_STYLES[size]}
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
