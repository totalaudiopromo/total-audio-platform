/**
 * Feedback Digest Analyser
 * Aggregates user feedback and generates AI-powered insights
 * Uses Claude 3.5 Sonnet to analyse negative feedback patterns
 * Outputs digest to reports/feedback-digest.md and Telegram
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface FeedbackItem {
  id: string;
  userId: string;
  app: string;
  agentId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface FeedbackAnalysis {
  totalFeedback: number;
  averageRating: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  byApp: Record<string, { count: number; avgRating: number }>;
  negativeFeedback: FeedbackItem[];
}

interface ClaudeInsight {
  summary: string;
  themes: string[];
  recommendations: string[];
  urgentIssues: string[];
}

interface FeedbackDigestReport {
  period: string;
  analysis: FeedbackAnalysis;
  insights: ClaudeInsight;
  timestamp: string;
}

// ============================================================================
// Configuration
// ============================================================================

const FEEDBACK_PERIOD_DAYS = 7; // Analyse last 7 days of feedback
const NEGATIVE_RATING_THRESHOLD = 2; // Ratings ≤ 2 are considered negative
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';
const ANTHROPIC_MAX_TOKENS = 2000;

// ============================================================================
// Database Client
// ============================================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ============================================================================
// Anthropic Client
// ============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Fetch feedback from last N days
 */
async function fetchRecentFeedback(): Promise<FeedbackItem[]> {
  const startDate = new Date(Date.now() - FEEDBACK_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  const { data: feedback, error } = await supabase
    .from('feedback_events')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`);
  }

  if (!feedback || feedback.length === 0) {
    console.warn(`⚠️  No feedback found in last ${FEEDBACK_PERIOD_DAYS} days`);
    return [];
  }

  return feedback.map(f => ({
    id: f.id.toString(),
    userId: f.user_id,
    app: f.app,
    agentId: f.agent_id,
    rating: f.rating,
    comment: f.comment,
    createdAt: f.created_at,
  }));
}

/**
 * Analyse feedback data
 */
function analyseFeedback(feedback: FeedbackItem[]): FeedbackAnalysis {
  if (feedback.length === 0) {
    return {
      totalFeedback: 0,
      averageRating: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      byApp: {},
      negativeFeedback: [],
    };
  }

  // Calculate overall metrics
  const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
  const averageRating = totalRating / feedback.length;

  const positiveCount = feedback.filter(f => f.rating >= 4).length;
  const negativeCount = feedback.filter(f => f.rating <= NEGATIVE_RATING_THRESHOLD).length;
  const neutralCount = feedback.length - positiveCount - negativeCount;

  // Group by app
  const byApp: Record<string, { ratings: number[]; count: number }> = {};
  for (const item of feedback) {
    if (!byApp[item.app]) {
      byApp[item.app] = { ratings: [], count: 0 };
    }
    byApp[item.app].ratings.push(item.rating);
    byApp[item.app].count++;
  }

  const byAppSummary: Record<string, { count: number; avgRating: number }> = {};
  for (const [app, data] of Object.entries(byApp)) {
    const avgRating = data.ratings.reduce((sum, r) => sum + r, 0) / data.count;
    byAppSummary[app] = { count: data.count, avgRating };
  }

  // Extract negative feedback for detailed analysis
  const negativeFeedback = feedback.filter(f => f.rating <= NEGATIVE_RATING_THRESHOLD);

  return {
    totalFeedback: feedback.length,
    averageRating,
    positiveCount,
    negativeCount,
    neutralCount,
    byApp: byAppSummary,
    negativeFeedback,
  };
}

/**
 * Generate Claude-powered insights from negative feedback
 */
async function generateClaudeInsights(
  negativeFeedback: FeedbackItem[]
): Promise<ClaudeInsight> {
  if (negativeFeedback.length === 0) {
    return {
      summary: 'No negative feedback to analyse',
      themes: [],
      recommendations: [],
      urgentIssues: [],
    };
  }

  // Prepare negative feedback context for Claude
  const feedbackContext = negativeFeedback
    .map(
      (f, index) =>
        `${index + 1}. [${f.app}${f.agentId ? ` - ${f.agentId}` : ''}] Rating: ${f.rating}/5\n   Comment: ${f.comment || 'No comment provided'}\n   Date: ${new Date(f.createdAt).toLocaleString('en-GB')}`
    )
    .join('\n\n');

  const prompt = `You are analysing user feedback for Audio Intel, a UK-based contact enrichment SaaS for music industry professionals.

Here is the negative feedback (ratings ≤ 2 out of 5) from the last ${FEEDBACK_PERIOD_DAYS} days:

${feedbackContext}

Please analyse this feedback and provide:

1. **Summary**: A concise 2-3 sentence summary of the overall sentiment and key issues
2. **Themes**: 3-5 recurring themes or patterns in the negative feedback
3. **Recommendations**: 3-5 actionable recommendations to address the issues (prioritise by impact)
4. **Urgent Issues**: Any critical bugs or blockers that require immediate attention

Format your response as JSON with keys: summary, themes (array), recommendations (array), urgentIssues (array).

Keep recommendations specific, actionable, and focused on improving user experience. Use British English spelling.`;

  try {
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      temperature: 0.3, // Lower temperature for more consistent analysis
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse Claude's response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Extract JSON from response (Claude sometimes wraps it in markdown)
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Claude response');
    }

    const insights: ClaudeInsight = JSON.parse(jsonMatch[0]);

    return insights;
  } catch (error: any) {
    console.error('❌ Claude API error:', error.message);
    return {
      summary: 'Failed to generate insights due to API error',
      themes: ['Error analysing feedback'],
      recommendations: ['Retry analysis or review feedback manually'],
      urgentIssues: [],
    };
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report: FeedbackDigestReport): string {
  const { analysis, insights } = report;

  let markdown = `# Feedback Digest\n\n`;
  markdown += `**Period**: Last ${FEEDBACK_PERIOD_DAYS} days  \n`;
  markdown += `**Generated**: ${new Date(report.timestamp).toLocaleString('en-GB')}  \n\n`;

  markdown += `---\n\n`;

  // Overview Section
  markdown += `## Overview\n\n`;
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| Total Feedback | ${analysis.totalFeedback} |\n`;
  markdown += `| Average Rating | ${analysis.averageRating.toFixed(2)} / 5.0 |\n`;
  markdown += `| Positive (4-5⭐) | ${analysis.positiveCount} (${((analysis.positiveCount / analysis.totalFeedback) * 100).toFixed(1)}%) |\n`;
  markdown += `| Neutral (3⭐) | ${analysis.neutralCount} (${((analysis.neutralCount / analysis.totalFeedback) * 100).toFixed(1)}%) |\n`;
  markdown += `| Negative (1-2⭐) | ${analysis.negativeCount} (${((analysis.negativeCount / analysis.totalFeedback) * 100).toFixed(1)}%) |\n\n`;

  // Feedback by App Section
  if (Object.keys(analysis.byApp).length > 0) {
    markdown += `## Feedback by App\n\n`;
    markdown += `| App | Count | Avg Rating |\n`;
    markdown += `|-----|-------|------------|\n`;

    for (const [app, data] of Object.entries(analysis.byApp)) {
      markdown += `| ${app} | ${data.count} | ${data.avgRating.toFixed(2)} / 5.0 |\n`;
    }
    markdown += `\n`;
  }

  // Claude Insights Section
  markdown += `## AI-Powered Insights\n\n`;
  markdown += `### Summary\n\n`;
  markdown += `${insights.summary}\n\n`;

  if (insights.themes.length > 0) {
    markdown += `### Recurring Themes\n\n`;
    for (let i = 0; i < insights.themes.length; i++) {
      markdown += `${i + 1}. ${insights.themes[i]}\n`;
    }
    markdown += `\n`;
  }

  if (insights.recommendations.length > 0) {
    markdown += `### Recommendations\n\n`;
    for (let i = 0; i < insights.recommendations.length; i++) {
      markdown += `${i + 1}. **${insights.recommendations[i]}**\n`;
    }
    markdown += `\n`;
  }

  if (insights.urgentIssues.length > 0) {
    markdown += `### 🚨 Urgent Issues\n\n`;
    for (const issue of insights.urgentIssues) {
      markdown += `- ${issue}\n`;
    }
    markdown += `\n`;
  }

  // Negative Feedback Details
  if (analysis.negativeFeedback.length > 0) {
    markdown += `## Negative Feedback Details\n\n`;
    for (let i = 0; i < analysis.negativeFeedback.length; i++) {
      const f = analysis.negativeFeedback[i];
      markdown += `### ${i + 1}. [${f.app}] - ${f.rating}⭐\n\n`;
      if (f.agentId) {
        markdown += `**Agent**: ${f.agentId}  \n`;
      }
      markdown += `**Date**: ${new Date(f.createdAt).toLocaleString('en-GB')}  \n`;
      if (f.comment) {
        markdown += `**Comment**: ${f.comment}\n`;
      }
      markdown += `\n`;
    }
  }

  markdown += `---\n\n`;
  markdown += `_Generated by Feedback Digest Analyser with Claude 3.5 Sonnet_\n`;

  return markdown;
}

/**
 * Write report to file
 */
function writeReportToFile(markdown: string): void {
  const reportsDir = join(process.cwd(), 'reports');

  // Create reports directory if it doesn't exist
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = join(reportsDir, 'feedback-digest.md');
  writeFileSync(reportPath, markdown, 'utf-8');

  console.log(`✅ Report written to: ${reportPath}`);
}

/**
 * Send report summary to Telegram
 */
async function sendTelegramNotification(report: FeedbackDigestReport): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('⚠️  Telegram credentials not configured, skipping notification');
    return;
  }

  const { analysis, insights } = report;

  // Format message
  let message = `💬 *Feedback Digest* - Last ${FEEDBACK_PERIOD_DAYS} Days\n\n`;

  // Overview
  const sentimentEmoji =
    analysis.averageRating >= 4 ? '😊' : analysis.averageRating >= 3 ? '😐' : '😟';
  message += `${sentimentEmoji} *Overall*: ${analysis.totalFeedback} responses, ${analysis.averageRating.toFixed(1)}/5 avg\n`;
  message += `👍 Positive: ${analysis.positiveCount} | 👎 Negative: ${analysis.negativeCount}\n\n`;

  // Claude insights
  if (insights.summary !== 'No negative feedback to analyse') {
    message += `*AI Analysis Summary:*\n${insights.summary}\n\n`;

    if (insights.urgentIssues.length > 0) {
      message += `🚨 *Urgent Issues:*\n`;
      for (const issue of insights.urgentIssues.slice(0, 2)) {
        message += `• ${issue}\n`;
      }
      message += `\n`;
    }

    if (insights.recommendations.length > 0) {
      message += `*Top Recommendations:*\n`;
      for (let i = 0; i < Math.min(3, insights.recommendations.length); i++) {
        message += `${i + 1}. ${insights.recommendations[i]}\n`;
      }
    }
  } else {
    message += `✅ No negative feedback in the last ${FEEDBACK_PERIOD_DAYS} days - keep up the great work!\n`;
  }

  message += `\n_Full report: reports/feedback-digest.md_`;

  // Send via Telegram Bot API
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Telegram notification failed:', error);
    } else {
      console.log('✅ Telegram notification sent successfully');
    }
  } catch (error: any) {
    console.error('❌ Telegram notification error:', error.message);
  }
}

/**
 * Print report summary to console
 */
function printReportSummary(report: FeedbackDigestReport): void {
  const { analysis, insights } = report;

  console.log('\n' + '='.repeat(80));
  console.log('FEEDBACK DIGEST');
  console.log('='.repeat(80));
  console.log(`Period: Last ${FEEDBACK_PERIOD_DAYS} days`);
  console.log(`Generated: ${new Date(report.timestamp).toLocaleString('en-GB')}`);
  console.log('='.repeat(80));

  // Overview
  console.log('\nOVERVIEW:');
  console.log('-'.repeat(80));
  console.log(`Total Feedback:   ${analysis.totalFeedback}`);
  console.log(`Average Rating:   ${analysis.averageRating.toFixed(2)} / 5.0`);
  console.log(`Positive (4-5⭐):  ${analysis.positiveCount} (${((analysis.positiveCount / analysis.totalFeedback) * 100).toFixed(1)}%)`);
  console.log(`Neutral (3⭐):     ${analysis.neutralCount} (${((analysis.neutralCount / analysis.totalFeedback) * 100).toFixed(1)}%)`);
  console.log(`Negative (1-2⭐):  ${analysis.negativeCount} (${((analysis.negativeCount / analysis.totalFeedback) * 100).toFixed(1)}%)`);

  // By app
  if (Object.keys(analysis.byApp).length > 0) {
    console.log('\nFEEDBACK BY APP:');
    console.log('-'.repeat(80));
    for (const [app, data] of Object.entries(analysis.byApp)) {
      console.log(`${app.padEnd(20)}: ${data.count} responses, ${data.avgRating.toFixed(2)}/5 avg`);
    }
  }

  // Claude insights
  console.log('\nAI-POWERED INSIGHTS:');
  console.log('-'.repeat(80));
  console.log(`Summary: ${insights.summary}`);

  if (insights.themes.length > 0) {
    console.log('\nRecurring Themes:');
    for (let i = 0; i < insights.themes.length; i++) {
      console.log(`  ${i + 1}. ${insights.themes[i]}`);
    }
  }

  if (insights.recommendations.length > 0) {
    console.log('\nRecommendations:');
    for (let i = 0; i < insights.recommendations.length; i++) {
      console.log(`  ${i + 1}. ${insights.recommendations[i]}`);
    }
  }

  if (insights.urgentIssues.length > 0) {
    console.log('\n🚨 URGENT ISSUES:');
    for (const issue of insights.urgentIssues) {
      console.log(`  • ${issue}`);
    }
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// ============================================================================
// CLI Execution
// ============================================================================

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run');
  const shouldNotify = process.argv.includes('--notify');

  console.log(`💬 Analysing user feedback from last ${FEEDBACK_PERIOD_DAYS} days...`);

  try {
    // Fetch feedback
    const feedback = await fetchRecentFeedback();

    // Analyse feedback
    const analysis = analyseFeedback(feedback);

    // Generate Claude insights
    console.log('🤖 Generating AI-powered insights with Claude 3.5 Sonnet...');
    const insights = await generateClaudeInsights(analysis.negativeFeedback);

    // Create report
    const report: FeedbackDigestReport = {
      period: `Last ${FEEDBACK_PERIOD_DAYS} days`,
      analysis,
      insights,
      timestamp: new Date().toISOString(),
    };

    // Output
    printReportSummary(report);

    // Generate markdown and write to file
    if (!isDryRun) {
      const markdown = generateMarkdownReport(report);
      writeReportToFile(markdown);
    } else {
      console.log('🏃 DRY RUN - Skipping file write');
    }

    // Send notification if requested
    if (shouldNotify && !isDryRun) {
      console.log('📤 Sending Telegram notification...');
      await sendTelegramNotification(report);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Feedback digest generation failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as runFeedbackDigest };
