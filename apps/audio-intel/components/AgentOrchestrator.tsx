"use client";

import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Instagram, FileText, Mail, Edit, Rocket, Package, Target, AlertTriangle } from 'lucide-react';

interface AgentResult {
  platform?: string;
  contentType?: string;
  text?: string;
  hashtags?: string[];
  callToAction?: string;
  characterCount?: number;
  engagementPrediction?: {
    expectedLikes: number;
    expectedShares: number;
    expectedComments: number;
    engagementRate: string;
  };
  fullText?: string;
  wordCount?: number;
  readabilityScore?: number;
  subject?: string;
  bodyHTML?: string;
  generatedAt?: string;
}

interface WorkflowResult {
  workflowName: string;
  status: string;
  steps: Array<{
    agent: string;
    action: string;
    status: string;
    timestamp: string;
  }>;
  results: Record<string, AgentResult>;
  duration: number;
}

export default function AgentOrchestrator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AgentResult | WorkflowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeAgent = useCallback(async (command: string, type?: string) => {
    setIsGenerating(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command, type }),
      });

      if (!response.ok) {
        throw new Error(`Agent execution failed: ${response.statusText}`);
      }

      const result = await response.json();
      setResults(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Agent execution error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const formatResult = (result: AgentResult | WorkflowResult) => {
    if ('workflowName' in result) {
      // Workflow result
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Workflow: {result.workflowName}
            </h3>
            <p className="text-blue-700 mb-4">
              Status: <span className="font-semibold">{result.status}</span> • 
              Duration: <span className="font-semibold">{result.duration}ms</span> • 
              Steps: <span className="font-semibold">{result.steps.length}</span>
            </p>
            
            <div className="grid gap-4">
              {Object.entries(result.results).map(([key, content]) => (
                <div key={key} className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 capitalize">
                    {key.replace('content_generateSocialContent', 'Social Media Content').replace('_', ' ')}
                  </h4>
                  {content.platform && (
                    <p className="text-sm text-blue-600 mb-2">
                      Platform: <span className="font-medium capitalize">{content.platform}</span>
                    </p>
                  )}
                  {content.text && (
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <p className="text-gray-800 whitespace-pre-wrap">{content.text}</p>
                    </div>
                  )}
                  {content.hashtags && content.hashtags.length > 0 && (
                    <p className="text-sm text-blue-600 mb-2">
                      Hashtags: <span className="text-blue-800">{content.hashtags.join(' ')}</span>
                    </p>
                  )}
                  {content.callToAction && (
                    <p className="text-sm text-blue-600 mb-2">
                      CTA: <span className="font-medium">{content.callToAction}</span>
                    </p>
                  )}
                  {content.characterCount && (
                    <p className="text-xs text-gray-500">
                      {content.characterCount} characters
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Single result
      return (
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
          {result.platform && (
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                {result.platform}
              </span>
              {result.contentType && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
                  {result.contentType}
                </span>
              )}
            </div>
          )}
          
          {result.subject && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Subject Line:</h4>
              <p className="text-lg font-medium text-gray-900">{result.subject}</p>
            </div>
          )}
          
          {result.text && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Content:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{result.text}</p>
              </div>
            </div>
          )}

          {result.fullText && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Full Content:</h4>
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap">{result.fullText}</p>
              </div>
            </div>
          )}

          {result.bodyHTML && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">HTML Email:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: result.bodyHTML }} />
              </div>
            </div>
          )}
          
          {result.hashtags && result.hashtags.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Hashtags:</h4>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((hashtag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {result.callToAction && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Call to Action:</h4>
              <p className="text-blue-600 font-medium">{result.callToAction}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            {result.characterCount && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{result.characterCount}</p>
                <p className="text-sm text-gray-600">Characters</p>
              </div>
            )}
            {result.wordCount && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{result.wordCount}</p>
                <p className="text-sm text-gray-600">Words</p>
              </div>
            )}
            {result.readabilityScore && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{Math.round(result.readabilityScore)}</p>
                <p className="text-sm text-gray-600">Readability</p>
              </div>
            )}
            {result.engagementPrediction && (
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{result.engagementPrediction.engagementRate}</p>
                <p className="text-sm text-gray-600">Est. Engagement</p>
              </div>
            )}
          </div>
          
          {result.engagementPrediction && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Engagement Predictions:</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-red-500">{result.engagementPrediction.expectedLikes}</p>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-500">{result.engagementPrediction.expectedShares}</p>
                  <p className="text-sm text-gray-600">Shares</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-500">{result.engagementPrediction.expectedComments}</p>
                  <p className="text-sm text-gray-600">Comments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-3xl border-2 border-dashed border-blue-300 p-8 mb-8">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">
          🤖 Audio Intel Agent Orchestrator
        </h2>
        <p className="text-blue-700 text-center mb-6">
          AI-powered content generation at Sprint Week velocity
        </p>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button
            onClick={() => executeAgent('generate', 'social-instagram')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3"
          >
            <Instagram className="w-4 h-4 inline mr-2" />Instagram Post
          </Button>
          <Button
            onClick={() => executeAgent('generate', 'press-release')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3"
          >
            <FileText className="w-4 h-4 inline mr-2" />Press Release
          </Button>
          <Button
            onClick={() => executeAgent('generate', 'email-campaign')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3"
          >
            <Mail className="w-4 h-4 inline mr-2" />Email Campaign
          </Button>
          <Button
            onClick={() => executeAgent('generate', 'blog-post')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3"
          >
            <Edit className="w-4 h-4 inline mr-2" />Blog Article
          </Button>
        </div>

        {/* Workflow Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => executeAgent('workflow', 'social-media-blitz')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl"
          >
            <Rocket className="w-4 h-4 inline mr-2" />Social Media Blitz
            <span className="block text-xs mt-1 opacity-90">All platforms</span>
          </Button>
          <Button
            onClick={() => executeAgent('workflow', 'press-release-package')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl"
          >
            <Package className="w-4 h-4 inline mr-2" />Press Package
            <span className="block text-xs mt-1 opacity-90">Complete suite</span>
          </Button>
          <Button
            onClick={() => executeAgent('workflow', 'audio-intel-content-suite')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl"
          >
            <Target className="w-4 h-4 inline mr-2" />Full Content Suite
            <span className="block text-xs mt-1 opacity-90">Everything included</span>
          </Button>
        </div>
      </div>

      {/* Status */}
      {isGenerating && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <p className="text-blue-800 font-medium">Agent processing your request...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Agent Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Generated Content</h3>
            <Button
              onClick={() => setResults(null)}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Clear Results
            </Button>
          </div>
          {formatResult(results)}
        </div>
      )}

      {/* Agent Status */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-800 mb-2">Agent Status</h4>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Content Agent: Active</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Orchestrator: Ready</span>
          </span>
          <span className="text-gray-500">Sprint Week Mode: Enabled</span>
        </div>
      </div>
    </div>
  );
}