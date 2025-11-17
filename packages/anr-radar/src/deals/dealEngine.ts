/**
 * Deal Engine
 *
 * Deal flow logic: stage transitions, probability computation, event tracking.
 */

import {
  createDeal,
  updateDeal,
  logDealEvent,
  getDealEvents,
  getDealById,
  type Deal,
  type DealStage,
  type DealInput,
  type DealEventType,
} from './dealStore.js';
import { getCandidateBySlug, getLatestScore } from '../anrStore.js';
import { assessCandidateRosterFit } from '../roster/rosterEngine.js';
import { logger } from '../utils/logger.js';
import { round, clamp } from '../utils/math.js';
import { daysBetween, today } from '../utils/dates.js';

/**
 * Create new deal
 */
export async function createNewDeal(
  workspaceId: string,
  artistSlug: string,
  options?: {
    rosterId?: string;
    ownerUserId?: string;
    initialStage?: DealStage;
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
  }
): Promise<Deal | null> {
  try {
    logger.info('Creating new deal', { workspaceId, artistSlug });

    const input: DealInput = {
      workspace_id: workspaceId,
      artist_slug: artistSlug,
      roster_id: options?.rosterId,
      owner_user_id: options?.ownerUserId,
      stage: options?.initialStage || 'light_interest',
      priority: options?.priority || 'medium',
      notes: options?.notes,
    };

    // Compute initial probability
    const probability = await computeDealProbability({
      ...input,
      id: 'temp',
      last_update: today(),
      created_at: today(),
    } as Deal);

    input.probability = probability;

    const deal = await createDeal(input);

    if (deal) {
      // Log creation event
      await logDealEvent({
        deal_id: deal.id,
        event_type: 'note',
        payload: {
          note: `Deal created at stage: ${deal.stage}`,
          initial_probability: probability,
        },
      });
    }

    return deal;
  } catch (error) {
    logger.error('Failed to create deal', error, { workspaceId, artistSlug });
    return null;
  }
}

/**
 * Update deal stage
 */
export async function updateDealStage(
  dealId: string,
  newStage: DealStage
): Promise<Deal | null> {
  try {
    logger.info('Updating deal stage', { dealId, newStage });

    const deal = await getDealById(dealId);
    if (!deal) {
      logger.warn('Deal not found', { dealId });
      return null;
    }

    const previousStage = deal.stage;

    // Update deal
    const updatedDeal = await updateDeal(dealId, { stage: newStage });

    if (updatedDeal) {
      // Recalculate probability
      const newProbability = await computeDealProbability(updatedDeal);
      await updateDeal(dealId, { probability: newProbability });

      // Log stage change event
      await logDealEvent({
        deal_id: dealId,
        event_type: 'stage_change',
        payload: {
          previous_stage: previousStage,
          new_stage: newStage,
          new_probability: newProbability,
        },
      });
    }

    return updatedDeal;
  } catch (error) {
    logger.error('Failed to update deal stage', error, { dealId, newStage });
    return null;
  }
}

/**
 * Log deal event
 */
export async function logDealActivity(
  dealId: string,
  eventType: DealEventType,
  payload: Record<string, any>
): Promise<boolean> {
  try {
    const event = await logDealEvent({
      deal_id: dealId,
      event_type: eventType,
      payload,
    });

    // Update last_update timestamp
    if (event) {
      await updateDeal(dealId, {});
    }

    return !!event;
  } catch (error) {
    logger.error('Failed to log deal activity', error, { dealId, eventType });
    return false;
  }
}

/**
 * Compute deal probability
 *
 * Heuristic based on:
 * - Current stage
 * - Number of positive events
 * - Time since last activity (staleness penalty)
 * - A&R score/momentum
 * - Roster fit (if applicable)
 */
export async function computeDealProbability(deal: Deal): Promise<number> {
  try {
    // Base probability by stage
    const stageProbabilities: Record<DealStage, number> = {
      none: 0.05,
      light_interest: 0.15,
      serious: 0.35,
      offer_made: 0.65,
      negotiation: 0.80,
      signed: 1.0,
      lost: 0.0,
    };

    let probability = stageProbabilities[deal.stage];

    // Get candidate score
    const candidate = await getCandidateBySlug(deal.artist_slug);
    if (candidate) {
      const score = await getLatestScore(candidate.id);

      if (score) {
        // Boost by composite score
        const scoreBoost = (score.composite_score - 0.5) * 0.1;
        probability += scoreBoost;

        // Boost by momentum
        if (score.momentum_score > 0.7) {
          probability += 0.05;
        }
      }
    }

    // Roster fit boost
    if (deal.roster_id) {
      const fit = await assessCandidateRosterFit(deal.roster_id, deal.artist_slug);
      if (fit) {
        const fitBoost = (fit.composite_fit - 0.5) * 0.08;
        probability += fitBoost;
      }
    }

    // Event activity boost
    const events = await getDealEvents(deal.id);
    const positiveEvents = events.filter((e) =>
      ['meeting', 'showcase', 'offer', 'internal_discussion'].includes(e.event_type)
    );

    if (positiveEvents.length > 0) {
      const eventBoost = Math.min(positiveEvents.length * 0.02, 0.1);
      probability += eventBoost;
    }

    // Staleness penalty
    const daysSinceUpdate = daysBetween(deal.last_update, today());
    if (daysSinceUpdate > 30) {
      const stalenessPenalty = Math.min((daysSinceUpdate - 30) / 100, 0.15);
      probability -= stalenessPenalty;
    }

    return round(clamp(probability, 0, 1), 3);
  } catch (error) {
    logger.error('Failed to compute deal probability', error, { deal_id: deal.id });
    return stageProbabilities[deal.stage];
  }
}
