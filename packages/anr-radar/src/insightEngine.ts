/**
 * Insight Engine
 *
 * Generates A&R insights for users based on candidates, scenes, and opportunities.
 */

import type { ANRInsight, InsightContent, ANRInsightType } from './types.js';
import { listCandidates, getLatestScore, saveInsight, cleanupOldInsights } from './anrStore.js';
import { computeMomentum } from './momentumEngine.js';
import { getSceneBySlug } from './contextAdapters/scenesAdapter.js';
import { logger } from './utils/logger.js';

/**
 * Generate all insights for a user
 */
export async function generateAnrInsightsForUser(
  userId: string
): Promise<ANRInsight[]> {
  try {
    logger.info('Generating A&R insights', { userId });

    const insights: ANRInsight[] = [];

    // Generate different types of insights
    const [artistsToWatch, sceneOpportunities, rosterGaps, campaignPotentials] =
      await Promise.all([
        generateArtistsToWatchInsights(userId),
        generateSceneOpportunityInsights(userId),
        generateRosterGapInsights(userId),
        generateCampaignPotentialInsights(userId),
      ]);

    insights.push(...artistsToWatch);
    insights.push(...sceneOpportunities);
    insights.push(...rosterGaps);
    insights.push(...campaignPotentials);

    // Cleanup old insights
    await cleanupOldInsights(userId, 50);

    logger.info('Insights generated', { userId, count: insights.length });

    return insights;
  } catch (error) {
    logger.error('Failed to generate insights', error, { userId });
    return [];
  }
}

/**
 * Generate "Artists to Watch" insights
 */
async function generateArtistsToWatchInsights(userId: string): Promise<ANRInsight[]> {
  const insights: ANRInsight[] = [];

  try {
    // Find candidates with high breakout probability + strong momentum
    const candidatesResponse = await listCandidates({ limit: 100 });
    const candidates = candidatesResponse.data;

    const topArtists = await Promise.all(
      candidates.map(async candidate => {
        const score = await getLatestScore(candidate.id);
        const momentum = await computeMomentum(candidate.id);

        if (!score || !momentum) return null;

        // High breakout + strongly up momentum
        if (
          score.breakout_score >= 0.7 &&
          (momentum.direction === 'strongly_up' || momentum.direction === 'moderately_up')
        ) {
          return {
            candidate,
            breakout_score: score.breakout_score,
            momentum: momentum.direction,
          };
        }

        return null;
      })
    );

    const validArtists = topArtists
      .filter(a => a !== null)
      .sort((a, b) => b!.breakout_score - a!.breakout_score)
      .slice(0, 5);

    if (validArtists.length > 0) {
      const content: InsightContent = {
        title: 'Artists to Watch This Month',
        description: `${validArtists.length} artists showing high breakout potential with strong momentum`,
        priority: 'high',
        artists: validArtists.map(a => a!.candidate.artist_slug),
        recommendations: [
          'Consider early outreach before competition increases',
          'Monitor their scene positioning and coverage growth',
          'Evaluate fit with your roster and expertise',
        ],
      };

      const insight = await saveInsight(userId, {
        insight_type: 'artist_to_watch',
        content,
      });

      if (insight) {
        insights.push(insight);
      }
    }
  } catch (error) {
    logger.error('Failed to generate artists to watch insights', error, { userId });
  }

  return insights;
}

/**
 * Generate scene opportunity insights
 */
async function generateSceneOpportunityInsights(userId: string): Promise<ANRInsight[]> {
  const insights: ANRInsight[] = [];

  try {
    // Find scenes with multiple high-scoring candidates
    const candidatesResponse = await listCandidates({ limit: 100 });
    const candidates = candidatesResponse.data;

    // Group by scene
    const sceneGroups = new Map<string, any[]>();

    for (const candidate of candidates) {
      const scene = candidate.primary_scene_slug;
      if (!scene) continue;

      if (!sceneGroups.has(scene)) {
        sceneGroups.set(scene, []);
      }

      const score = await getLatestScore(candidate.id);
      if (score && score.composite_score >= 0.6) {
        sceneGroups.get(scene)!.push({
          candidate,
          score: score.composite_score,
        });
      }
    }

    // Find scenes with 3+ strong candidates
    const opportunityScenes = Array.from(sceneGroups.entries())
      .filter(([_, artists]) => artists.length >= 3)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);

    for (const [sceneSlug, artists] of opportunityScenes) {
      const sceneResponse = await getSceneBySlug(sceneSlug);
      const sceneName = sceneResponse.data?.name || sceneSlug;

      const content: InsightContent = {
        title: `Scene Opportunity: ${sceneName}`,
        description: `${artists.length} strong candidates in ${sceneName} scene`,
        priority: 'medium',
        scenes: [sceneSlug],
        artists: artists.map((a: any) => a.candidate.artist_slug),
        recommendations: [
          `Build expertise in ${sceneName} scene`,
          'Consider signing multiple artists to dominate scene',
          'Leverage scene network effects for cross-promotion',
        ],
      };

      const insight = await saveInsight(userId, {
        insight_type: 'scene_opportunity',
        content,
      });

      if (insight) {
        insights.push(insight);
      }
    }
  } catch (error) {
    logger.error('Failed to generate scene opportunity insights', error, { userId });
  }

  return insights;
}

/**
 * Generate roster gap insights
 */
async function generateRosterGapInsights(userId: string): Promise<ANRInsight[]> {
  const insights: ANRInsight[] = [];

  try {
    // TODO: Analyze user's actual roster from workspace data
    // For now, identify high-opportunity scenes with few candidates

    const candidatesResponse = await listCandidates({ limit: 100 });
    const candidates = candidatesResponse.data;

    // Find scenes with high average scores but low candidate count
    const sceneStats = new Map<string, { count: number; avgScore: number }>();

    for (const candidate of candidates) {
      const scene = candidate.primary_scene_slug;
      if (!scene) continue;

      const score = await getLatestScore(candidate.id);
      if (!score) continue;

      if (!sceneStats.has(scene)) {
        sceneStats.set(scene, { count: 0, avgScore: 0 });
      }

      const stats = sceneStats.get(scene)!;
      stats.count++;
      stats.avgScore =
        (stats.avgScore * (stats.count - 1) + score.composite_score) / stats.count;
    }

    // Find underrepresented high-opportunity scenes
    const gaps = Array.from(sceneStats.entries())
      .filter(([_, stats]) => stats.count <= 2 && stats.avgScore >= 0.6)
      .sort((a, b) => b[1].avgScore - a[1].avgScore)
      .slice(0, 2);

    for (const [sceneSlug, stats] of gaps) {
      const sceneResponse = await getSceneBySlug(sceneSlug);
      const sceneName = sceneResponse.data?.name || sceneSlug;

      const content: InsightContent = {
        title: `Roster Gap: ${sceneName}`,
        description: `Underrepresented scene with high potential (avg score: ${(stats.avgScore * 100).toFixed(0)}%)`,
        priority: 'medium',
        scenes: [sceneSlug],
        recommendations: [
          `Explore ${sceneName} scene for opportunities`,
          'Your roster has limited coverage in this high-potential scene',
          'Consider diversifying into this scene',
        ],
      };

      const insight = await saveInsight(userId, {
        insight_type: 'roster_gap',
        content,
      });

      if (insight) {
        insights.push(insight);
      }
    }
  } catch (error) {
    logger.error('Failed to generate roster gap insights', error, { userId });
  }

  return insights;
}

/**
 * Generate campaign potential insights
 */
async function generateCampaignPotentialInsights(userId: string): Promise<ANRInsight[]> {
  const insights: ANRInsight[] = [];

  try {
    // Find candidates with high campaign efficiency scores
    const candidatesResponse = await listCandidates({ limit: 100 });
    const candidates = candidatesResponse.data;

    const highPotential = await Promise.all(
      candidates.map(async candidate => {
        const score = await getLatestScore(candidate.id);

        if (!score) return null;

        // High campaign efficiency + good scene alignment
        if (
          score.campaign_efficiency_score >= 0.7 &&
          score.scene_alignment_score >= 0.6
        ) {
          return {
            candidate,
            efficiency: score.campaign_efficiency_score,
            alignment: score.scene_alignment_score,
          };
        }

        return null;
      })
    );

    const validCandidates = highPotential
      .filter(c => c !== null)
      .sort((a, b) => b!.efficiency - a!.efficiency)
      .slice(0, 5);

    if (validCandidates.length > 0) {
      const content: InsightContent = {
        title: 'High Campaign Potential',
        description: `${validCandidates.length} artists with proven campaign efficiency`,
        priority: 'high',
        artists: validCandidates.map(c => c!.candidate.artist_slug),
        recommendations: [
          'These artists have demonstrated strong campaign ROI',
          'Consider prioritizing for upcoming campaigns',
          'Likely to convert outreach into meaningful results',
        ],
      };

      const insight = await saveInsight(userId, {
        insight_type: 'campaign_potential',
        content,
      });

      if (insight) {
        insights.push(insight);
      }
    }
  } catch (error) {
    logger.error('Failed to generate campaign potential insights', error, { userId });
  }

  return insights;
}
