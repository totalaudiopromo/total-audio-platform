'use client';

import { useState, useEffect } from 'react';

interface MarketingContent {
  success: boolean;
  action: string;
  product: string;
  result: any;
  timestamp: string;
}

export default function SaaSMarketingPage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<MarketingContent | null>(null);
  const [selectedProduct, setSelectedProduct] = useState('audio-intel');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [contentType, setContentType] = useState('update');

  // Quick action handlers
  const handleQuickAction = async (action: string, customParams = {}) => {
    setLoading(true);
    try {
      console.log(`🚀 Executing ${action}...`);
      
      const response = await fetch('/api/saas-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          product: selectedProduct,
          platform: selectedPlatform,
          contentType,
          ...customParams
        })
      });

      const result = await response.json();
      setContent(result);
      
      if (result.success) {
        console.log(`✅ ${action} completed successfully`);
      } else {
        console.error(`❌ ${action} failed:`, result.error);
      }
    } catch (error) {
      console.error(`❌ ${action} failed:`, error);
      setContent({
        success: false,
        action,
        product: selectedProduct,
        result: { error: 'Network error' },
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: any) => {
    if (!content) return '';
    
    if (typeof content === 'string') return content;
    if (content.text) return content.text;
    if (content.title) return `${content.title}\n\n${content.content?.substring(0, 200)}...`;
    
    return JSON.stringify(content, null, 2);
  };

  return (
    <div className="postcraft-page space-y-8">
        {/* Header */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SaaS Marketing Agent
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Automated content generation for your SaaS products
            </p>
            <div className="flex items-center justify-center space-x-3 px-4 py-2 bg-green-50/80 backdrop-blur-sm rounded-full border border-green-200/50 max-w-fit mx-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">AI-powered content generation</span>
            </div>
          </div>

          {/* Product & Platform Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="audio-intel">Audio Intel</option>
                <option value="playlist-pulse">Playlist Pulse</option>
                <option value="command-centre">Command Centre</option>
                <option value="voice-echo">Voice Echo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select 
                value={contentType} 
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="update">Update</option>
                <option value="story">Story</option>
                <option value="thread">Thread</option>
              </select>
            </div>
          </div>
        </div>
        {/* Quick link to unified Social Hub to avoid overlap */}
        <div className="intel-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Prefer the streamlined Social Hub?</h2>
            <p style={{ color: 'var(--intel-gray-600)' }}>Create, schedule and analyse posts in one place.</p>
          </div>
          <a href="/social-media-hub" className="intel-button">Open Social Hub</a>
        </div>

        {/* Quick Actions */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Generate content for your SaaS products instantly</p>
          </div>
          
          <div className="postcraft-actions-grid">
            <button
              onClick={() => handleQuickAction('generate_social')}
              disabled={loading}
              className={`postcraft-action-card postcraft-action-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="postcraft-action-icon" />
              <div className="postcraft-action-content">
                <h3>Generate Social Post</h3>
                <p>Create engaging social content</p>
              </div>
              <div className="postcraft-action-arrow">→</div>
            </button>

            <button
              onClick={() => handleQuickAction('generate_blog', { 
                topic: { title: 'contact enrichment automation', keywords: ['music industry tools'] }
              })}
              disabled={loading}
              className={`postcraft-action-card postcraft-action-success ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="postcraft-action-icon" />
              <div className="postcraft-action-content">
                <h3>Generate SEO Blog</h3>
                <p>Create optimized blog content</p>
              </div>
              <div className="postcraft-action-arrow">→</div>
            </button>

            <button
              onClick={() => handleQuickAction('generate_calendar', { weeks: 2 })}
              disabled={loading}
              className={`postcraft-action-card postcraft-action-orange ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="postcraft-action-icon" />
              <div className="postcraft-action-content">
                <h3>Generate Calendar</h3>
                <p>Plan your content schedule</p>
              </div>
              <div className="postcraft-action-arrow">→</div>
            </button>

            <button
              onClick={() => handleQuickAction('health_check')}
              disabled={loading}
              className={`postcraft-action-card postcraft-action-purple ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="postcraft-action-icon" />
              <div className="postcraft-action-content">
                <h3>Health Check</h3>
                <p>Monitor system status</p>
              </div>
              <div className="postcraft-action-arrow">→</div>
            </button>
        </div>
      </div>

        {/* Loading State */}
        {loading && (
          <div className="postcraft-loading">
            <div className="postcraft-spinner"></div>
            <h2>Generating Content...</h2>
            <p>AI is creating your marketing content</p>
          </div>
        )}

        {/* Results */}
        {content && !loading && (
          <div className="postcraft-section">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated Content</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                content.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {content.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>

            {content.success ? (
              <div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {formatContent(content.result)}
                  </pre>
                </div>

                {/* Copy to clipboard button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formatContent(content.result));
                    alert('Content copied to clipboard!');
                  }}
                  className="postcraft-button"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                Error: {content.result?.error || 'Unknown error occurred'}
              </div>
            )}
          </div>
        )}
      </div>
  );
}