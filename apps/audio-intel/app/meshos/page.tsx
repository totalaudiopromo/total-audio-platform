/**
 * MeshOS Dashboard - Main Page
 * Overview of the mesh orchestration system
 */

import Link from 'next/link';
import { MeshContextPanel } from '../components/meshos/MeshContextPanel';
import { PolicySummary } from '../components/meshos/PolicySummary';

export default function MeshOSPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">MeshOS Control Center</h1>
        <p className="text-muted-foreground">
          Universal multi-agent coordination layer for Total Audio Platform
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/meshos/context"
          className="p-6 border rounded-lg hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Global Context</h3>
          <p className="text-sm text-muted-foreground">
            System-wide awareness and state
          </p>
        </Link>

        <Link
          href="/meshos/plans"
          className="p-6 border rounded-lg hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Long-Range Plans</h3>
          <p className="text-sm text-muted-foreground">
            7-day, 30-day, and 90-day planning
          </p>
        </Link>

        <Link
          href="/meshos/drift"
          className="p-6 border rounded-lg hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Drift Detection</h3>
          <p className="text-sm text-muted-foreground">
            Identify system contradictions
          </p>
        </Link>

        <Link
          href="/meshos/negotiations"
          className="p-6 border rounded-lg hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Negotiations</h3>
          <p className="text-sm text-muted-foreground">
            Multi-agent conflict resolution
          </p>
        </Link>

        <Link
          href="/meshos/routes"
          className="p-6 border rounded-lg hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Insight Routes</h3>
          <p className="text-sm text-muted-foreground">
            Insight distribution rules
          </p>
        </Link>

        <div className="p-6 border rounded-lg bg-muted">
          <h3 className="font-semibold mb-2">Messages</h3>
          <p className="text-sm text-muted-foreground">
            Cross-system messaging (coming soon)
          </p>
        </div>
      </div>

      {/* Current Context Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Context</h2>
        <MeshContextPanel />
      </div>

      {/* Policy Summary */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Policy Status</h2>
        <PolicySummary />
      </div>
    </div>
  );
}
