import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CoverageMapCardProps {
  coverage: {
    totalEvents: number;
    countriesReached: number;
    citiesReached: number;
    coverageScore: number;
  };
}

export function CoverageMapCard({ coverage }: CoverageMapCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-postcraft-black">
          Coverage Footprint
        </h3>
        <Badge variant="info">
          {coverage.coverageScore.toFixed(0)} score
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-1 font-bold">
            Total Events
          </p>
          <p className="text-2xl font-black text-postcraft-black">
            {coverage.totalEvents}
          </p>
        </div>
        <div>
          <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-1 font-bold">
            Countries
          </p>
          <p className="text-2xl font-black text-postcraft-black">
            {coverage.countriesReached}
          </p>
        </div>
        <div>
          <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-1 font-bold">
            Cities
          </p>
          <p className="text-2xl font-black text-postcraft-black">
            {coverage.citiesReached}
          </p>
        </div>
      </div>

      <div className="bg-postcraft-gray-50 rounded-lg p-4 border-2 border-postcraft-gray-200">
        <p className="text-xs text-postcraft-gray-700 text-center font-medium">
          Interactive map view available on coverage page →
        </p>
      </div>
    </Card>
  );
}
