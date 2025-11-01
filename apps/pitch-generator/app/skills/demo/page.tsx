'use client';

/**
 * Skills Demo Page
 * Quick test of VoiceGuardSkill integration
 */

import { useState } from 'react';

export default function SkillsDemo() {
  const [text, setText] = useState(
    'Leverage our innovative solution to organize your music promotion workflow!'
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkVoice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/skills/voice-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">🎵 Skills System Demo</h1>
          <p className="text-gray-600 mb-6">
            Test VoiceGuardSkill - UK voice enforcement with Haiku
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text to Check:</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-32 font-mono text-sm"
                placeholder="Enter text to check..."
              />
            </div>

            <button
              onClick={checkVoice}
              disabled={loading || !text}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Checking Voice...' : 'Check UK Voice Compliance'}
            </button>

            {result && (
              <div className="mt-6 space-y-4">
                {result.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">Error:</p>
                    <p className="text-red-600">{result.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Compliance Score */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Compliance Score:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-48 bg-gray-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full transition-all ${
                                result.complianceScore >= 0.8
                                  ? 'bg-green-500'
                                  : result.complianceScore >= 0.6
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{
                                width: `${result.complianceScore * 100}%`,
                              }}
                            />
                          </div>
                          <span className="font-bold text-lg">
                            {(result.complianceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Original vs Corrected */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="font-medium text-red-800 mb-2">Original:</p>
                        <p className="text-sm text-gray-700 font-mono">{result.original}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-medium text-green-800 mb-2">Corrected:</p>
                        <p className="text-sm text-gray-700 font-mono">{result.corrected}</p>
                      </div>
                    </div>

                    {/* Changes */}
                    {result.changes && result.changes.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="font-medium text-blue-800 mb-2">
                          Changes ({result.changes.length}):
                        </p>
                        <ul className="space-y-1">
                          {result.changes.map((change: any, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="font-mono bg-red-100 px-2 py-0.5 rounded">
                                {change.from}
                              </span>
                              <span>→</span>
                              <span className="font-mono bg-green-100 px-2 py-0.5 rounded">
                                {change.to}
                              </span>
                              <span className="text-gray-500 text-xs">({change.reason})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {result.warnings && result.warnings.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="font-medium text-yellow-800 mb-2">
                          Warnings ({result.warnings.length}):
                        </p>
                        <ul className="space-y-1">
                          {result.warnings.map((warning: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700">
                              ⚠️ {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="font-medium text-purple-800 mb-2">Suggestions:</p>
                        <ul className="space-y-1">
                          {result.suggestions.map((suggestion: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700">
                              💡 {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Example Texts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
            <div className="grid gap-2">
              <button
                onClick={() =>
                  setText(
                    'Leverage our innovative solution to organize your music promotion workflow!'
                  )
                }
                className="text-left text-sm bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
              >
                🔴 Bad: Corporate speak + US spelling
              </button>
              <button
                onClick={() =>
                  setText(
                    'Built by someone with 5+ years of BBC Radio 1 promotion experience. We organise your contacts and save you 15 hours.'
                  )
                }
                className="text-left text-sm bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
              >
                🟢 Good: Authentic UK voice
              </button>
              <button
                onClick={() => setText('We analyze and organize your data to optimize results.')}
                className="text-left text-sm bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
              >
                🟡 Medium: Just US spelling issues
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Powered by Claude 3.5 Haiku • 73% cheaper than Sonnet • 3-5x faster</p>
        </div>
      </div>
    </div>
  );
}
