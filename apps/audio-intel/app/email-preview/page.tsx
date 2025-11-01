'use client';

import { useState } from 'react';
import {
  betaWelcomeEmail,
  betaEndingEmail,
  betaFinalEmail,
  type EmailTemplateData,
} from '@/utils/emailTemplates';

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [sampleData, setSampleData] = useState<EmailTemplateData>({
    firstName: 'Alex',
    email: 'alex@example.com',
    betaDaysLeft: 4,
    pricingUrl: 'https://intel.totalaudiopromo.com/pricing',
    upgradeUrl: 'https://intel.totalaudiopromo.com/pricing',
    unsubscribeUrl: 'https://intel.totalaudiopromo.com/unsubscribe',
  });

  const templates = {
    welcome: {
      name: 'Beta Welcome Email',
      description: 'Sent immediately after beta signup',
      generator: betaWelcomeEmail,
    },
    ending: {
      name: 'Beta Ending Email',
      description: 'Sent 4 days before beta ends',
      generator: betaEndingEmail,
    },
    final: {
      name: 'Beta Final Email',
      description: 'Sent on final day of beta',
      generator: betaFinalEmail,
    },
  };

  const currentTemplate = templates[selectedTemplate as keyof typeof templates];
  const emailHtml = currentTemplate.generator(sampleData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎵 Audio Intel Email Templates</h1>
          <p className="text-gray-600">
            Professional HTML email templates with perfect spacing and branding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Template Selector</h3>

              <div className="space-y-3 mb-6">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTemplate === key
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Sample Data</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-gray-600 mb-1">First Name</label>
                    <input
                      type="text"
                      value={sampleData.firstName || ''}
                      onChange={e => setSampleData({ ...sampleData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Days Left</label>
                    <input
                      type="number"
                      value={sampleData.betaDaysLeft || 4}
                      onChange={e =>
                        setSampleData({ ...sampleData, betaDaysLeft: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-yellow-800 mb-2">✅ Email Improvements</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Professional spacing & typography</li>
                <li>• Custom branded signature</li>
                <li>• Mobile-responsive design</li>
                <li>• No ConvertKit branding required</li>
                <li>• Consistent Audio Intel branding</li>
              </ul>
            </div>
          </div>

          {/* Email Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-semibold">{currentTemplate.name}</h3>
                <p className="text-gray-600 text-sm">{currentTemplate.description}</p>
              </div>

              <div className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={emailHtml}
                    className="w-full h-[800px] border-0"
                    title="Email Preview"
                  />
                </div>
              </div>

              <div className="border-t px-6 py-4 bg-gray-50">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const blob = new Blob([emailHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedTemplate}-email.html`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download HTML
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(emailHtml);
                      alert('HTML copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Copy HTML
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Implementation Options</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Option 1: Replace ConvertKit Templates (Recommended)
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Copy the HTML from above and paste it into your ConvertKit email sequences. This
                keeps your existing automation while improving the design.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use ConvertKit's custom HTML editor</li>
                <li>• Replace existing template content</li>
                <li>• Keep your automation triggers</li>
                <li>• Upgrade to Creator Plan ($29/mo) to remove branding</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-green-900 mb-2">Option 2: Custom Email System</h4>
              <p className="text-gray-600 text-sm mb-3">
                Use your existing Resend integration with these templates for full control.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Import <code>emailTemplates.ts</code>
                </li>
                <li>
                  • Use <code>sendCustomEmail()</code> function
                </li>
                <li>• Schedule with your own cron jobs</li>
                <li>• Zero external branding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
