/**
 * AnalyticsSummariser Sub-Agent
 * Generates campaign performance summaries and insights
 */

import type { SubAgentResult } from '../../core/AgentTypes'

export interface AnalyticsSummaryPayload {
  campaignId: string
  startDate?: string
  endDate?: string
}

export interface CampaignAnalytics {
  campaignId: string
  period: {
    start: string
    end: string
  }
  metrics: {
    totalSubmissions: number
    sentCount: number
    deliveredCount: number
    openedCount: number
    repliedCount: number
    rejectedCount: number
  }
  rates: {
    deliveryRate: number
    openRate: number
    replyRate: number
    rejectionRate: number
  }
  insights: string[]
  recommendations: string[]
}

export class AnalyticsSummariser {
  /**
   * Generate analytics summary for a campaign
   */
  static async summarise(payload: AnalyticsSummaryPayload): Promise<SubAgentResult> {
    try {
      console.log('[AnalyticsSummariser] Generating summary for:', payload.campaignId)

      const analytics = await this.generateAnalytics(payload)

      return {
        success: true,
        data: analytics,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analytics generation failed',
      }
    }
  }

  /**
   * Generate campaign analytics
   */
  private static async generateAnalytics(
    payload: AnalyticsSummaryPayload
  ): Promise<CampaignAnalytics> {
    // TODO: Query actual submission data from Supabase
    const mockMetrics = {
      totalSubmissions: 50,
      sentCount: 50,
      deliveredCount: 48,
      openedCount: 32,
      repliedCount: 8,
      rejectedCount: 2,
    }

    const rates = this.calculateRates(mockMetrics)
    const insights = this.generateInsights(mockMetrics, rates)
    const recommendations = this.generateRecommendations(rates)

    return {
      campaignId: payload.campaignId,
      period: {
        start: payload.startDate || new Date().toISOString(),
        end: payload.endDate || new Date().toISOString(),
      },
      metrics: mockMetrics,
      rates,
      insights,
      recommendations,
    }
  }

  /**
   * Calculate performance rates
   */
  private static calculateRates(metrics: CampaignAnalytics['metrics']) {
    const { totalSubmissions, deliveredCount, openedCount, repliedCount, rejectedCount } =
      metrics

    return {
      deliveryRate:
        totalSubmissions > 0 ? Math.round((deliveredCount / totalSubmissions) * 100) : 0,
      openRate:
        deliveredCount > 0 ? Math.round((openedCount / deliveredCount) * 100) : 0,
      replyRate: openedCount > 0 ? Math.round((repliedCount / openedCount) * 100) : 0,
      rejectionRate:
        totalSubmissions > 0 ? Math.round((rejectedCount / totalSubmissions) * 100) : 0,
    }
  }

  /**
   * Generate insights from analytics
   */
  private static generateInsights(
    metrics: CampaignAnalytics['metrics'],
    rates: CampaignAnalytics['rates']
  ): string[] {
    const insights: string[] = []

    // Delivery insights
    if (rates.deliveryRate >= 95) {
      insights.push('Excellent delivery rate - contact emails are valid and active')
    } else if (rates.deliveryRate < 90) {
      insights.push(
        'Low delivery rate - consider validating contact emails before sending'
      )
    }

    // Open rate insights
    if (rates.openRate >= 40) {
      insights.push('Strong open rate - subject lines and timing are working well')
    } else if (rates.openRate < 25) {
      insights.push('Low open rate - try improving subject lines or send timing')
    }

    // Reply rate insights
    if (rates.replyRate >= 20) {
      insights.push('Excellent reply rate - pitch content is resonating well')
    } else if (rates.replyRate < 10) {
      insights.push('Low reply rate - consider improving pitch personalisation')
    }

    return insights
  }

  /**
   * Generate recommendations based on performance
   */
  private static generateRecommendations(rates: CampaignAnalytics['rates']): string[] {
    const recommendations: string[] = []

    if (rates.deliveryRate < 90) {
      recommendations.push('Use Audio Intel to verify contact email addresses')
    }

    if (rates.openRate < 30) {
      recommendations.push('A/B test different subject line approaches')
      recommendations.push('Consider sending at different times of day')
    }

    if (rates.replyRate < 15) {
      recommendations.push('Increase pitch personalisation with contact research')
      recommendations.push('Reference specific shows or articles from each contact')
    }

    if (recommendations.length === 0) {
      recommendations.push('Campaign performance is strong - maintain current approach')
    }

    return recommendations
  }
}
