/**
 * @total-audio/lifecycle
 * User lifecycle tracking and email automation package
 */

// Stage definitions and transitions
export {
  LifecycleStage,
  LifecycleTransition,
  UserLifecycleStatus,
  STAGE_TRANSITION_RULES,
  STAGE_CRITERIA,
  determineLifecycleStage,
  shouldTransitionStage,
  getStageInfo,
} from './stages';

// Engagement scoring
export {
  EngagementMetrics,
  EngagementScore,
  ENGAGEMENT_THRESHOLDS,
  calculateEngagementScore,
  getEngagementLevel,
  getEngagementTrend,
  predictChurnRisk,
  generateEngagementInsights,
} from './scoring';

// Email triggers and automation
export {
  EmailTrigger,
  EmailCampaign,
  EMAIL_TRIGGERS,
  getTriggersForTransition,
  scheduleEmailCampaigns,
  ConvertKitClient,
  executeCampaign,
  processPendingCampaigns,
} from './triggers';
