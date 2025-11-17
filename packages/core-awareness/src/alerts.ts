/**
 * Alerts
 * Risk and opportunity alert generation, filtering, and delivery
 */

import type {
  Risk,
  Opportunity,
  Mismatch,
  AwarenessRecommendation,
  Trajectory,
} from './types';
import { logger } from './utils/logger';
import { createRecommendation } from './awarenessStore';

export interface Alert {
  id: string;
  type: 'risk' | 'opportunity' | 'mismatch' | 'trajectory_shift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  data: Record<string, any>;
  suggestedActions: string[];
  targetSystems: string[];
  confidence: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface AlertFilter {
  minSeverity?: 'low' | 'medium' | 'high' | 'critical';
  types?: Alert['type'][];
  targetSystems?: string[];
  minConfidence?: number;
  includeExpired?: boolean;
}

/**
 * Generate alerts from risks
 */
export function generateRiskAlerts(risks: Risk[]): Alert[] {
  const alerts: Alert[] = [];

  for (const risk of risks) {
    // Map risk severity to alert severity
    const alertSeverity = mapRiskSeverityToAlertSeverity(risk.severity, risk.probability);

    alerts.push({
      id: `alert_${risk.id}`,
      type: 'risk',
      severity: alertSeverity,
      title: `Risk: ${risk.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      description: risk.description,
      data: risk.data,
      suggestedActions: risk.mitigationActions,
      targetSystems: [],
      confidence: risk.probability,
      createdAt: new Date(),
      expiresAt: calculateExpirationDate(alertSeverity),
    });
  }

  return alerts;
}

/**
 * Generate alerts from opportunities
 */
export function generateOpportunityAlerts(opportunities: Opportunity[]): Alert[] {
  const alerts: Alert[] = [];

  for (const opportunity of opportunities) {
    // Map opportunity impact to alert severity
    const alertSeverity = mapOpportunityImpactToSeverity(
      opportunity.potentialImpact,
      opportunity.confidence
    );

    // Calculate expiration based on opportunity window
    const expiresAt = opportunity.window?.opensAt
      ? calculateOpportunityExpiration(opportunity.window.opensAt, opportunity.window.duration)
      : calculateExpirationDate(alertSeverity);

    alerts.push({
      id: `alert_${opportunity.id}`,
      type: 'opportunity',
      severity: alertSeverity,
      title: `Opportunity: ${opportunity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      description: opportunity.description,
      data: {
        ...opportunity.data,
        window: opportunity.window,
        potentialImpact: opportunity.potentialImpact,
      },
      suggestedActions: opportunity.suggestedActions,
      targetSystems: [],
      confidence: opportunity.confidence,
      createdAt: new Date(),
      expiresAt,
    });
  }

  return alerts;
}

/**
 * Generate alerts from mismatches
 */
export function generateMismatchAlerts(mismatches: Mismatch[]): Alert[] {
  const alerts: Alert[] = [];

  for (const mismatch of mismatches) {
    const alertSeverity = mismatch.severity;

    alerts.push({
      id: `alert_${mismatch.id}`,
      type: 'mismatch',
      severity: alertSeverity,
      title: `Mismatch: ${mismatch.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      description: mismatch.description,
      data: mismatch.data,
      suggestedActions: mismatch.suggestedActions,
      targetSystems: mismatch.systems,
      confidence: 0.8, // Mismatches are usually high confidence
      createdAt: new Date(),
      expiresAt: calculateExpirationDate(alertSeverity),
    });
  }

  return alerts;
}

/**
 * Generate alerts from trajectory shifts
 */
export function generateTrajectoryAlerts(
  shortTerm: Trajectory,
  mediumTerm: Trajectory,
  previousShortTerm?: Trajectory
): Alert[] {
  const alerts: Alert[] = [];

  // Detect significant direction changes
  if (previousShortTerm) {
    const directionChanged = shortTerm.direction !== previousShortTerm.direction;
    if (directionChanged) {
      const severity = shortTerm.direction === 'declining' ? 'high' : 'medium';

      alerts.push({
        id: `alert_trajectory_shift_${Date.now()}`,
        type: 'trajectory_shift',
        severity,
        title: `Trajectory Shift: ${shortTerm.direction.replace(/\b\w/g, l => l.toUpperCase())}`,
        description: `Short-term trajectory changed from ${previousShortTerm.direction} to ${shortTerm.direction}`,
        data: {
          previousDirection: previousShortTerm.direction,
          currentDirection: shortTerm.direction,
          inflectionPoints: shortTerm.inflectionPoints,
        },
        suggestedActions: [
          'Review recent campaign performance',
          'Analyze creative output quality',
          'Check for external factors (scene shifts, seasonal changes)',
        ],
        targetSystems: [],
        confidence: shortTerm.confidence,
        createdAt: new Date(),
        expiresAt: calculateExpirationDate(severity),
      });
    }
  }

  // Detect inflection points
  if (shortTerm.inflectionPoints.length > 0) {
    for (const inflection of shortTerm.inflectionPoints) {
      const severity = inflection.type === 'peak' ? 'medium' : 'high';

      alerts.push({
        id: `alert_inflection_${Date.now()}_${inflection.metric}`,
        type: 'trajectory_shift',
        severity,
        title: `Inflection Point: ${inflection.metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        description: `${inflection.type.replace(/\b\w/g, l => l.toUpperCase())} detected in ${inflection.metric}`,
        data: {
          metric: inflection.metric,
          inflectionType: inflection.type,
          expectedAt: inflection.expectedAt,
        },
        suggestedActions: [
          inflection.type === 'peak'
            ? 'Prepare to capitalize on peak momentum'
            : 'Prepare mitigation strategies for declining trend',
          'Monitor related metrics closely',
          'Adjust campaign strategy accordingly',
        ],
        targetSystems: [],
        confidence: 0.7,
        createdAt: new Date(),
        expiresAt: inflection.expectedAt,
      });
    }
  }

  // Detect significant medium-term changes
  if (mediumTerm.direction === 'declining' && mediumTerm.confidence > 0.7) {
    alerts.push({
      id: `alert_medium_term_decline_${Date.now()}`,
      type: 'trajectory_shift',
      severity: 'high',
      title: 'Medium-Term Decline Predicted',
      description: `${mediumTerm.direction} trajectory predicted over next 30-45 days`,
      data: {
        direction: mediumTerm.direction,
        projectedMetrics: mediumTerm.projectedMetrics,
      },
      suggestedActions: [
        'Review long-term creative strategy',
        'Consider strategic pivots or new initiatives',
        'Engage with high-momentum scenes',
        'Refresh identity narrative if needed',
      ],
      targetSystems: [],
      confidence: mediumTerm.confidence,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  }

  return alerts;
}

/**
 * Filter alerts based on criteria
 */
export function filterAlerts(alerts: Alert[], filter: AlertFilter): Alert[] {
  let filtered = [...alerts];

  // Filter by minimum severity
  if (filter.minSeverity) {
    const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
    const minLevel = severityOrder[filter.minSeverity];
    filtered = filtered.filter(alert => severityOrder[alert.severity] >= minLevel);
  }

  // Filter by type
  if (filter.types && filter.types.length > 0) {
    filtered = filtered.filter(alert => filter.types!.includes(alert.type));
  }

  // Filter by target systems
  if (filter.targetSystems && filter.targetSystems.length > 0) {
    filtered = filtered.filter(alert =>
      alert.targetSystems.some(sys => filter.targetSystems!.includes(sys))
    );
  }

  // Filter by minimum confidence
  if (filter.minConfidence !== undefined) {
    filtered = filtered.filter(alert => alert.confidence >= filter.minConfidence!);
  }

  // Filter out expired alerts (unless explicitly included)
  if (!filter.includeExpired) {
    const now = new Date();
    filtered = filtered.filter(alert => !alert.expiresAt || alert.expiresAt > now);
  }

  return filtered;
}

/**
 * Prioritize alerts by urgency and impact
 */
export function prioritizeAlerts(alerts: Alert[]): Alert[] {
  return alerts.sort((a, b) => {
    // Sort by severity first (critical > high > medium > low)
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;

    // Then by confidence (higher confidence first)
    const confidenceDiff = b.confidence - a.confidence;
    if (confidenceDiff !== 0) return confidenceDiff;

    // Then by expiration (sooner expiration first)
    if (a.expiresAt && b.expiresAt) {
      return a.expiresAt.getTime() - b.expiresAt.getTime();
    }
    if (a.expiresAt) return -1;
    if (b.expiresAt) return 1;

    // Finally by creation time (newer first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

/**
 * Persist alerts as recommendations in the database
 */
export async function persistAlerts(
  alerts: Alert[],
  workspaceId: string | null,
  userId: string | null
): Promise<AwarenessRecommendation[]> {
  const recommendations: AwarenessRecommendation[] = [];

  for (const alert of alerts) {
    // Determine target system based on alert type and content
    const targetSystem = determineTargetSystem(alert);

    const recommendation = await createRecommendation({
      workspaceId,
      userId,
      targetSystem,
      recommendationType: alert.type,
      title: alert.title,
      description: alert.description,
      data: {
        ...alert.data,
        suggestedActions: alert.suggestedActions,
        expiresAt: alert.expiresAt?.toISOString(),
      },
      confidence: alert.confidence,
      priority: alert.severity,
      status: 'pending',
    });

    recommendations.push(recommendation);
  }

  logger.info(`Persisted ${recommendations.length} alerts as recommendations`);
  return recommendations;
}

/**
 * Helper: Map risk severity + probability to alert severity
 */
function mapRiskSeverityToAlertSeverity(
  riskSeverity: 'low' | 'medium' | 'high',
  probability: number
): Alert['severity'] {
  // High risk + high probability = critical
  if (riskSeverity === 'high' && probability > 0.7) {
    return 'critical';
  }

  // High risk = at least high severity
  if (riskSeverity === 'high') {
    return 'high';
  }

  // Medium risk + high probability = high
  if (riskSeverity === 'medium' && probability > 0.8) {
    return 'high';
  }

  // Medium risk = medium severity
  if (riskSeverity === 'medium') {
    return 'medium';
  }

  // Low risk
  return 'low';
}

/**
 * Helper: Map opportunity impact + confidence to alert severity
 */
function mapOpportunityImpactToSeverity(
  impact: 'low' | 'medium' | 'high',
  confidence: number
): Alert['severity'] {
  // High impact + high confidence = critical (don't miss it!)
  if (impact === 'high' && confidence > 0.8) {
    return 'critical';
  }

  // High impact = at least high severity
  if (impact === 'high') {
    return 'high';
  }

  // Medium impact + high confidence = high
  if (impact === 'medium' && confidence > 0.8) {
    return 'high';
  }

  // Medium impact = medium severity
  if (impact === 'medium') {
    return 'medium';
  }

  // Low impact
  return 'low';
}

/**
 * Helper: Calculate expiration date based on severity
 */
function calculateExpirationDate(severity: Alert['severity']): Date {
  const now = Date.now();

  switch (severity) {
    case 'critical':
      return new Date(now + 24 * 60 * 60 * 1000); // 1 day
    case 'high':
      return new Date(now + 3 * 24 * 60 * 60 * 1000); // 3 days
    case 'medium':
      return new Date(now + 7 * 24 * 60 * 60 * 1000); // 7 days
    case 'low':
      return new Date(now + 14 * 24 * 60 * 60 * 1000); // 14 days
  }
}

/**
 * Helper: Calculate opportunity expiration from window
 */
function calculateOpportunityExpiration(opensAt: Date, duration: string): Date {
  // Parse duration string (e.g., "2-4 weeks", "1-2 weeks", "3-6 weeks")
  const match = duration.match(/(\d+)-(\d+)\s+(days?|weeks?|months?)/);
  if (!match) {
    return calculateExpirationDate('medium'); // Fallback
  }

  const [, minStr, maxStr, unit] = match;
  const max = parseInt(maxStr, 10);

  let daysToAdd = 0;
  switch (unit) {
    case 'day':
    case 'days':
      daysToAdd = max;
      break;
    case 'week':
    case 'weeks':
      daysToAdd = max * 7;
      break;
    case 'month':
    case 'months':
      daysToAdd = max * 30;
      break;
  }

  return new Date(opensAt.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
}

/**
 * Helper: Determine target system for an alert
 */
function determineTargetSystem(alert: Alert): string {
  // If alert has explicit target systems, use the first one
  if (alert.targetSystems.length > 0) {
    return alert.targetSystems[0];
  }

  // Otherwise, route based on alert type
  switch (alert.type) {
    case 'risk':
      return 'dashboard'; // Show risks on dashboard
    case 'opportunity':
      return 'autopilot'; // Opportunities can be automated
    case 'mismatch':
      return 'identity_kernel'; // Mismatches need identity adjustment
    case 'trajectory_shift':
      return 'dashboard'; // Show trajectory shifts on dashboard
    default:
      return 'dashboard';
  }
}

/**
 * Generate summary statistics for a set of alerts
 */
export function generateAlertSummary(alerts: Alert[]): {
  total: number;
  bySeverity: Record<Alert['severity'], number>;
  byType: Record<Alert['type'], number>;
  urgent: Alert[];
  expiringSoon: Alert[];
} {
  const bySeverity: Record<Alert['severity'], number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  const byType: Record<Alert['type'], number> = {
    risk: 0,
    opportunity: 0,
    mismatch: 0,
    trajectory_shift: 0,
  };

  for (const alert of alerts) {
    bySeverity[alert.severity]++;
    byType[alert.type]++;
  }

  // Urgent = critical or high severity
  const urgent = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  // Expiring soon = expires within 48 hours
  const fortyEightHoursFromNow = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const expiringSoon = alerts.filter(
    a => a.expiresAt && a.expiresAt <= fortyEightHoursFromNow
  );

  return {
    total: alerts.length,
    bySeverity,
    byType,
    urgent,
    expiringSoon,
  };
}
