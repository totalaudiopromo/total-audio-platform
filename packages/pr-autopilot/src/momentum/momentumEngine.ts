/**
 * Momentum Engine
 *
 * Tracks mission velocity and provides micro/mid/macro momentum indicators
 */

export type MomentumLevel = 'micro' | 'mid' | 'macro';

export interface MicroMomentum {
  level: 'micro';
  timeframe: '1-hour';
  tasksCompleted: number;
  avgCompletionTime: number; // milliseconds
  currentVelocity: number; // tasks per hour
  trend: 'accelerating' | 'steady' | 'decelerating';
  blockers: number;
}

export interface MidMomentum {
  level: 'mid';
  timeframe: '1-day';
  phasesCompleted: number;
  milestonesHit: number;
  avgPhaseVelocity: number; // phases per day
  engagementRate: number; // % of planned tasks completed
  trend: 'ahead' | 'on-track' | 'behind';
}

export interface MacroMomentum {
  level: 'macro';
  timeframe: 'campaign';
  campaignProgress: number; // 0-1
  estimatedCompletion: string; // ISO date
  roi: number; // Return on investment
  sustainabilityScore: number; // 0-1
  trend: 'sustainable' | 'burnout-risk' | 'underutilized';
}

export type Momentum = MicroMomentum | MidMomentum | MacroMomentum;

/**
 * Calculate micro momentum (last hour)
 */
export function calculateMicroMomentum(
  recentTasks: Array<{ completedAt: string; durationMs: number }>,
  currentBlockers: number
): MicroMomentum {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentTasksInHour = recentTasks.filter(
    (t) => new Date(t.completedAt).getTime() > oneHourAgo
  );

  const tasksCompleted = recentTasksInHour.length;
  const avgCompletionTime =
    tasksCompleted > 0
      ? recentTasksInHour.reduce((sum, t) => sum + t.durationMs, 0) / tasksCompleted
      : 0;

  const currentVelocity = tasksCompleted; // Tasks completed in last hour

  // Determine trend by comparing recent velocity to previous hour
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  const previousHourTasks = recentTasks.filter((t) => {
    const time = new Date(t.completedAt).getTime();
    return time > twoHoursAgo && time <= oneHourAgo;
  });
  const previousVelocity = previousHourTasks.length;

  let trend: MicroMomentum['trend'] = 'steady';
  if (currentVelocity > previousVelocity * 1.2) trend = 'accelerating';
  if (currentVelocity < previousVelocity * 0.8) trend = 'decelerating';

  return {
    level: 'micro',
    timeframe: '1-hour',
    tasksCompleted,
    avgCompletionTime,
    currentVelocity,
    trend,
    blockers: currentBlockers,
  };
}

/**
 * Calculate mid momentum (last day)
 */
export function calculateMidMomentum(
  completedPhases: number,
  plannedPhases: number,
  milestonesHit: number,
  tasksCompleted: number,
  tasksPlanned: number
): MidMomentum {
  const avgPhaseVelocity = completedPhases; // Phases per day (simplified)
  const engagementRate = tasksPlanned > 0 ? tasksCompleted / tasksPlanned : 0;

  let trend: MidMomentum['trend'] = 'on-track';
  const progressRate = plannedPhases > 0 ? completedPhases / plannedPhases : 0;

  if (progressRate > 1.1) trend = 'ahead';
  if (progressRate < 0.9 && engagementRate < 0.8) trend = 'behind';

  return {
    level: 'mid',
    timeframe: '1-day',
    phasesCompleted: completedPhases,
    milestonesHit,
    avgPhaseVelocity,
    engagementRate,
    trend,
  };
}

/**
 * Calculate macro momentum (entire campaign)
 */
export function calculateMacroMomentum(
  startDate: string,
  estimatedEndDate: string,
  completedTasks: number,
  totalTasks: number,
  investment: number,
  returns: number,
  burnoutIndicators: number
): MacroMomentum {
  const campaignProgress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  // Estimate completion based on current velocity
  const start = new Date(startDate).getTime();
  const now = Date.now();
  const elapsed = now - start;
  const estimatedTotal = campaignProgress > 0 ? elapsed / campaignProgress : elapsed * 2;
  const estimatedCompletion = new Date(start + estimatedTotal).toISOString();

  // ROI calculation
  const roi = investment > 0 ? returns / investment : 0;

  // Sustainability score (0-1, based on burnout indicators)
  const sustainabilityScore = Math.max(0, 1 - burnoutIndicators * 0.1);

  let trend: MacroMomentum['trend'] = 'sustainable';
  if (burnoutIndicators > 5) trend = 'burnout-risk';
  if (campaignProgress < 0.3 && elapsed > 7 * 24 * 60 * 60 * 1000) trend = 'underutilized';

  return {
    level: 'macro',
    timeframe: 'campaign',
    campaignProgress,
    estimatedCompletion,
    roi,
    sustainabilityScore,
    trend,
  };
}

/**
 * Get all momentum levels for a mission
 */
export function calculateAllMomentum(
  missionData: {
    startDate: string;
    estimatedEndDate: string;
    recentTasks: Array<{ completedAt: string; durationMs: number }>;
    currentBlockers: number;
    completedPhases: number;
    plannedPhases: number;
    milestonesHit: number;
    tasksCompleted: number;
    tasksPlanned: number;
    investment: number;
    returns: number;
    burnoutIndicators: number;
  }
): {
  micro: MicroMomentum;
  mid: MidMomentum;
  macro: MacroMomentum;
} {
  return {
    micro: calculateMicroMomentum(missionData.recentTasks, missionData.currentBlockers),
    mid: calculateMidMomentum(
      missionData.completedPhases,
      missionData.plannedPhases,
      missionData.milestonesHit,
      missionData.tasksCompleted,
      missionData.tasksPlanned
    ),
    macro: calculateMacroMomentum(
      missionData.startDate,
      missionData.estimatedEndDate,
      missionData.tasksCompleted,
      missionData.tasksPlanned,
      missionData.investment,
      missionData.returns,
      missionData.burnoutIndicators
    ),
  };
}

/**
 * Get momentum alerts
 */
export function getMomentumAlerts(momentum: {
  micro: MicroMomentum;
  mid: MidMomentum;
  macro: MacroMomentum;
}): string[] {
  const alerts: string[] = [];

  // Micro alerts
  if (momentum.micro.trend === 'decelerating') {
    alerts.push('Micro: Task velocity is decelerating');
  }
  if (momentum.micro.blockers > 3) {
    alerts.push(`Micro: ${momentum.micro.blockers} active blockers detected`);
  }

  // Mid alerts
  if (momentum.mid.trend === 'behind') {
    alerts.push('Mid: Campaign falling behind schedule');
  }
  if (momentum.mid.engagementRate < 0.5) {
    alerts.push(
      `Mid: Low engagement rate (${(momentum.mid.engagementRate * 100).toFixed(0)}%)`
    );
  }

  // Macro alerts
  if (momentum.macro.trend === 'burnout-risk') {
    alerts.push('Macro: Burnout risk detected - recommend pacing adjustment');
  }
  if (momentum.macro.roi < 0.5) {
    alerts.push(`Macro: ROI below target (${momentum.macro.roi.toFixed(2)})`);
  }
  if (momentum.macro.sustainabilityScore < 0.4) {
    alerts.push('Macro: Campaign sustainability at risk');
  }

  return alerts;
}
