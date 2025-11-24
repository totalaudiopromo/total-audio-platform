/**
 * Contact Agent
 *
 * Purpose: Select contacts based on strategy and contact intelligence.
 * Uses Intel and List Builder to create optimized contact pools.
 */

import type { AgentContext, AutopilotTask, ContactSelectionOutput, Contact } from '../types';

export class ContactAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<ContactSelectionOutput> {
    context.logger.info('ContactAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'build_contact_pool') {
      return await this.buildContactPool(task, context);
    }

    throw new Error(`Unknown task type for Contact: ${task.type}`);
  }

  private async buildContactPool(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<ContactSelectionOutput> {
    const { clients, logger, mission } = context;
    const input = task.input;
    const targeting = input.targeting as any;

    logger.info('Building contact pool', {
      max_contacts: input.max_contacts,
      pools: Object.keys(targeting),
    });

    // Create segments for each pool
    const segment_ids: string[] = [];

    // Primary pool
    const primarySegment = await clients.listBuilder.createSegment({
      name: `${mission.title} - Primary Pool`,
      criteria: targeting.primary_pool.criteria,
      workspace_id: mission.workspace_id || undefined,
    });
    segment_ids.push(primarySegment.id);

    // Secondary pool (if exists)
    let secondarySegment = null;
    if (targeting.secondary_pool) {
      secondarySegment = await clients.listBuilder.createSegment({
        name: `${mission.title} - Secondary Pool`,
        criteria: targeting.secondary_pool.criteria,
        workspace_id: mission.workspace_id || undefined,
      });
      segment_ids.push(secondarySegment.id);
    }

    // Experimental pool (if exists)
    let experimentalSegment = null;
    if (targeting.experimental_pool) {
      experimentalSegment = await clients.listBuilder.createSegment({
        name: `${mission.title} - Experimental Pool`,
        criteria: targeting.experimental_pool.criteria,
        workspace_id: mission.workspace_id || undefined,
      });
      segment_ids.push(experimentalSegment.id);
    }

    // Evaluate segments to get contacts
    const primary_contacts = await clients.listBuilder.evaluateSegment(
      primarySegment.id
    );

    const secondary_contacts = secondarySegment
      ? await clients.listBuilder.evaluateSegment(secondarySegment.id)
      : [];

    const experimental_contacts = experimentalSegment
      ? await clients.listBuilder.evaluateSegment(experimentalSegment.id)
      : [];

    // Enrich contact intelligence for primary contacts (sample)
    const enrichedPrimaryCount = Math.min(primary_contacts.length, 10);
    for (let i = 0; i < enrichedPrimaryCount; i++) {
      const contact = primary_contacts[i];
      try {
        const intelligence = await clients.intel.getContactIntelligence(
          contact.id
        );
        logger.debug('Contact enriched', {
          contactId: contact.id,
          responsiveness: intelligence.responsiveness_score,
        });
      } catch (error) {
        logger.warn('Failed to enrich contact', {
          contactId: contact.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Calculate estimated reach
    const estimated_reach =
      primary_contacts.length +
      secondary_contacts.length +
      experimental_contacts.length;

    // Build rationale
    const rationale: Record<string, string> = {
      primary: `${primary_contacts.length} contacts matching tier 1-2 criteria for primary genres`,
      secondary: `${secondary_contacts.length} contacts for territory expansion and secondary channels`,
      experimental: `${experimental_contacts.length} contacts in adjacent genres for discovery`,
    };

    logger.info('Contact pool built', {
      primary: primary_contacts.length,
      secondary: secondary_contacts.length,
      experimental: experimental_contacts.length,
      total: estimated_reach,
    });

    return {
      primary_contacts: primary_contacts as Contact[],
      secondary_contacts: secondary_contacts as Contact[],
      experimental_contacts: experimental_contacts as Contact[],
      segment_ids,
      rationale,
      estimated_reach,
    };
  }
}
