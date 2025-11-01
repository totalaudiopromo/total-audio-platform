import React, { useState } from 'react';

interface ClaudeResponse {
  content: string;
  error?: string;
}

export default function ClaudeIntegration() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<ClaudeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');

  const templates = {
    'press-release': 'Write a press release for [CLIENT] about [NEWS] in the [INDUSTRY] industry.',
    'pitch-email': 'Write a pitch email to [JOURNALIST] at [OUTLET] about [STORY] for [CLIENT].',
    'social-post': 'Create a social media post for [CLIENT] about [TOPIC] that engages [AUDIENCE].',
    'email-campaign': 'Write an email campaign for [CLIENT] targeting [AUDIENCE] about [TOPIC].',
    custom: '',
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (template !== 'custom') {
      setPrompt(templates[template as keyof typeof templates]);
    } else {
      setPrompt('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error calling Claude:', error);
      setResponse({ content: '', error: 'Failed to get response from Claude' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (response?.content) {
      navigator.clipboard.writeText(response.content);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Integrations
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Claude AI Integration
                </h1>
                <p className="text-gray-600 text-sm">
                  AI-powered content generation and personalization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Content</h2>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template (Optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={e => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="custom">Custom Prompt</option>
                <option value="press-release">Press Release</option>
                <option value="pitch-email">Pitch Email</option>
                <option value="social-post">Social Media Post</option>
                <option value="email-campaign">Email Campaign</option>
              </select>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe what you want Claude to generate..."
                />
              </div>

              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
            </form>
          </div>

          {/* Response Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>
              {response?.content && (
                <button
                  onClick={handleCopyResponse}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Copy to Clipboard
                </button>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Generating content...</span>
              </div>
            )}

            {response?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-red-800">{response.error}</span>
                </div>
              </div>
            )}

            {response?.content && !response.error && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {response.content}
                </div>
              </div>
            )}

            {!response && !loading && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🤖</div>
                <p>Generated content will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Press Releases</h4>
              <p>Include the client name, news details, and industry context for best results.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Pitch Emails</h4>
              <p>Specify the journalist, outlet, story angle, and your client information.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Social Posts</h4>
              <p>Mention the target audience and desired tone (professional, casual, etc.).</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Email Campaigns</h4>
              <p>Include the target audience, campaign goal, and key messaging points.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
