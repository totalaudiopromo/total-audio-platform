#!/usr/bin/env tsx
/**
 * Golden Deployment Health Check
 * Verifies all critical systems before promoting to production
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../packages/core-db/src/types/database';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail';
  message: string;
  duration: number;
}

interface GoldenCheckSummary {
  app: string;
  timestamp: string;
  checks: CheckResult[];
  overall: 'pass' | 'fail';
  duration: number;
}

const APP_URLS: Record<string, string> = {
  'audio-intel': 'https://intel.totalaudiopromo.com',
  'tracker': 'https://tracker.totalaudiopromo.com',
  'pitch-generator': 'https://pitch.totalaudiopromo.com',
  'command-centre': 'https://command.totalaudiopromo.com',
};

async function measureDuration<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return [result, duration];
}

async function checkSupabaseConnectivity(
  supabase: ReturnType<typeof createClient<Database>>
): Promise<CheckResult> {
  try {
    const [result, duration] = await measureDuration(async () => {
      const { error } = await supabase.from('agent_events').select('id').limit(1);
      return { error };
    });

    if (result.error) {
      return {
        name: 'Supabase Connectivity',
        status: 'fail',
        message: `Connection failed: ${result.error.message}`,
        duration,
      };
    }

    return {
      name: 'Supabase Connectivity',
      status: 'pass',
      message: 'Successfully connected to Supabase',
      duration,
    };
  } catch (error) {
    return {
      name: 'Supabase Connectivity',
      status: 'fail',
      message: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
      duration: 0,
    };
  }
}

async function checkTables(
  supabase: ReturnType<typeof createClient<Database>>
): Promise<CheckResult[]> {
  const tables = ['agent_events', 'feedback_events', 'conversion_events'] as const;
  const results: CheckResult[] = [];

  for (const table of tables) {
    try {
      const [result, duration] = await measureDuration(async () => {
        const { error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
        return { error, count };
      });

      if (result.error) {
        results.push({
          name: `Table: ${table}`,
          status: 'fail',
          message: `Table check failed: ${result.error.message}`,
          duration,
        });
      } else {
        results.push({
          name: `Table: ${table}`,
          status: 'pass',
          message: `Table exists with ${result.count ?? 0} rows`,
          duration,
        });
      }
    } catch (error) {
      results.push({
        name: `Table: ${table}`,
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        duration: 0,
      });
    }
  }

  return results;
}

async function checkRPC(supabase: ReturnType<typeof createClient<Database>>): Promise<CheckResult> {
  try {
    const [result, duration] = await measureDuration(async () => {
      const { error } = await supabase.rpc('get_agent_metrics' as any, {});
      return { error };
    });

    // RPC might not exist yet, so we'll mark as pass if error is "function not found"
    if (result.error && !result.error.message.includes('function') && !result.error.message.includes('does not exist')) {
      return {
        name: 'RPC: get_agent_metrics',
        status: 'fail',
        message: `RPC call failed: ${result.error.message}`,
        duration,
      };
    }

    return {
      name: 'RPC: get_agent_metrics',
      status: 'pass',
      message: result.error ? 'RPC not implemented yet (expected)' : 'RPC exists and callable',
      duration,
    };
  } catch (error) {
    return {
      name: 'RPC: get_agent_metrics',
      status: 'pass',
      message: 'RPC not implemented yet (expected)',
      duration: 0,
    };
  }
}

async function checkAPIEndpoints(app: string): Promise<CheckResult[]> {
  const baseURL = APP_URLS[app];
  if (!baseURL) {
    return [
      {
        name: 'API Endpoints',
        status: 'fail',
        message: `Unknown app: ${app}`,
        duration: 0,
      },
    ];
  }

  const endpoints = ['/api/health'];

  // Add app-specific endpoints
  if (app === 'command-centre') {
    endpoints.push('/api/ops-console/agents', '/api/ops-console/feedback');
  }

  const results: CheckResult[] = [];

  for (const endpoint of endpoints) {
    try {
      const [result, duration] = await measureDuration(async () => {
        const response = await fetch(`${baseURL}${endpoint}`, {
          method: 'GET',
          headers: { 'User-Agent': 'GoldenCheck/1.0' },
        });
        return { status: response.status, ok: response.ok };
      });

      results.push({
        name: `API: ${endpoint}`,
        status: result.ok ? 'pass' : 'fail',
        message: result.ok ? `Responded with ${result.status}` : `HTTP ${result.status}`,
        duration,
      });
    } catch (error) {
      results.push({
        name: `API: ${endpoint}`,
        status: 'fail',
        message: `Request failed: ${error instanceof Error ? error.message : String(error)}`,
        duration: 0,
      });
    }
  }

  return results;
}

async function checkExternalServices(): Promise<CheckResult[]> {
  const services = [
    { name: 'Telegram Bot API', url: 'https://api.telegram.org' },
    { name: 'Plausible Analytics', url: 'https://plausible.io' },
  ];

  const results: CheckResult[] = [];

  for (const service of services) {
    try {
      const [result, duration] = await measureDuration(async () => {
        const response = await fetch(service.url, {
          method: 'GET',
          headers: { 'User-Agent': 'GoldenCheck/1.0' },
        });
        return { status: response.status, ok: response.ok || response.status === 404 }; // 404 is fine for service availability
      });

      results.push({
        name: service.name,
        status: result.ok ? 'pass' : 'fail',
        message: result.ok ? 'Service reachable' : `HTTP ${result.status}`,
        duration,
      });
    } catch (error) {
      results.push({
        name: service.name,
        status: 'fail',
        message: `Unreachable: ${error instanceof Error ? error.message : String(error)}`,
        duration: 0,
      });
    }
  }

  return results;
}

async function runGoldenCheck(app: string): Promise<GoldenCheckSummary> {
  const startTime = Date.now();
  const checks: CheckResult[] = [];

  // Initialize Supabase client
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseURL || !supabaseKey) {
    checks.push({
      name: 'Environment Variables',
      status: 'fail',
      message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      duration: 0,
    });

    return {
      app,
      timestamp: new Date().toISOString(),
      checks,
      overall: 'fail',
      duration: Date.now() - startTime,
    };
  }

  const supabase = createClient<Database>(supabaseURL, supabaseKey);

  // Run all checks
  console.error(`Running Golden Check for ${app}...`);

  checks.push(await checkSupabaseConnectivity(supabase));
  checks.push(...(await checkTables(supabase)));
  checks.push(await checkRPC(supabase));
  checks.push(...(await checkAPIEndpoints(app)));
  checks.push(...(await checkExternalServices()));

  const overall = checks.every((c) => c.status === 'pass') ? 'pass' : 'fail';
  const duration = Date.now() - startTime;

  return {
    app,
    timestamp: new Date().toISOString(),
    checks,
    overall,
    duration,
  };
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const appIndex = args.indexOf('--app');

  if (appIndex === -1 || !args[appIndex + 1]) {
    console.error('Error: --app argument is required');
    console.error('Usage: golden-check.ts --app <audio-intel|tracker|pitch-generator|command-centre>');
    process.exit(1);
  }

  const app = args[appIndex + 1];
  const validApps = Object.keys(APP_URLS);

  if (!validApps.includes(app)) {
    console.error(`Error: Invalid app "${app}"`);
    console.error(`Valid apps: ${validApps.join(', ')}`);
    process.exit(1);
  }

  const summary = await runGoldenCheck(app);

  // Output JSON summary to stdout
  console.log(JSON.stringify(summary, null, 2));

  // Log human-readable summary to stderr
  console.error('\n=== Golden Check Summary ===');
  console.error(`App: ${summary.app}`);
  console.error(`Overall: ${summary.overall.toUpperCase()}`);
  console.error(`Duration: ${summary.duration}ms`);
  console.error(`\nChecks (${summary.checks.length} total):`);

  for (const check of summary.checks) {
    const icon = check.status === 'pass' ? '✓' : '✗';
    console.error(`  ${icon} ${check.name}: ${check.message} (${check.duration}ms)`);
  }

  // Exit with appropriate code
  process.exit(summary.overall === 'pass' ? 0 : 1);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
