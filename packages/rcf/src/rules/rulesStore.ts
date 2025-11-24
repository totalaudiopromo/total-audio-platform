/**
 * Rules Store
 */

import type { IngestionRule } from './rulesEngine';
import { getLogger } from '../utils/logger';

const logger = getLogger('[RulesStore]');

export async function getRules(workspaceId: string): Promise<IngestionRule[]> {
  logger.debug(`Getting rules for workspace ${workspaceId}`);
  // TODO: Implement Supabase query
  return [];
}

export async function saveRule(rule: IngestionRule): Promise<IngestionRule | null> {
  logger.debug('Saving rule', rule);
  // TODO: Implement Supabase insert
  return rule;
}

export async function deleteRule(ruleId: string): Promise<boolean> {
  logger.debug(`Deleting rule ${ruleId}`);
  // TODO: Implement Supabase delete
  return true;
}

export default { getRules, saveRule, deleteRule };
