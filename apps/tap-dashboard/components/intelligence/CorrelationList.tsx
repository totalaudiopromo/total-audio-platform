import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CorrelationListProps {
  correlations: Record<string, { correlation: number; replyRate?: number; openRate?: number }>;
  highlights: string[];
  recommendations: string[];
}

export function CorrelationList({ correlations, highlights, recommendations }: CorrelationListProps) {
  return (
    <div className="space-y-6">
      {/* Highlights */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Key Findings
        </h3>
        <ul className="space-y-2">
          {highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-postcraft-gray-900 font-medium">
              <span className="text-postcraft-blue font-bold">→</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Correlations */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Correlations Detected
        </h3>
        <div className="space-y-3">
          {Object.entries(correlations).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-postcraft-gray-50 rounded-lg border-2 border-postcraft-gray-200"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-sm text-postcraft-gray-900 flex-1 font-medium">
                  {key.replace(/_/g, ' ')}
                </p>
                <Badge variant="info">
                  {(value.correlation * 100).toFixed(0)}%
                </Badge>
              </div>
              {value.replyRate !== undefined && (
                <p className="text-xs text-postcraft-gray-600">
                  Reply rate: {(value.replyRate * 100).toFixed(1)}%
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Recommendations
        </h3>
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-postcraft-gray-900 font-medium">
              <span className="text-green-600 font-bold">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
