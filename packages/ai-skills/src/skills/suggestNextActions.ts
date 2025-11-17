/**
 * Suggest Next Actions Skill
 *
 * Analyzes Fusion Context to suggest high-priority next actions
 * for the user based on their current state
 */

import type {
  SkillInput,
  SkillOutput,
  NextActionsParams,
  NextActionsOutput,
  Action,
} from '../types';

export async function suggestNextActions(
  input: SkillInput<NextActionsParams>
): Promise<SkillOutput<NextActionsOutput>> {
  const startTime = Date.now();

  try {
    const { context, params } = input;
    const limit = params.limit || 10;
    const actions: Action[] = [];

    // High-value reply follow-ups
    if (context.replyIntel.highValueLeads.length > 0) {
      context.replyIntel.highValueLeads.slice(0, 3).forEach((lead) => {
        actions.push({
          id: `followup-${lead.id}`,
          type: 'followup',
          title: 'Follow up on high-value lead',
          description: `Interest score: ${lead.interestScore.toFixed(
            2
          )}, urgency: ${lead.urgencyScore.toFixed(2)}`,
          priority: 'high',
          relatedEntity: {
            type: 'reply',
            id: lead.id,
            name: lead.contactId || 'Contact',
          },
        });
      });
    }

    // Replies needing follow-up
    if (context.replyIntel.needsFollowup.length > 0) {
      const urgentFollowups = context.replyIntel.needsFollowup.filter(
        (r) => r.urgencyScore > 0.7
      );
      urgentFollowups.slice(0, 2).forEach((reply) => {
        actions.push({
          id: `urgent-followup-${reply.id}`,
          type: 'urgent_followup',
          title: 'Urgent follow-up required',
          description: reply.suggestedResponse || 'Review and respond',
          priority: 'high',
          relatedEntity: {
            type: 'reply',
            id: reply.id,
            name: reply.contactId || 'Contact',
          },
        });
      });
    }

    // Scheduled email campaigns
    if (context.email.scheduledCampaigns > 0) {
      actions.push({
        id: 'review-scheduled',
        type: 'review',
        title: `Review ${context.email.scheduledCampaigns} scheduled campaigns`,
        description: 'Verify targeting and content before send',
        priority: 'medium',
      });
    }

    // Press kit quality issues
    if (context.pressKitIntel.latestReport) {
      const report = context.pressKitIntel.latestReport;
      if (report.qualityScore < 0.6) {
        actions.push({
          id: 'fix-presskit',
          type: 'improvement',
          title: 'Improve press kit quality',
          description: `Current score: ${(report.qualityScore * 100).toFixed(
            0
          )}%. ${report.issues.length} issues identified.`,
          priority: 'high',
          relatedEntity: {
            type: 'presskit',
            id: report.id,
            name: report.artistName || 'Press Kit',
          },
        });
      }
    }

    // Upcoming release deadlines
    if (context.releases.upcoming.length > 0) {
      const urgent = context.releases.upcoming.filter((r) => {
        const daysUntil =
          (r.releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysUntil < 30 && r.completionPercentage < 0.7;
      });

      urgent.forEach((release) => {
        actions.push({
          id: `release-${release.id}`,
          type: 'release_prep',
          title: `Finalize ${release.releaseName} release plan`,
          description: `${release.completionPercentage * 100}% complete, release in ${Math.floor((release.releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`,
          priority: 'high',
          dueDate: release.releaseDate,
          relatedEntity: {
            type: 'release',
            id: release.id,
            name: release.releaseName,
          },
        });
      });
    }

    // Industry calendar deadlines
    if (context.calendar.upcomingDeadlines.length > 0) {
      context.calendar.upcomingDeadlines.slice(0, 2).forEach((deadline) => {
        const daysUntil =
          (deadline.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        actions.push({
          id: `deadline-${deadline.id}`,
          type: 'deadline',
          title: deadline.name,
          description: `${deadline.category} deadline in ${Math.floor(daysUntil)} days`,
          priority: daysUntil < 7 ? 'high' : 'medium',
          dueDate: deadline.date,
          relatedEntity: {
            type: 'calendar_event',
            id: deadline.id,
            name: deadline.name,
          },
        });
      });
    }

    // Active campaigns with low performance
    const underperformingCampaigns = context.tracker.campaigns.filter(
      (c) => c.status === 'active' && c.responseRate < 5
    );

    underperformingCampaigns.slice(0, 2).forEach((campaign) => {
      actions.push({
        id: `optimize-${campaign.id}`,
        type: 'optimization',
        title: `Optimize ${campaign.artistName} campaign`,
        description: `Low response rate (${campaign.responseRate.toFixed(1)}%). Consider new angles.`,
        priority: 'medium',
        relatedEntity: {
          type: 'campaign',
          id: campaign.id,
          name: `${campaign.artistName} - ${campaign.releaseName}`,
        },
      });
    });

    // Contact intelligence opportunities
    if (context.contactIntel.topPerformingContacts.length > 0) {
      const topContact = context.contactIntel.topPerformingContacts[0];
      if (topContact.responsivenessScore > 0.8) {
        actions.push({
          id: 'leverage-top-contact',
          type: 'opportunity',
          title: 'Leverage high-performing contact',
          description: `Contact has ${(topContact.responsivenessScore * 100).toFixed(0)}% responsiveness score`,
          priority: 'medium',
        });
      }
    }

    // Audience builder suggestions
    if (context.audienceBuilder.suggestions.length > 0) {
      const topSuggestion = context.audienceBuilder.suggestions[0];
      if (topSuggestion.confidenceScore > 0.7 && !topSuggestion.isApplied) {
        actions.push({
          id: `audience-${topSuggestion.id}`,
          type: 'audience',
          title: 'Review AI-suggested contacts',
          description: topSuggestion.reasoning,
          priority: 'medium',
          relatedEntity: {
            type: 'suggestion',
            id: topSuggestion.id,
            name: 'Audience Suggestion',
          },
        });
      }
    }

    // Sort by priority and limit
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedActions = actions
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .slice(0, limit);

    const urgentCount = sortedActions.filter((a) => a.priority === 'high').length;

    return {
      success: true,
      data: {
        actions: sortedActions,
        urgentCount,
      },
      metadata: {
        skillName: 'suggestNextActions',
        executionTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        skillName: 'suggestNextActions',
        executionTime: Date.now() - startTime,
      },
    };
  }
}
