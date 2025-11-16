import Link from 'next/link';
import {
  Zap,
  CheckCircle2,
  Code2,
  Shield,
  Users,
  Sparkles,
  BarChart3,
  Package,
  Search,
  Wand2,
} from 'lucide-react';

export default function TestFeaturesIndex() {
  const features = [
    {
      name: '1. Contact Confidence Engine',
      description:
        'Traffic light scoring system - know which contacts are reliable before you pitch',
      path: '/test-features/confidence',
      app: 'Audio Intel',
      icon: Shield,
      color: 'green',
    },
    {
      name: '2. Contact Similarity Engine',
      description:
        'Find contacts similar to your best performers - expand your network strategically',
      path: '/test-features/similarity',
      app: 'Audio Intel',
      icon: Users,
      color: 'blue',
    },
    {
      name: '3. Pitch Variations Generator',
      description:
        '5 different pitch styles (formal, casual, concise, detailed, follow-up) powered by Claude',
      path: 'http://localhost:3004/test-features/pitch-variations',
      app: 'Pitch Generator',
      external: true,
      icon: Sparkles,
      color: 'purple',
    },
    {
      name: '4. Campaign Post-Mortem',
      description: 'AI-powered campaign analysis - wins, learnings, and recommendations',
      path: 'http://localhost:3001/test-features/post-mortem',
      app: 'Tracker',
      external: true,
      icon: BarChart3,
      color: 'orange',
    },
    {
      name: '5. Export Templates (Pitch)',
      description: 'Press Kit, Radio Plan, Playlist Pack exports for PR campaigns',
      path: 'http://localhost:3004/test-features/exports',
      app: 'Pitch Generator',
      external: true,
      icon: Package,
      color: 'pink',
    },
    {
      name: '5b. Export Templates (Tracker)',
      description: 'Client Report exports for campaign analytics',
      path: 'http://localhost:3001/test-features/exports',
      app: 'Tracker',
      external: true,
      icon: Package,
      color: 'pink',
    },
    {
      name: '6. Enrichment Audit Trail',
      description: 'Complete transparency - see every enrichment, cost, and performance metric',
      path: '/test-features/audit',
      app: 'Audio Intel',
      icon: Search,
      color: 'yellow',
    },
    {
      name: '7. Quick Intel Widget',
      description: 'Embeddable widget with 3 free enrichments for lead generation',
      path: '/test-features/widget',
      app: 'Audio Intel',
      icon: Wand2,
      color: 'cyan',
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; iconBg: string }> = {
    green: {
      bg: 'bg-green-50 hover:bg-green-100',
      border: 'border-green-500',
      iconBg: 'bg-green-500',
    },
    blue: { bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-500', iconBg: 'bg-blue-500' },
    purple: {
      bg: 'bg-purple-50 hover:bg-purple-100',
      border: 'border-purple-500',
      iconBg: 'bg-purple-500',
    },
    orange: {
      bg: 'bg-orange-50 hover:bg-orange-100',
      border: 'border-orange-500',
      iconBg: 'bg-orange-500',
    },
    pink: { bg: 'bg-pink-50 hover:bg-pink-100', border: 'border-pink-500', iconBg: 'bg-pink-500' },
    yellow: {
      bg: 'bg-yellow-50 hover:bg-yellow-100',
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-500',
    },
    cyan: { bg: 'bg-cyan-50 hover:bg-cyan-100', border: 'border-cyan-500', iconBg: 'bg-cyan-500' },
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-4 border-black bg-blue-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Staging Environment</span>
          </div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Feature Testing Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            7 new features across Audio Intel, Pitch Generator, and Tracker
          </p>
        </div>

        {/* Status Card */}
        <div className="glass-panel mb-8 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-3 text-lg font-bold">Multi-App Environment Ready</h3>
              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="font-semibold">Branch:</span> staging/total-audio-promo-features
                </div>
                <div>
                  <span className="font-semibold">Audio Intel:</span> localhost:3005
                </div>
                <div>
                  <span className="font-semibold">Pitch Generator:</span> localhost:3004
                </div>
                <div>
                  <span className="font-semibold">Tracker:</span> localhost:3001
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];

            if (feature.external) {
              return (
                <a
                  key={feature.path}
                  href={feature.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative rounded-2xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 ${colors.bg}`}
                >
                  <div className={`mb-4 inline-flex rounded-lg ${colors.iconBg} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-lg font-bold">{feature.name}</h2>
                    <span className="rounded bg-black px-2 py-0.5 text-xs font-bold text-white">
                      {feature.app}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-gray-700">{feature.description}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-900">
                    <span>Open in {feature.app}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </a>
              );
            }

            return (
              <Link
                key={feature.path}
                href={feature.path}
                className={`group relative rounded-2xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 ${colors.bg}`}
              >
                <div className={`mb-4 inline-flex rounded-lg ${colors.iconBg} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-lg font-bold">{feature.name}</h2>
                  <span className="rounded bg-black px-2 py-0.5 text-xs font-bold text-white">
                    {feature.app}
                  </span>
                </div>
                <p className="mb-4 text-sm text-gray-700">{feature.description}</p>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-900">
                  <span>Test Now</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help Card */}
        <div className="glass-panel border-gray-300">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gray-900 p-3">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-3 text-xl font-bold">Quick Testing Guide</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                  <span>Click any feature card to open its dedicated test page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                  <span>Each test page includes API testing + live UI components</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                  <span>Check browser console for detailed API responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                  <span>
                    Full test checklist:{' '}
                    <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs">
                      /STAGING_TEST_CHECKLIST.md
                    </code>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Note about Contact IDs */}
        <div className="mt-6 rounded-xl border-4 border-amber-500 bg-amber-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-500 p-2">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="mb-2 font-bold text-amber-900">About Contact IDs & Test Data</h4>
              <p className="text-sm text-amber-800">
                These features require <strong>real contact data from your database</strong>.
                Contact IDs are UUIDs (e.g.,{' '}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
                  550e8400-e29b-41d4-a716-446655440000
                </code>
                ). For full testing, sign in and upload contacts first, or use the demo mode where
                available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
