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
        <h3 className="text-lg font-bold text-foreground">Coverage Footprint</h3>
        <Badge variant="teal">{coverage.coverageScore.toFixed(0)} score</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">
            Total Events
          </p>
          <p className="text-2xl font-mono font-bold text-foreground">{coverage.totalEvents}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">
            Countries
          </p>
          <p className="text-2xl font-mono font-bold text-foreground">
            {coverage.countriesReached}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">
            Cities
          </p>
          <p className="text-2xl font-mono font-bold text-foreground">{coverage.citiesReached}</p>
        </div>
      </div>

      <div className="bg-muted rounded-xl p-4 border-2 border-black shadow-brutal-sm">
        <p className="text-xs text-muted-foreground text-center">
          Interactive map view available on coverage page →
        </p>
      </div>
    </Card>
  );
}
