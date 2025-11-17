/**
 * Pitch Agent
 *
 * Purpose: Generate and adapt pitches using existing pitch generation system.
 * Orchestrates calls to the Pitch Generator and creates variations.
 */

import type { AgentContext, AutopilotTask, PitchOutput } from '../types';

export class PitchAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<PitchOutput> {
    context.logger.info('PitchAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'generate_pitch_set') {
      return await this.generatePitchSet(task, context);
    }

    throw new Error(`Unknown task type for Pitch: ${task.type}`);
  }

  private async generatePitchSet(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<PitchOutput> {
    const { clients, logger } = context;
    const input = task.input;

    logger.info('Generating pitch set', {
      artist: input.artist_name,
      style: input.style,
      targetOutlets: input.target_outlets,
    });

    // Generate base pitch
    const basePitch = await clients.pitch.generatePitch({
      artist_name: input.artist_name as string,
      release_title: input.release_title as string,
      genre: input.genre as string,
      style: (input.style as 'formal' | 'casual' | 'personal') || 'personal',
    });

    // Generate variations for different outlet types
    const variations = await Promise.all(
      (input.target_outlets as string[]).map(async (outlet) => {
        return await clients.pitch.generatePitch({
          artist_name: input.artist_name as string,
          release_title: input.release_title as string,
          genre: input.genre as string,
          target_outlet: outlet,
          style: (input.style as 'formal' | 'casual' | 'personal') || 'personal',
        });
      })
    );

    // Add base pitch to variations
    const allVariations = [basePitch, ...variations];

    // Score each variation
    const scoredVariations = await Promise.all(
      allVariations.map(async (pitch) => {
        const score = await clients.pitch.scorePitch(
          pitch.body,
          input.genre as string
        );
        return { pitch, score };
      })
    );

    // Find recommended variant (highest overall score)
    const recommended = scoredVariations.reduce((best, current) =>
      current.score.overall > best.score.overall ? current : best
    );

    // Create A/B test plan for top 2 variants
    const sortedByScore = scoredVariations.sort(
      (a, b) => b.score.overall - a.score.overall
    );

    const ab_test_plan =
      sortedByScore.length >= 2
        ? {
            variant_a: sortedByScore[0].pitch.id,
            variant_b: sortedByScore[1].pitch.id,
            split_percentage: 50,
          }
        : undefined;

    logger.info('Pitch set generated', {
      total_variations: allVariations.length,
      recommended_score: recommended.score.overall,
      ab_test: !!ab_test_plan,
    });

    return {
      variations: allVariations,
      recommended_variant: recommended.pitch.id,
      ab_test_plan,
      metadata: {
        style: input.style as string,
        tone: 'professional',
        word_count: recommended.pitch.body.split(' ').length,
      },
    };
  }
}
