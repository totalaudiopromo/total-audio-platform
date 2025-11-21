import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

interface NarrativeThreadViewProps {
  thread: {
    threadType: string;
    events: Array<{
      id: string;
      date: Date;
      type: string;
      title: string;
      description: string;
      significance: number;
    }>;
    milestones: Array<{
      id: string;
      date: Date;
      title: string;
      description: string;
      impact: string;
    }>;
    narrativeSummary: string;
    insights: string[];
  };
}

export function NarrativeThreadView({ thread }: NarrativeThreadViewProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'coverage':
        return 'success';
      case 'campaign_start':
        return 'info';
      case 'creative_release':
        return 'warning';
      case 'reply':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Narrative Summary
        </h3>
        <p className="text-sm text-postcraft-gray-900 leading-relaxed">
          {thread.narrativeSummary}
        </p>
      </Card>

      {/* Milestones */}
      {thread.milestones.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Key Milestones
          </h3>
          <div className="space-y-4">
            {thread.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-20 text-xs text-postcraft-gray-700 font-bold">
                    {format(milestone.date, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-postcraft-black font-bold mb-1">
                      {milestone.title}
                    </p>
                    <p className="text-xs text-postcraft-gray-700 mb-2">
                      {milestone.description}
                    </p>
                    <p className="text-xs text-postcraft-blue font-bold">
                      Impact: {milestone.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Full Timeline
        </h3>
        <div className="space-y-3">
          {thread.events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-postcraft-gray-50 rounded-lg border-2 border-postcraft-gray-200"
            >
              <div className="flex-shrink-0 w-20 text-xs text-postcraft-gray-700 font-bold">
                {format(event.date, 'MMM dd')}
              </div>
              <div className="flex-1">
                <p className="text-sm text-postcraft-gray-900 mb-1 font-medium">
                  {event.title}
                </p>
                <p className="text-xs text-postcraft-gray-600 mb-2">
                  {event.description}
                </p>
                <Badge variant={getEventColor(event.type)} size="sm">
                  {event.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      {thread.insights.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Insights
          </h3>
          <ul className="space-y-2">
            {thread.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-postcraft-gray-900 font-medium">
                <span className="text-postcraft-blue font-bold">→</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
