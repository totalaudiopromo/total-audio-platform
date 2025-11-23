/**
 * TimeAgo Component
 * Displays relative time with JetBrains Mono styling
 */

interface TimeAgoProps {
  timestamp: string | Date;
  showFull?: boolean;
}

export function TimeAgo({ timestamp, showFull = false }: TimeAgoProps) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relative = '';
  if (diffDays > 0) {
    relative = `${diffDays}d ago`;
  } else if (diffHours > 0) {
    relative = `${diffHours}h ago`;
  } else if (diffMins > 0) {
    relative = `${diffMins}m ago`;
  } else {
    relative = 'just now';
  }

  const full = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <time
      dateTime={date.toISOString()}
      title={full}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.8rem',
        color: '#9CA3AF',
        fontWeight: 500,
      }}
    >
      {showFull ? full : relative}
    </time>
  );
}
