/**
 * Digest Store
 */

import type { RCFDigest } from './digestEngine';
import { getLogger } from '../utils/logger';

const logger = getLogger('[DigestStore]');

export async function saveDigest(digest: RCFDigest): Promise<void> {
  logger.debug('Saving digest');
  // TODO: Implement Supabase insert
}

export async function getDigests(workspaceId: string, period?: 'daily' | 'weekly'): Promise<RCFDigest[]> {
  logger.debug('Getting digests', { workspaceId, period });
  // TODO: Implement Supabase query
  return [];
}

export default { saveDigest, getDigests };
