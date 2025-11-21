import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface BenchmarkTableProps {
  artistComparisons: Array<{
    artistSlug: string;
    artistName: string;
    replyQuality: number;
    scenePenetration: number;
    momentum: number;
    overallScore: number;
    rank: number;
  }>;
  insights: string[];
}

export function BenchmarkTable({ artistComparisons, insights }: BenchmarkTableProps) {
  return (
    <div className="space-y-6">
      {/* Insights */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Workspace Insights
        </h3>
        <ul className="space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-postcraft-gray-900 font-medium">
              <span className="text-postcraft-blue font-bold">→</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Comparison Table */}
      <Card padding="sm">
        <h3 className="text-lg font-bold text-postcraft-black mb-4 px-4 pt-2">
          Artist Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-postcraft-black">
                <th className="px-4 py-3 text-left text-xs text-postcraft-gray-700 uppercase tracking-wider font-bold">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs text-postcraft-gray-700 uppercase tracking-wider font-bold">
                  Artist
                </th>
                <th className="px-4 py-3 text-right text-xs text-postcraft-gray-700 uppercase tracking-wider font-bold">
                  Reply Quality
                </th>
                <th className="px-4 py-3 text-right text-xs text-postcraft-gray-700 uppercase tracking-wider font-bold">
                  Scene Penetration
                </th>
                <th className="px-4 py-3 text-right text-xs text-postcraft-gray-700 uppercase tracking-wider font-bold">
                  Momentum
                </th>
                <th className="px-4 py-3 text-right text-xs text-postcraft-gray-700 uppercase tracking-wider font-bold">
                  Overall Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-postcraft-gray-200">
              {artistComparisons.map((artist) => (
                <tr key={artist.artistSlug} className="hover:bg-postcraft-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Badge variant={artist.rank === 1 ? 'success' : 'default'} size="sm">
                      #{artist.rank}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-postcraft-gray-900 font-medium">
                    {artist.artistName}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-postcraft-gray-900">
                    {(artist.replyQuality * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-postcraft-gray-900">
                    {(artist.scenePenetration * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-postcraft-gray-900">
                    {(artist.momentum * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-black text-postcraft-blue">
                    {artist.overallScore.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
