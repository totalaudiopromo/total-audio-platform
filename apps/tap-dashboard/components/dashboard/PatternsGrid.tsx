import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface PatternsGridProps {
  patterns: Array<{
    id: string;
    pattern: string;
    confidence: number;
    impact: string;
  }>;
}

export function PatternsGrid({ patterns }: PatternsGridProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-foreground mb-4">Detected Patterns</h3>
      {patterns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No patterns detected yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map(item => (
            <div
              key={item.id}
              className="p-4 bg-muted rounded-xl border-2 border-black shadow-brutal-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm text-foreground flex-1">{item.pattern}</p>
                <Badge variant="teal" size="sm">
                  {(item.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{item.impact}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
