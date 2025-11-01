'use client';

import { useState } from 'react';
import { BarChart3, Loader2, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';

interface AnalysisResult {
  score: number;
  grade: 'excellent' | 'good' | 'needs_work' | 'poor';
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  toneAnalysis: {
    formality: 'too_formal' | 'professional' | 'casual' | 'too_casual';
    enthusiasm: 'high' | 'moderate' | 'low';
    personalisation: 'high' | 'moderate' | 'low';
  };
  lengthAnalysis: {
    wordCount: number;
    isOptimal: boolean;
    recommendation: string;
  };
}

export function PitchAnalyser({
  pitchBody,
  contactName,
  tone,
  onApplySuggestions,
}: {
  pitchBody: string;
  contactName?: string;
  tone?: string;
  onApplySuggestions?: (improvedPitch: string) => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applyingChanges, setApplyingChanges] = useState(false);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/pitch/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchBody,
          subjectLine: '',
          contactType: contactName || 'General',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze pitch');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleApplySuggestions() {
    if (!analysis || !onApplySuggestions) return;

    setApplyingChanges(true);
    setError(null);

    try {
      const response = await fetch('/api/pitch/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchBody,
          suggestions: analysis.suggestions,
          weaknesses: analysis.weaknesses,
          toneAnalysis: analysis.toneAnalysis,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to apply suggestions');
      }

      const data = await response.json();
      onApplySuggestions(data.improvedPitch);
      setAnalysis(null); // Reset analysis so user can re-analyze the improved version
    } catch (err: any) {
      setError(err.message || 'Failed to apply suggestions');
    } finally {
      setApplyingChanges(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadge = (grade: string) => {
    const styles = {
      excellent: 'bg-green-100 text-green-800 border-green-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      needs_work: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      poor: 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[grade as keyof typeof styles] || styles.needs_work;
  };

  return (
    <div className="glass-panel px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand-amber" />
          <h3 className="text-lg font-semibold">AI Pitch Analysis</h3>
        </div>
        {!analysis && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !pitchBody}
            className="cta-button text-sm flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4" />
                Analyze Pitch
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          {/* Score */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-gray-50 px-6 py-4">
            <div>
              <p className="text-sm text-gray-900/60">Overall Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </p>
            </div>
            <span
              className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${getGradeBadge(analysis.grade)}`}
            >
              {analysis.grade.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-green-900">Strengths</h4>
              </div>
              <ul className="space-y-1 text-sm text-green-800">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses.length > 0 && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">Areas to Improve</h4>
              </div>
              <ul className="space-y-1 text-sm text-yellow-800">
                {analysis.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-yellow-600">!</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Suggestions</h4>
              </div>
              <ul className="space-y-1 text-sm text-blue-800">
                {analysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-600">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tone & Length Analysis */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-900/60">
                Tone Analysis
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Formality:</span>{' '}
                  {analysis.toneAnalysis.formality.replace('_', ' ')}
                </p>
                <p>
                  <span className="font-medium">Enthusiasm:</span>{' '}
                  {analysis.toneAnalysis.enthusiasm}
                </p>
                <p>
                  <span className="font-medium">Personalisation:</span>{' '}
                  {analysis.toneAnalysis.personalisation}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-900/60">
                Length Analysis
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Word count:</span>{' '}
                  {analysis.lengthAnalysis.wordCount}
                </p>
                <p>
                  <span className="font-medium">Optimal:</span>{' '}
                  {analysis.lengthAnalysis.isOptimal ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-900/70">{analysis.lengthAnalysis.recommendation}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {onApplySuggestions && (
              <button
                onClick={handleApplySuggestions}
                disabled={applyingChanges}
                className="cta-button flex-1 text-sm flex items-center justify-center gap-2"
              >
                {applyingChanges ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Apply Suggestions
                  </>
                )}
              </button>
            )}
            <button onClick={() => setAnalysis(null)} className="subtle-button flex-1 text-sm">
              Analyze Again
            </button>
          </div>
        </div>
      )}

      {!analysis && !analyzing && !error && (
        <p className="text-sm text-gray-900/60">
          Get AI-powered feedback on your pitch's tone, clarity, and effectiveness.
        </p>
      )}
    </div>
  );
}
