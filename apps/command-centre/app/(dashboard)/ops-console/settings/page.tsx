'use client';

import { Settings, Shield, Bell, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">Ops Console Settings</h2>
        </div>
        <p className="text-sm text-gray-600">Configure system settings and integrations</p>
      </div>

      {/* Security Settings */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-black text-gray-900">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">CSP Headers</div>
              <div className="text-sm text-gray-600">Content Security Policy configuration</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">HSTS</div>
              <div className="text-sm text-gray-600">HTTP Strict Transport Security</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Environment Validation</div>
              <div className="text-sm text-gray-600">Zod schema for env variables</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-black text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Telegram Bot</div>
              <div className="text-sm text-gray-600">Agent health and growth summaries</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Not Connected
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Email Alerts</div>
              <div className="text-sm text-gray-600">System alerts via email</div>
            </div>
            <span className="px-3 py-1 bg-gray-100 border-2 border-gray-400 rounded-lg text-xs font-bold text-gray-600 uppercase">
              Disabled
            </span>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-black text-gray-900">Database</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Supabase Connection</div>
              <div className="text-sm text-gray-600">Phase 9B observability tables</div>
            </div>
            <span className="px-3 py-1 bg-green-100 border-2 border-green-600 rounded-lg text-xs font-bold text-green-800 uppercase">
              Connected
            </span>
          </div>
          <div className="p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
            <div className="text-xs font-bold text-blue-900 uppercase mb-2">Connected Tables</div>
            <div className="grid grid-cols-1 gap-1">
              <div className="text-sm text-blue-800">
                <code className="font-mono">agent_events</code> - Agent execution logs
              </div>
              <div className="text-sm text-blue-800">
                <code className="font-mono">feedback_events</code> - User feedback
              </div>
              <div className="text-sm text-blue-800">
                <code className="font-mono">conversion_events</code> - Revenue tracking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Analytics */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-black text-gray-900">SEO & Analytics</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Sitemap</div>
              <div className="text-sm text-gray-600">/sitemap.xml generation</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Robots.txt</div>
              <div className="text-sm text-gray-600">Search engine directives</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Plausible Analytics</div>
              <div className="text-sm text-gray-600">Privacy-focused analytics</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-xs font-bold text-yellow-800 uppercase">
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Phase 9D Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">Phase 9D Implementation Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase mb-2">Completed</div>
            <ul className="space-y-1 text-sm">
              <li className="text-green-600">✓ Ops console UI structure</li>
              <li className="text-green-600">✓ Agent monitoring dashboard</li>
              <li className="text-green-600">✓ Social media hub</li>
              <li className="text-green-600">✓ Feedback intelligence</li>
              <li className="text-green-600">✓ Growth tracking</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase mb-2">Pending</div>
            <ul className="space-y-1 text-sm">
              <li className="text-yellow-600">◦ Security headers</li>
              <li className="text-yellow-600">◦ Env validation (Zod)</li>
              <li className="text-yellow-600">◦ Telegram integration</li>
              <li className="text-yellow-600">◦ SEO assets</li>
              <li className="text-yellow-600">◦ API endpoint wiring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
