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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a202c', margin: '0 0 0.5rem 0' }}>
              🤖 SaaS Marketing Agent
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Automated content generation for your SaaS products
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            style={{
              background: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            ← Back
          </button>
        </div>

        {/* Product & Platform Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              Product
            </label>
            <select 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'white'
              }}
            >
              <option value="audio-intel">Audio Intel</option>
              <option value="playlist-pulse">Playlist Pulse</option>
              <option value="command-centre">Command Centre</option>
              <option value="voice-echo">Voice Echo</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              Platform
            </label>
            <select 
              value={selectedPlatform} 
              onChange={(e) => setSelectedPlatform(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'white'
              }}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              Content Type
            </label>
            <select 
              value={contentType} 
              onChange={(e) => setContentType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'white'
              }}
            >
              <option value="update">Update</option>
              <option value="story">Story</option>
              <option value="thread">Thread</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button
            onClick={() => handleQuickAction('generate_social')}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            📱 Generate Social Post
          </button>

          <button
            onClick={() => handleQuickAction('generate_blog', { 
              topic: { title: 'contact enrichment automation', keywords: ['music industry tools'] }
            })}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            📝 Generate SEO Blog
          </button>

          <button
            onClick={() => handleQuickAction('generate_calendar', { weeks: 2 })}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            📅 Generate Calendar
          </button>

          <button
            onClick={() => handleQuickAction('health_check')}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            🏥 Health Check
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #4299e1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontWeight: '600' }}>Generating content...</p>
        </div>
      )}

      {/* Results */}
      {content && !loading && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
              Generated Content
            </h2>
            <span style={{
              background: content.success ? '#d1fae5' : '#fed7d7',
              color: content.success ? '#047857' : '#c53030',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {content.success ? '✅ Success' : '❌ Failed'}
            </span>
          </div>

          {content.success ? (
            <div>
              <div style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}>
                {formatContent(content.result)}
              </div>

              {/* Copy to clipboard button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formatContent(content.result));
                  alert('Content copied to clipboard!');
                }}
                style={{
                  background: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                📋 Copy to Clipboard
              </button>
            </div>
          ) : (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fca5a5',
              borderRadius: '8px',
              padding: '1rem',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              Error: {content.result?.error || 'Unknown error occurred'}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
          
          button {
            white-space: normal !important;
          }
        }
      `}</style>
    </div>
  );
}