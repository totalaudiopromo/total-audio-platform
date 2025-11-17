/**
 * Rules Engine
 * Evaluates ingestion rules for filtering and weighting
 */

import type { RCFNormalizedEvent } from '../types';
import { getLogger } from '../utils/logger';

const logger = getLogger('[RulesEngine]');

export interface IngestionRule {
  id?: string;
  workspace_id: string;
  rule_type: 'block_source' | 'prioritise_source' | 'downweight_type' | 'upweight_type' | 'block_type';
  value: string;
  weight_modifier?: number;
  enabled: boolean;
  priority: number;
}

export async function applyRules(
  events: RCFNormalizedEvent[],
  rules: IngestionRule[]
): Promise<RCFNormalizedEvent[]> {
  logger.debug(`Applying ${rules.length} rules to ${events.length} events...`);

  const enabledRules = rules.filter((r) => r.enabled).sort((a, b) => b.priority - a.priority);

  let filteredEvents = [...events];

  for (const rule of enabledRules) {
    filteredEvents = applyRule(filteredEvents, rule);
  }

  logger.info(`Filtered from ${events.length} to ${filteredEvents.length} events`);

  return filteredEvents;
}

function applyRule(events: RCFNormalizedEvent[], rule: IngestionRule): RCFNormalizedEvent[] {
  switch (rule.rule_type) {
    case 'block_source':
      return events.filter((e) => e.entity_slug !== rule.value);
    case 'block_type':
      return events.filter((e) => e.event_type !== rule.value);
    case 'downweight_type':
    case 'upweight_type':
    case 'prioritise_source':
      return events.map((e) => {
        if (
          (rule.rule_type === 'downweight_type' && e.event_type === rule.value) ||
          (rule.rule_type === 'upweight_type' && e.event_type === rule.value) ||
          (rule.rule_type === 'prioritise_source' && e.entity_slug === rule.value)
        ) {
          return { ...e, weight: e.weight * (rule.weight_modifier || 1.0) };
        }
        return e;
      });
    default:
      return events;
  }
}

export default { applyRules };
