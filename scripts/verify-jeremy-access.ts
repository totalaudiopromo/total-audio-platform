#!/usr/bin/env ts-node

/**
 * Access Verification Script
 *
 * Verifies Jeremy can access all apps:
 * - Audio Intel (intel.totalaudiopromo.com)
 * - Campaign Tracker (tracker.totalaudiopromo.com)
 * - Pitch Generator (pitch.totalaudiopromo.com)
 */

const APPS = [
  {
    name: 'Audio Intel',
    url: 'https://intel.totalaudiopromo.com',
    status: 'live',
  },
  {
    name: 'Campaign Tracker',
    url: 'https://tracker.totalaudiopromo.com',
    status: 'coming-soon',
  },
  {
    name: 'Pitch Generator',
    url: 'https://pitch.totalaudiopromo.com',
    status: 'coming-soon',
  },
];

async function checkAppAccessibility(url: string, name: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    return {
      accessible: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        accessible: false,
        status: 0,
        statusText: 'Timeout',
      };
    }
    return {
      accessible: false,
      status: 0,
      statusText: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function verifyAllAccess() {
  console.log("🔍 Verifying Jeremy's Access to All Apps\n");
  console.log('='.repeat(60));
  console.log(`Email: info@streamer.co.uk`);
  console.log(`Date: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60) + '\n');

  const results = [];

  for (const app of APPS) {
    console.log(`Checking ${app.name}...`);
    console.log(`  URL: ${app.url}`);

    if (app.status === 'coming-soon') {
      console.log(`  Status: ⏳ Coming Soon (skipping check)\n`);
      results.push({
        name: app.name,
        url: app.url,
        accessible: null,
        status: 'coming-soon',
      });
      continue;
    }

    const result = await checkAppAccessibility(app.url, app.name);

    if (result.accessible) {
      console.log(`  ✅ Accessible (${result.status} ${result.statusText})\n`);
    } else {
      console.log(`  ❌ Not Accessible (${result.status} ${result.statusText})\n`);
    }

    results.push({
      name: app.name,
      url: app.url,
      accessible: result.accessible,
      status: result.status,
      statusText: result.statusText,
    });
  }

  // Summary
  console.log('='.repeat(60));
  console.log('📊 Access Verification Summary');
  console.log('='.repeat(60));

  const accessibleApps = results.filter(r => r.accessible === true);
  const inaccessibleApps = results.filter(r => r.accessible === false);
  const comingSoonApps = results.filter(r => r.status === 'coming-soon');

  console.log(`✅ Accessible: ${accessibleApps.length}`);
  accessibleApps.forEach(app => {
    console.log(`   - ${app.name} (${app.url})`);
  });

  if (inaccessibleApps.length > 0) {
    console.log(`\n❌ Not Accessible: ${inaccessibleApps.length}`);
    inaccessibleApps.forEach(app => {
      console.log(`   - ${app.name} (${app.url}) - ${app.statusText}`);
    });
  }

  if (comingSoonApps.length > 0) {
    console.log(`\n⏳ Coming Soon: ${comingSoonApps.length}`);
    comingSoonApps.forEach(app => {
      console.log(`   - ${app.name} (${app.url})`);
    });
  }

  console.log('\n' + '='.repeat(60));

  // Test login URLs
  console.log('\n🔐 Login URLs:');
  results.forEach(app => {
    if (app.status !== 'coming-soon') {
      const loginUrl = `${app.url}/signin`;
      console.log(`   ${app.name}: ${loginUrl}`);
    }
  });

  return {
    accessible: accessibleApps.length,
    inaccessible: inaccessibleApps.length,
    comingSoon: comingSoonApps.length,
    total: results.length,
  };
}

if (require.main === module) {
  verifyAllAccess()
    .then(summary => {
      console.log('\n✅ Verification complete!');
      console.log(
        `   ${summary.accessible}/${summary.total - summary.comingSoon} live apps accessible`
      );
      process.exit(summary.inaccessible > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('\n💥 Verification failed:', error);
      process.exit(1);
    });
}

export { verifyAllAccess, checkAppAccessibility };
