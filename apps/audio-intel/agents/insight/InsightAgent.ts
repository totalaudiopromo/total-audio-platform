/**
 * InsightAgent - Campaign Performance Insights
 * Analyses campaign data and provides actionable recommendations
 */

import { BaseAgent } from '../core/BaseAgent'
import type { AgentPayload, AgentResult } from '../core/AgentTypes'

export interface InsightAgentPayload extends AgentPayload {
  campaignId: string
  includeComparison?: boolean // Compare to previous campaigns
  includeRecommendations?: boolean
}

export interface CampaignInsight {
  type: 'performance' | 'engagement' | 'conversion' | 'trend'
  title: string
  description: string
  metric?: {
    name: string
    value: number
    change?: number
    trend?: 'up' | 'down' | 'stable'
  }
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  recommendation?: string
}

export class InsightAgent extends BaseAgent {
  constructor() {
    super('InsightAgent', '1.0.0')
  }

  async run(payload: InsightAgentPayload): Promise<AgentResult> {
    this.log('Generating campaign insights', { campaign: payload.campaignId })

    try {
      // Fetch campaign data
      const campaignData = await this.fetchCampaignData(payload.campaignId)

      // Generate insights
      const insights = this.generateInsights(campaignData)

      // Add comparisons if requested
      let comparison
      if (payload.includeComparison) {
        comparison = await this.generateComparison(payload.campaignId)
      }

      // Generate recommendations
      let recommendations
      if (payload.includeRecommendations !== false) {
        recommendations = this.generateRecommendations(insights, campaignData)
      }

      return {
        success: true,
        data: {
          campaignId: payload.campaignId,
          insights,
          comparison,
          recommendations,
          summary: this.generateSummary(insights),
        },
      }
    } catch (error) {
      this.log('Insight generation error', { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Insight generation failed',
      }
    }
  }

  /**
   * Fetch campaign data from Supabase
   */
  private async fetchCampaignData(campaignId: string) {
    // TODO: Query actual campaign data
    return {
      totalSubmissions: 50,
      openRate: 0.64,
      replyRate: 0.16,
      conversionRate: 0.12,
      avgResponseTime: 3.2, // days
    }
  }

  /**
   * Generate campaign insights
   */
  private generateInsights(campaignData: any): CampaignInsight[] {
    const insights: CampaignInsight[] = []

    // Open rate insight
    if (campaignData.openRate > 0.6) {
      insights.push({
        type: 'engagement',
        title: 'Strong email engagement',
        description:
          'Your open rate is above industry average, indicating good subject lines and sender reputation',
        metric: {
          name: 'Open Rate',
          value: Math.round(campaignData.openRate * 100),
          trend: 'up',
        },
        priority: 'low',
        actionable: false,
      })
    } else if (campaignData.openRate < 0.3) {
      insights.push({
        type: 'engagement',
        title: 'Low email engagement',
        description: 'Open rate is below average - consider improving subject lines',
        metric: {
          name: 'Open Rate',
          value: Math.round(campaignData.openRate * 100),
          trend: 'down',
        },
        priority: 'high',
        actionable: true,
        recommendation: 'Test different subject line styles and send times',
      })
    }

    // Reply rate insight
    if (campaignData.replyRate > 0.15) {
      insights.push({
        type: 'conversion',
        title: 'Excellent reply rate',
        description:
          'Your pitch content is resonating well with recipients',
        metric: {
          name: 'Reply Rate',
          value: Math.round(campaignData.replyRate * 100),
          trend: 'up',
        },
        priority: 'low',
        actionable: false,
      })
    } else if (campaignData.replyRate < 0.08) {
      insights.push({
        type: 'conversion',
        title: 'Low reply rate',
        description: 'Few recipients are responding - pitch may need improvement',
        metric: {
          name: 'Reply Rate',
          value: Math.round(campaignData.replyRate * 100),
          trend: 'down',
        },
        priority: 'high',
        actionable: true,
        recommendation: 'Increase personalisation and reference specific work from each contact',
      })
    }

    // Response time insight
    if (campaignData.avgResponseTime > 5) {
      insights.push({
        type: 'trend',
        title: 'Slow response times',
        description: 'Contacts are taking longer than usual to respond',
        metric: {
          name: 'Avg Response Time',
          value: campaignData.avgResponseTime,
          trend: 'down',
        },
        priority: 'medium',
        actionable: true,
        recommendation:
          'Consider sending follow-ups earlier or adjusting send timing',
      })
    }

    return insights
  }

  /**
   * Generate comparison with previous campaigns
   */
  private async generateComparison(campaignId: string) {
    // TODO: Query historical campaigns
    return {
      openRate: {
        current: 64,
        previous: 58,
        change: +6,
      },
      replyRate: {
        current: 16,
        previous: 12,
        change: +4,
      },
    }
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(insights: CampaignInsight[], campaignData: any) {
    const recommendations: string[] = []

    // Extract actionable insights
    const actionableInsights = insights.filter(i => i.actionable && i.recommendation)

    actionableInsights.forEach(insight => {
      if (insight.recommendation) {
        recommendations.push(insight.recommendation)
      }
    })

    // Add general best practices if no specific issues
    if (recommendations.length === 0) {
      recommendations.push(
        'Campaign is performing well - maintain current approach',
        'Consider A/B testing variations to optimise further'
      )
    }

    return recommendations
  }

  /**
   * Generate executive summary
   */
  private generateSummary(insights: CampaignInsight[]) {
    const highPriority = insights.filter(i => i.priority === 'high').length
    const actionable = insights.filter(i => i.actionable).length

    let status: 'excellent' | 'good' | 'needs_attention'
    if (highPriority === 0) {
      status = 'excellent'
    } else if (highPriority <= 1) {
      status = 'good'
    } else {
      status = 'needs_attention'
    }

    return {
      status,
      totalInsights: insights.length,
      highPriorityIssues: highPriority,
      actionableItems: actionable,
    }
  }
}
