#!/usr/bin/env tsx
/**
 * Golden Deployment Promotion
 * Promotes preview deployments to production using Vercel API
 */

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  target: string;
}

interface PromoteResult {
  app: string;
  deploymentId: string;
  status: 'success' | 'fail';
  message: string;
}

const APP_PROJECTS: Record<string, string> = {
  'audio-intel': 'audio-intel',
  tracker: 'tracker',
  'pitch-generator': 'pitch-generator',
  'command-centre': 'command-centre',
};

async function getLatestPreviewDeployment(
  projectName: string,
  token: string
): Promise<VercelDeployment | null> {
  try {
    const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectName}&limit=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch deployments for ${projectName}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const deployments = data.deployments as VercelDeployment[];

    // Find the most recent preview deployment that is READY
    const previewDeployment = deployments.find(
      (d: VercelDeployment) => d.target === 'preview' && d.state === 'READY'
    );

    return previewDeployment || null;
  } catch (error) {
    console.error(`Error fetching deployments for ${projectName}:`, error);
    return null;
  }
}

async function promoteDeployment(deploymentId: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}/promote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to promote deployment ${deploymentId}: ${response.status} - ${errorText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error promoting deployment ${deploymentId}:`, error);
    return false;
  }
}

async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured, skipping notification');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

async function promoteAllApps(): Promise<PromoteResult[]> {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    console.error('Error: VERCEL_TOKEN environment variable is required');
    process.exit(1);
  }

  const results: PromoteResult[] = [];

  for (const [appName, projectName] of Object.entries(APP_PROJECTS)) {
    console.error(`\nProcessing ${appName}...`);

    const deployment = await getLatestPreviewDeployment(projectName, token);

    if (!deployment) {
      const result: PromoteResult = {
        app: appName,
        deploymentId: 'none',
        status: 'fail',
        message: 'No preview deployment found',
      };
      results.push(result);
      await sendTelegramMessage(`❌ ${appName}: No preview deployment found`);
      continue;
    }

    console.error(`  Found deployment: ${deployment.url} (${deployment.uid})`);

    const success = await promoteDeployment(deployment.uid, token);

    const result: PromoteResult = {
      app: appName,
      deploymentId: deployment.uid,
      status: success ? 'success' : 'fail',
      message: success ? `Promoted ${deployment.url}` : 'Promotion failed',
    };
    results.push(result);

    if (success) {
      await sendTelegramMessage(`✅ ${appName}: Promoted to production (${deployment.url})`);
    } else {
      await sendTelegramMessage(`❌ ${appName}: Promotion failed`);
    }
  }

  return results;
}

async function main() {
  console.error('=== Golden Deployment Promotion ===\n');

  const results = await promoteAllApps();

  // Output JSON summary to stdout
  console.log(JSON.stringify({ results, timestamp: new Date().toISOString() }, null, 2));

  // Log human-readable summary to stderr
  console.error('\n=== Promotion Summary ===');
  for (const result of results) {
    const icon = result.status === 'success' ? '✓' : '✗';
    console.error(`  ${icon} ${result.app}: ${result.message}`);
  }

  // Exit with appropriate code
  const allSuccess = results.every((r) => r.status === 'success');
  const exitCode = allSuccess ? 0 : 1;

  if (!allSuccess) {
    await sendTelegramMessage('❌ Golden Deployment: Some apps failed to promote');
  }

  process.exit(exitCode);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  sendTelegramMessage('❌ Golden Deployment: Fatal error during promotion').catch(() => {});
  process.exit(1);
});
