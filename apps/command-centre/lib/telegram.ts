/**
 * Phase 9D: Telegram Notification Utility
 * Sends system alerts and summaries to Telegram bot
 */

interface TelegramMessage {
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  disable_web_page_preview?: boolean;
}

interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

/**
 * Get Telegram configuration from environment
 */
function getTelegramConfig(): TelegramConfig {
  return {
    botToken: process.env.TAP_DISCORD_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  };
}

/**
 * Check if Telegram is configured
 */
export function isTelegramConfigured(): boolean {
  const config = getTelegramConfig();
  return !!(config.botToken && config.chatId);
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(
  message: string,
  options: { parseMode?: 'Markdown' | 'HTML'; disablePreview?: boolean } = {}
): Promise<boolean> {
  const config = getTelegramConfig();

  if (!config.botToken || !config.chatId) {
    console.warn('Telegram not configured - skipping notification');
    return false;
  }

  try {
    const payload: TelegramMessage = {
      text: message,
      parse_mode: options.parseMode,
      disable_web_page_preview: options.disablePreview,
    };

    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage?chat_id=${config.chatId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

/**
 * Send agent health summary to Telegram
 */
export async function sendAgentHealthSummary(summary: {
  totalAgents: number;
  activeAgents: number;
  failedAgents: number;
  avgSuccessRate: number;
  avgLatency: number;
}) {
  const message = `
🤖 *Agent Health Summary*

📊 Status: ${summary.activeAgents}/${summary.totalAgents} agents operational
✅ Success Rate: ${summary.avgSuccessRate.toFixed(1)}%
⚡ Avg Latency: ${summary.avgLatency}ms
${summary.failedAgents > 0 ? `⚠️ Failed: ${summary.failedAgents} agents need attention` : '✨ All systems nominal'}

_Phase 9D Ops Console_
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'Markdown', disablePreview: true });
}

/**
 * Send agent failure alert to Telegram
 */
export async function sendAgentFailureAlert(failure: {
  agentId: string;
  app: string;
  errorCode: string;
  timestamp: string;
}) {
  const message = `
🚨 *Agent Failure Alert*

Agent: ${failure.agentId}
App: ${failure.app}
Error: \`${failure.errorCode}\`
Time: ${failure.timestamp}

Check Ops Console for details.
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'Markdown', disablePreview: true });
}

/**
 * Send feedback digest to Telegram
 */
export async function sendFeedbackDigest(digest: {
  totalFeedback: number;
  avgRating: number;
  positive: number;
  negative: number;
  period: string;
}) {
  const message = `
💬 *Weekly Feedback Digest*

Period: ${digest.period}
Total: ${digest.totalFeedback} responses
Rating: ${digest.avgRating.toFixed(1)} ⭐
Positive: ${digest.positive} 👍
Negative: ${digest.negative} 👎

${digest.negative > 0 ? `⚠️ ${digest.negative} negative responses need review` : '✨ All feedback positive'}

_Phase 9D Ops Console_
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'Markdown', disablePreview: true });
}

/**
 * Send growth summary to Telegram
 */
export async function sendGrowthSummary(summary: {
  totalRevenue: number;
  revenueGrowth: number;
  conversions: number;
  conversionRate: number;
  period: string;
}) {
  const formatCurrency = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  const message = `
📈 *Weekly Growth Summary*

Period: ${summary.period}
Revenue: ${formatCurrency(summary.totalRevenue)}
Growth: ${summary.revenueGrowth > 0 ? '+' : ''}${summary.revenueGrowth.toFixed(1)}%
Conversions: ${summary.conversions}
Conv. Rate: ${summary.conversionRate.toFixed(1)}%

${summary.revenueGrowth > 0 ? '🚀 Revenue growing' : '⚠️ Revenue needs attention'}

_Phase 9D Ops Console_
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'Markdown', disablePreview: true });
}

/**
 * Send system alert to Telegram
 */
export async function sendSystemAlert(alert: {
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error';
}) {
  const emoji = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '🚨',
  }[alert.level];

  const message = `
${emoji} *${alert.title}*

${alert.message}

_Phase 9D Ops Console_
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'Markdown', disablePreview: true });
}
