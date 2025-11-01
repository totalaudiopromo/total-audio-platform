#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const apps = ['audio-intel', 'command-centre', 'tracker', 'web', 'pitch-generator'];

// Health endpoint template
const healthEndpointTemplate = `import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    // Add app-specific checks here
    // Example: Database connection, external API calls, etc.

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  }
}
`;

function createHealthEndpoints() {
  console.log('🏥 Creating health check endpoints...\n');

  apps.forEach(app => {
    console.log(`📱 Creating health endpoint for ${app}:`);

    // Create the health API route directory
    const healthDir = path.join(__dirname, '..', 'apps', app, 'app', 'api', 'health');

    if (!fs.existsSync(healthDir)) {
      fs.mkdirSync(healthDir, { recursive: true });
      console.log(`  📁 Created directory: ${healthDir}`);
    }

    // Create route.ts file
    const routeFile = path.join(healthDir, 'route.ts');

    if (!fs.existsSync(routeFile)) {
      fs.writeFileSync(routeFile, healthEndpointTemplate);
      console.log(`  📝 Created route.ts`);
    } else {
      console.log(`  ✅ Health endpoint already exists`);
    }

    console.log(`  🔗 Health check URL: https://${getAppDomain(app)}/api/health`);
    console.log('');
  });

  console.log('🎉 Health endpoints created successfully!');
  console.log('📊 You can now monitor your apps at /api/health');
}

function getAppDomain(app) {
  const domains = {
    'audio-intel': 'intel.totalaudiopromo.com',
    'command-centre': 'command.totalaudiopromo.com',
    tracker: 'tracker.totalaudiopromo.com',
    web: 'totalaudiopromo.com',
    'pitch-generator': 'pitch.totalaudiopromo.com',
  };

  return domains[app] || `${app}.totalaudiopromo.com`;
}

// Run health endpoint creation
createHealthEndpoints();
