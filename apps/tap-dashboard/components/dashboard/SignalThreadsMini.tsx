import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

interface SignalThreadsMiniProps {
  events: Array<{
    id: string;
    date: Date;
    type: string;
    title: string;
    significance: number;
  }>;
}

export function SignalThreadsMini({ events }: SignalThreadsMiniProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'coverage':
        return 'success';
      case 'campaign_start':
        return 'info';
      case 'creative_release':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-foreground mb-4">Recent Signals</h3>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent events</p>
      ) : (
        <div className="space-y-3">
          {events.slice(0, 5).map(event => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-muted rounded-xl border-2 border-black shadow-brutal-sm"
            >
              <div className="flex-shrink-0 w-16 text-xs text-muted-foreground font-mono font-medium">
                {format(event.date, 'MMM dd')}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground mb-1">{event.title}</p>
                <Badge variant={getEventColor(event.type)} size="sm">
                  {event.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-border">
            <a
              href="/threads"
              className="text-xs text-brand-slate hover:text-brand-slate-dark font-medium transition-colors duration-180"
            >
              View full signal threads →
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
