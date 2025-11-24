/**
 * PolicySummary Component
 * Display current policy status
 */

'use client';

export function PolicySummary() {
  // In a real implementation, this would fetch from /api/meshos/policy
  // For now, we'll display static policy information

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Quiet Hours</h4>
        <p className="text-sm text-muted-foreground">
          22:00 - 08:00 Europe/London
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Contact Fatigue Limits</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Max contacts per day: 50</li>
          <li>• Max contacts per week: 200</li>
          <li>• Min days between contacts: 2</li>
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">Risk Management</h4>
        <p className="text-sm text-muted-foreground">
          High-risk actions require manual approval
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Autonomy Caps</h4>
        <p className="text-sm text-muted-foreground">
          Max 100 autonomous actions per day
        </p>
      </div>
    </div>
  );
}
