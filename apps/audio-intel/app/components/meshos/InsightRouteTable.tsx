/**
 * InsightRouteTable Component
 * Table of insight routing rules
 */

'use client';

import type { InsightRoute } from '@total-audio/meshos';

interface InsightRouteTableProps {
  routes: InsightRoute[];
  onRefresh?: () => void;
}

export function InsightRouteTable({ routes, onRefresh }: InsightRouteTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-4 font-medium">Insight Type</th>
            <th className="text-left p-4 font-medium">Destination</th>
            <th className="text-left p-4 font-medium">Priority</th>
            <th className="text-left p-4 font-medium">Rule</th>
            <th className="text-left p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className="border-t">
              <td className="p-4 capitalize">{route.insight_type.replace(/_/g, ' ')}</td>
              <td className="p-4">{route.destination}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-primary/10 rounded text-xs">
                  {route.priority}
                </span>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {route.rule || 'Always'}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    route.enabled
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {route.enabled ? 'Active' : 'Disabled'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
