/**
 * Detect Patterns Skill
 *
 * Analyzes Fusion Context to detect patterns in campaign performance,
 * contact behavior, and overall music marketing effectiveness
 */

import type { SkillInput, SkillOutput, PatternDetectionOutput, Pattern } from '../types';

export async function detectPatterns(
  input: SkillInput<Record<string, never>>
): Promise<SkillOutput<PatternDetectionOutput>> {
  const startTime = Date.now();

  try {
    const { context } = input;
    const patterns: Pattern[] = [];
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Pattern 1: Genre performance
    if (context.intel.topGenres.length > 0 && context.tracker.totalCampaigns > 5) {
      const topGenre = context.intel.topGenres[0];
      patterns.push({
        type: 'genre_focus',
        description: `${topGenre} is your primary genre focus`,
        confidence: 0.8,
        impact: 'positive',
        dataPoints: context.intel.totalContacts,
        examples: [`${context.intel.topGenres.slice(0, 3).join(', ')} genres most represented`],
      });

      insights.push(
        `You have strong genre specialization in ${topGenre} with deep contact network`
      );
    }

    // Pattern 2: Contact responsiveness
    if (context.contactIntel.avgResponsivenessScore > 0.6) {
      patterns.push({
        type: 'high_responsiveness',
        description: 'Contacts show above-average responsiveness',
        confidence: 0.85,
        impact: 'positive',
        dataPoints: context.contactIntel.totalContacts,
        examples: [
          `Average responsiveness: ${(context.contactIntel.avgResponsivenessScore * 100).toFixed(0)}%`,
        ],
      });

      insights.push('Your contact targeting strategy is effective');
      recommendations.push('Continue focusing on similar contact profiles');
    } else if (context.contactIntel.avgResponsivenessScore < 0.3) {
      patterns.push({
        type: 'low_responsiveness',
        description: 'Contacts show below-average responsiveness',
        confidence: 0.75,
        impact: 'negative',
        dataPoints: context.contactIntel.totalContacts,
        examples: [
          `Average responsiveness: ${(context.contactIntel.avgResponsivenessScore * 100).toFixed(0)}%`,
        ],
      });

      insights.push('Current contact targeting may need refinement');
      recommendations.push('Use Contact Intelligence to identify better-performing contacts');
    }

    // Pattern 3: Campaign timing
    const recentActivities = context.campaigns.recentEvents.slice(0, 20);
    if (recentActivities.length > 10) {
      const hourCounts = new Map<number, number>();
      recentActivities.forEach(activity => {
        const hour = activity.timestamp.getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });

      const bestHour = Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1])[0];
      if (bestHour) {
        patterns.push({
          type: 'timing_pattern',
          description: `Peak engagement around ${bestHour[0]}:00`,
          confidence: 0.7,
          impact: 'neutral',
          dataPoints: recentActivities.length,
          examples: [`${bestHour[1]} events occurred during ${bestHour[0]}:00 hour`],
        });

        insights.push(`Contacts are most active around ${bestHour[0]}:00`);
        recommendations.push(
          `Schedule important sends for ${bestHour[0]}:00 - ${bestHour[0] + 2}:00`
        );
      }
    }

    // Pattern 4: Email performance
    if (context.email.totalCampaigns > 3) {
      const { avgOpenRate, avgClickRate, avgReplyRate } = context.email.performanceMetrics;

      if (avgOpenRate > 30) {
        patterns.push({
          type: 'strong_email_performance',
          description: 'Email campaigns show strong open rates',
          confidence: 0.8,
          impact: 'positive',
          dataPoints: context.email.totalCampaigns,
          examples: [`${avgOpenRate.toFixed(1)}% average open rate (industry avg: 25%)`],
        });

        insights.push('Your email subject lines and sender reputation are effective');
      }

      if (avgReplyRate > 10) {
        patterns.push({
          type: 'high_reply_rate',
          description: 'Campaigns generate above-average replies',
          confidence: 0.85,
          impact: 'positive',
          dataPoints: context.email.totalCampaigns,
          examples: [`${avgReplyRate.toFixed(1)}% reply rate (industry avg: 5-8%)`],
        });

        insights.push('Your pitch content resonates with recipients');
        recommendations.push('Document successful pitch angles for reuse');
      } else if (avgReplyRate < 3) {
        patterns.push({
          type: 'low_reply_rate',
          description: 'Campaigns struggle to generate replies',
          confidence: 0.75,
          impact: 'negative',
          dataPoints: context.email.totalCampaigns,
          examples: [`${avgReplyRate.toFixed(1)}% reply rate (below industry avg)`],
        });

        insights.push('Pitch content may need refinement');
        recommendations.push("Use Writer's Room to generate new angles");
        recommendations.push('Review Success Profiles for best practices');
      }
    }

    // Pattern 5: Press kit quality
    if (context.pressKitIntel.reports.length > 0) {
      const avgScore = context.pressKitIntel.avgQualityScore;

      if (avgScore > 0.8) {
        patterns.push({
          type: 'high_quality_assets',
          description: 'Press kits consistently meet professional standards',
          confidence: 0.9,
          impact: 'positive',
          dataPoints: context.pressKitIntel.reports.length,
          examples: [`${(avgScore * 100).toFixed(0)}% average quality score`],
        });

        insights.push('Your press kit quality gives you a competitive advantage');
      } else if (avgScore < 0.5) {
        patterns.push({
          type: 'asset_quality_issues',
          description: 'Press kits frequently have quality issues',
          confidence: 0.85,
          impact: 'negative',
          dataPoints: context.pressKitIntel.reports.length,
          examples: [`${(avgScore * 100).toFixed(0)}% average quality score`],
        });

        insights.push('Press kit quality is limiting campaign effectiveness');
        recommendations.push('Prioritize improving press kit assets');
        recommendations.push('Review Press Kit Intelligence suggestions');
      }
    }

    // Pattern 6: Release planning
    if (context.releases.plans.length > 0) {
      const onTimeReleases = context.releases.completed.filter(r => r.completionPercentage >= 0.9);
      const totalCompleted = context.releases.completed.length;

      if (totalCompleted > 0) {
        const successRate = (onTimeReleases.length / totalCompleted) * 100;

        if (successRate > 70) {
          patterns.push({
            type: 'strong_planning',
            description: 'Release plans consistently executed well',
            confidence: 0.8,
            impact: 'positive',
            dataPoints: totalCompleted,
            examples: [`${successRate.toFixed(0)}% of releases completed successfully`],
          });

          insights.push('Your release planning process is effective');
        } else if (successRate < 40) {
          patterns.push({
            type: 'planning_challenges',
            description: 'Release plans often fall behind',
            confidence: 0.75,
            impact: 'negative',
            dataPoints: totalCompleted,
            examples: [`Only ${successRate.toFixed(0)}% of releases completed successfully`],
          });

          insights.push('Release planning needs improvement');
          recommendations.push('Build more realistic timelines with buffer time');
          recommendations.push('Use Industry Calendar to align with key dates');
        }
      }
    }

    // Pattern 7: Community engagement
    if (context.community.profile) {
      const engagementScore = context.community.engagementScore;

      if (engagementScore > 5) {
        patterns.push({
          type: 'strong_community',
          description: 'High community engagement',
          confidence: 0.7,
          impact: 'positive',
          dataPoints: context.community.posts.length,
          examples: [
            `${engagementScore.toFixed(1)}% engagement rate`,
            `${context.community.followerCount} followers`,
          ],
        });

        insights.push('Your community presence builds credibility and network');
      }
    }

    return {
      success: true,
      data: {
        patterns,
        insights,
        recommendations,
      },
      metadata: {
        skillName: 'detectPatterns',
        executionTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        skillName: 'detectPatterns',
        executionTime: Date.now() - startTime,
      },
    };
  }
}
