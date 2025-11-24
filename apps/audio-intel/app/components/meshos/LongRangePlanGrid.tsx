/**
 * LongRangePlanGrid Component
 * Grid visualization of long-range plans
 */

'use client';

import type { MeshPlan } from '@total-audio/meshos';

interface LongRangePlanGridProps {
  plan: MeshPlan;
}

export function LongRangePlanGrid({ plan }: LongRangePlanGridProps) {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              {plan.timeframe.toUpperCase()} Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Generated: {new Date(plan.generated_at).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="text-2xl font-bold">
              {Math.round(plan.confidence_score * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div>
        <h4 className="font-semibold mb-3">Objectives</h4>
        <div className="space-y-2">
          {plan.objectives.map((objective, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-muted/30">
              <div className="font-medium mb-1">{objective.name}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {objective.description}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span>Priority: {objective.priority}</span>
                <span>Target: {objective.target_value || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <h4 className="font-semibold mb-3">Planned Actions</h4>
        <div className="space-y-2">
          {plan.actions.map((action, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium mb-1">{action.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                  {action.agent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      {plan.milestones && plan.milestones.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Milestones</h4>
          <div className="space-y-2">
            {plan.milestones.map((milestone, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-success/10">
                <div className="font-medium mb-1">{milestone.name}</div>
                <div className="text-sm text-muted-foreground">
                  Target: {new Date(milestone.target_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {plan.risks && plan.risks.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Identified Risks</h4>
          <div className="space-y-2">
            {plan.risks.map((risk, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-destructive/10">
                <div className="font-medium mb-1">{risk.name}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {risk.description}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span>Probability: {risk.probability}</span>
                  <span>Impact: {risk.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {plan.opportunities && plan.opportunities.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Opportunities</h4>
          <div className="space-y-2">
            {plan.opportunities.map((opportunity, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-primary/10">
                <div className="font-medium mb-1">{opportunity.name}</div>
                <div className="text-sm text-muted-foreground">
                  {opportunity.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
