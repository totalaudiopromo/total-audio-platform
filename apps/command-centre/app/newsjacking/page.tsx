'use client';

import React, { useState, useEffect } from 'react';

interface GeneratedContent {
  id: string;
  originalStory: {
    title: string;
    source: string;
    publishedAt: Date;
    relevanceScore: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published';
  urgency: 'immediate' | 'same_day' | 'this_week';
  voiceScore: number;
  estimatedReach: number;
  generatedAt: Date;
  newsletterSections: any[];
}

export default function NewsjackingPage() {
  const [pendingContent, setPendingContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'published'>('pending');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newsjacking/content');
      const result = await response.json();
      
      if (result.success) {
        const parsedContent = result.data.map((item: any) => ({
          id: item.id,
          originalStory: {
            title: item.originalStory.title,
            source: item.originalStory.source,
            publishedAt: new Date(item.originalStory.publishedAt),
            relevanceScore: item.originalStory.relevanceScore
          },
          status: item.status,
          urgency: item.unsignedAngle.urgency === 'immediate' ? 'immediate' : 
                   item.unsignedAngle.urgency === 'high' ? 'same_day' : 'this_week',
          voiceScore: item.voiceScore,
          estimatedReach: 25000,
          generatedAt: new Date(item.createdAt),
          newsletterSections: item.newsletterSections
        }));
        setPendingContent(parsedContent);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = pendingContent.filter(content => {
    if (filter === 'all') return true;
    return content.status === filter;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
            <div style={{ fontSize: '1.125rem' }}>Loading newsjacking content...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
            Content Review
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Review and approve AI-generated content from trending music industry stories
          </p>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', width: 'fit-content' }}>
            {['all', 'pending', 'approved', 'published'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  backgroundColor: filter === filterOption ? 'white' : 'transparent',
                  color: filter === filterOption ? '#111827' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: filter === filterOption ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (filter !== filterOption) {
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== filterOption) {
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} 
                ({pendingContent.filter(c => filterOption === 'all' || c.status === filterOption).length})
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Content List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Generated Content</h2>
            
            {filteredContent.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
                No content to review
              </div>
            ) : (
              filteredContent.map((content) => (
                <div 
                  key={content.id}
                  style={{
                    border: '1px solid',
                    borderColor: selectedContent?.id === content.id ? '#111827' : '#e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'white',
                    boxShadow: selectedContent?.id === content.id ? '0 8px 25px -8px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => setSelectedContent(content)}
                  onMouseEnter={(e) => {
                    if (selectedContent?.id !== content.id) {
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedContent?.id !== content.id) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: 
                        content.status === 'pending' ? '#fef3c7' :
                        content.status === 'approved' ? '#d1fae5' :
                        content.status === 'rejected' ? '#fee2e2' :
                        content.status === 'scheduled' ? '#dbeafe' :
                        content.status === 'published' ? '#e9d5ff' : '#f3f4f6',
                      color:
                        content.status === 'pending' ? '#92400e' :
                        content.status === 'approved' ? '#065f46' :
                        content.status === 'rejected' ? '#991b1b' :
                        content.status === 'scheduled' ? '#1e40af' :
                        content.status === 'published' ? '#6b21a8' : '#374151'
                    }}>
                      {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                    </span>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor:
                        content.urgency === 'immediate' ? '#fee2e2' :
                        content.urgency === 'same_day' ? '#fed7aa' : '#fef3c7',
                      color:
                        content.urgency === 'immediate' ? '#991b1b' :
                        content.urgency === 'same_day' ? '#c2410c' : '#92400e'
                    }}>
                      {content.urgency.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '0.5rem', lineHeight: '1.25' }}>
                    {content.originalStory.title}
                  </h3>
                  
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {content.originalStory.source} • {content.originalStory.relevanceScore.toFixed(2)} relevance
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>{content.newsletterSections.length} sections</span>
                    <span>Voice: {(content.voiceScore * 100).toFixed(0)}%</span>
                    <span>{content.estimatedReach.toLocaleString()} reach</span>
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {new Date(content.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Content Preview */}
          <div>
            {selectedContent ? (
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {selectedContent.originalStory.title}
                  </h2>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    {selectedContent.originalStory.source} • Content Review
                  </div>
                  
                  <div style={{ backgroundColor: '#fefce8', border: '1px solid #fcd34d', borderRadius: '0.5rem', padding: '1rem' }}>
                    <h3 style={{ fontWeight: '500', color: '#78350f', marginBottom: '0.5rem' }}>Ready for Review</h3>
                    <p style={{ color: '#92400e' }}>
                      This content has been generated and is ready for your review and approval.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    Content preview would appear here
                  </div>
                </div>

                {selectedContent.status === 'pending' && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button style={{ backgroundColor: '#059669', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}>
                        Approve & Publish
                      </button>
                      <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
                        Schedule
                      </button>
                      <button style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}>
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: '#6b7280' }}>
                  Select content from the list to preview and review
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}