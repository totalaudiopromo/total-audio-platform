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
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);

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
          urgency: item.unsignedAngle?.urgency === 'immediate' ? 'immediate' : 
                   item.unsignedAngle?.urgency === 'high' ? 'same_day' : 'this_week',
          voiceScore: item.voiceScore,
          estimatedReach: 25000,
          generatedAt: new Date(item.createdAt),
          newsletterSections: item.newsletterSections || []
        }));
        setContent(parsedContent);
        if (parsedContent.length > 0) {
          setSelectedContent(parsedContent[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveContent = async (contentId: string) => {
    try {
      const response = await fetch('/api/newsjacking/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', contentId })
      });
      
      if (response.ok) {
        loadContent();
      }
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Minimal Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-light text-black mb-2">Industry Intelligence</h1>
          <p className="text-gray-600">Real-time opportunities from music industry news</p>
        </div>

        {content.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No opportunities found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Story List - Mobile First */}
            <div className="space-y-3">
              {content.slice(0, 5).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedContent(item)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedContent?.id === item.id 
                      ? 'bg-black text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-black'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.urgency === 'immediate' ? 'bg-red-100 text-red-800' :
                      item.urgency === 'same_day' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    } ${selectedContent?.id === item.id ? 'bg-white text-black' : ''}`}>
                      {item.urgency.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                    {item.originalStory.title}
                  </h3>
                  
                  <div className={`text-xs ${selectedContent?.id === item.id ? 'text-gray-300' : 'text-gray-500'}`}>
                    {item.originalStory.source}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Preview - Clean & Focused */}
            <div>
              {selectedContent ? (
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-black mb-2 leading-tight">
                      {selectedContent.originalStory.title}
                    </h2>
                    <div className="text-sm text-gray-600">
                      {selectedContent.originalStory.source} • {selectedContent.originalStory.relevanceScore.toFixed(2)} relevance
                    </div>
                  </div>

                  <div className="p-6">
                    {selectedContent.newsletterSections.length > 0 ? (
                      <div className="space-y-4">
                        {selectedContent.newsletterSections.slice(0, 1).map((section: any, index: number) => (
                          <div key={index}>
                            <h4 className="font-medium text-black mb-2">{section.title}</h4>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {section.content.split('\n').map((paragraph: string, pIndex: number) => 
                                paragraph.trim() && (
                                  <p key={pIndex} className="mb-2">{paragraph}</p>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Content being generated...
                      </div>
                    )}
                  </div>

                  {selectedContent.status === 'pending' && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      <button 
                        onClick={() => approveContent(selectedContent.id)}
                        className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                      >
                        Approve & Schedule
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Select a story to preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}