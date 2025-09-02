'use client';

import { useState, useEffect } from 'react';

interface PostTemplate {
  id: string;
  name: string;
  category: 'announcement' | 'beta-update' | 'feature' | 'launch';
  content: string;
  hashtags: string[];
  platforms: string[];
}

interface ScheduledPost {
  id: string;
  platforms: string[];
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
}

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter (X)', icon: '𝕏' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'bluesky', name: 'Blue Sky', icon: '🦋' },
  { id: 'threads', name: 'Threads', icon: '🧵' },
  { id: 'facebook', name: 'Facebook', icon: '📘' }
];

export default function SocialPostingPage() {
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin', 'bluesky']);
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchScheduledPosts();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/social-media/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/social-media/schedule');
      const data = await response.json();
      if (data.success) {
        setScheduledPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    }
  };

  const handleTemplateSelect = (template: PostTemplate) => {
    setSelectedTemplate(template);
    setContent(template.content);
    setHashtags(template.hashtags);
    setSelectedPlatforms(template.platforms);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedulePost = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      alert('Please enter content and select at least one platform');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/social-media/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          content,
          hashtags,
          scheduledTime: scheduledTime || undefined,
          postType: selectedTemplate?.category || 'custom',
          template: selectedTemplate?.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setContent('');
        setHashtags([]);
        setSelectedTemplate(null);
        setScheduledTime('');
        fetchScheduledPosts();
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Failed to schedule post: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Scheduling failed:', error);
      alert('Failed to schedule post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #4299e1, #667eea)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1a202c' }}>
                Social Media Command Centre
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>
                Schedule posts across X, LinkedIn, and Blue Sky
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: '#4a5568',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: '#48bb78',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          zIndex: 50
        }}>
          ✅ Post scheduled successfully!
        </div>
      )}

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a202c' }}>
              Templates
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  style={{
                    background: selectedTemplate?.id === template.id ? '#ebf8ff' : 'white',
                    border: selectedTemplate?.id === template.id ? '2px solid #4299e1' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <h4 style={{ fontWeight: '600', fontSize: '0.875rem', color: '#1a202c', margin: '0 0 0.5rem 0' }}>
                    {template.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.5rem' }}>
                    {template.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a202c' }}>
                Select Platforms
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.75rem'
              }}>
                {PLATFORMS.map((platform) => (
                  <label
                    key={platform.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: selectedPlatforms.includes(platform.id) ? '2px solid #4299e1' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedPlatforms.includes(platform.id) ? '#ebf8ff' : 'white',
                      minHeight: '60px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.125rem' }}>{platform.icon}</span>
                      <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a202c' }}>
                        {platform.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a202c' }}>
                Post Content
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.5rem', display: 'block' }}>
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      minHeight: '150px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.5rem', display: 'block' }}>
                    Schedule Time (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleSchedulePost}
                disabled={isLoading || !content.trim() || selectedPlatforms.length === 0}
                style={{
                  width: '100%',
                  background: isLoading || !content.trim() || selectedPlatforms.length === 0 ? '#a0aec0' : 'linear-gradient(135deg, #4299e1, #667eea)',
                  color: 'white',
                  fontWeight: '700',
                  padding: '1rem 1.5rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading || !content.trim() || selectedPlatforms.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  minHeight: '60px'
                }}
              >
                {isLoading ? 'Scheduling...' : `${scheduledTime ? 'Schedule' : 'Post Now'} to ${selectedPlatforms.length} Platform${selectedPlatforms.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}