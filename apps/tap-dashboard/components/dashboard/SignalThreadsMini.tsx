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
      <h3 className="text-lg font-bold text-postcraft-black mb-4">
        Recent Signals
      </h3>
      {events.length === 0 ? (
        <p className="text-sm text-postcraft-gray-600">No recent events</p>
      ) : (
        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-postcraft-gray-50 rounded-lg border-2 border-postcraft-gray-200"
            >
              <div className="flex-shrink-0 w-16 text-xs text-postcraft-gray-700 font-bold">
                {format(event.date, 'MMM dd')}
              </div>
              <div className="flex-1">
                <p className="text-sm text-postcraft-gray-900 mb-1 font-medium">
                  {event.title}
                </p>
                <Badge variant={getEventColor(event.type)} size="sm">
                  {event.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t-2 border-postcraft-gray-200">
            <a
              href="/threads"
              className="text-xs text-postcraft-blue hover:text-postcraft-blue/80 font-bold transition-colors duration-150"
            >
              View full signal threads →
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
