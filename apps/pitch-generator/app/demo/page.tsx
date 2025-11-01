'use client';

/**
 * Public Skills Demo - No Login Required
 * Test VoiceGuardSkill with Haiku
 */

import { useState } from 'react';

export default function PublicSkillsDemo() {
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
    } catch (error: any) {
      console.error('Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Skills System Demo
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              VoiceGuardSkill - UK Voice Enforcement with Claude 3.5 Haiku
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                73% Cheaper
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                3-5x Faster
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                No Login Required
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Text to Check:
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl h-32 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="Enter text to check UK voice compliance..."
              />
            </div>

            {/* Check Button */}
            <button
              onClick={checkVoice}
              disabled={loading || !text}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Checking Voice...
                </span>
              ) : (
                '🎵 Check UK Voice Compliance'
              )}
            </button>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                {result.error ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <p className="text-red-800 font-semibold text-lg mb-2">Error:</p>
                    <p className="text-red-600">{result.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Compliance Score */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-700 text-lg">
                          Compliance Score:
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-64 bg-gray-200 rounded-full h-6">
                            <div
                              className={`h-6 rounded-full transition-all duration-1000 ${
                                result.complianceScore >= 0.8
                                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                                  : result.complianceScore >= 0.6
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                    : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{
                                width: `${result.complianceScore * 100}%`,
                              }}
                            />
                          </div>
                          <span className="font-bold text-2xl">
                            {(result.complianceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {result.complianceScore >= 0.8
                          ? '✅ Excellent! Authentic UK music industry voice.'
                          : result.complianceScore >= 0.6
                            ? '⚠️ Good, but needs some improvements.'
                            : '❌ Needs work - too corporate or US spelling.'}
                      </p>
                    </div>

                    {/* Original vs Corrected */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                        <p className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">❌</span> Original:
                        </p>
                        <p className="text-sm text-gray-700 font-mono leading-relaxed">
                          {result.original}
                        </p>
                      </div>
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                        <p className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">✅</span> Corrected:
                        </p>
                        <p className="text-sm text-gray-700 font-mono leading-relaxed">
                          {result.corrected}
                        </p>
                      </div>
                    </div>

                    {/* Changes */}
                    {result.changes && result.changes.length > 0 && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                        <p className="font-semibold text-blue-800 mb-4 text-lg">
                          📝 Changes Made ({result.changes.length}):
                        </p>
                        <div className="space-y-3">
                          {result.changes.map((change: any, i: number) => (
                            <div
                              key={i}
                              className="bg-white rounded-lg p-4 flex items-center gap-3 border border-blue-100"
                            >
                              <span className="font-mono bg-red-100 text-red-800 px-3 py-1.5 rounded-lg font-semibold">
                                {change.from}
                              </span>
                              <span className="text-blue-500 text-xl">→</span>
                              <span className="font-mono bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-semibold">
                                {change.to}
                              </span>
                              <span className="text-gray-600 text-sm flex-1">{change.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {result.warnings && result.warnings.length > 0 && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                        <p className="font-semibold text-yellow-800 mb-4 text-lg">
                          ⚠️ Warnings ({result.warnings.length}):
                        </p>
                        <ul className="space-y-2">
                          {result.warnings.map((warning: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-yellow-600 mt-0.5">⚠️</span>
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                        <p className="font-semibold text-purple-800 mb-4 text-lg">
                          💡 Suggestions:
                        </p>
                        <ul className="space-y-2">
                          {result.suggestions.map((suggestion: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-purple-600 mt-0.5">💡</span>
                              <span>{suggestion}</span>
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
          <div className="mt-10 pt-8 border-t-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-xl">🎯</span> Try these examples:
            </p>
            <div className="grid gap-3">
              <button
                onClick={() =>
                  setText(
                    'Leverage our innovative solution to organize your music promotion workflow!'
                  )
                }
                className="text-left text-sm bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 p-4 rounded-xl transition-all border-2 border-red-200 hover:border-red-300"
              >
                <span className="font-semibold text-red-700 block mb-1">
                  🔴 Bad Example (Corporate + US Spelling)
                </span>
                <span className="text-gray-600">
                  &ldquo;Leverage our innovative solution to organize...&rdquo;
                </span>
              </button>
              <button
                onClick={() =>
                  setText(
                    'Built by someone with 5+ years of BBC Radio 1 promotion experience. We organise your contacts and save you 15 hours.'
                  )
                }
                className="text-left text-sm bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-4 rounded-xl transition-all border-2 border-green-200 hover:border-green-300"
              >
                <span className="font-semibold text-green-700 block mb-1">
                  🟢 Good Example (Authentic UK Voice)
                </span>
                <span className="text-gray-600">
                  &ldquo;Built by someone with 5+ years of BBC Radio 1...&rdquo;
                </span>
              </button>
              <button
                onClick={() => setText('We analyze and organize your data to optimize results.')}
                className="text-left text-sm bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 p-4 rounded-xl transition-all border-2 border-yellow-200 hover:border-yellow-300"
              >
                <span className="font-semibold text-yellow-700 block mb-1">
                  🟡 Medium Example (Just Spelling Issues)
                </span>
                <span className="text-gray-600">
                  &ldquo;We analyze and organize your data...&rdquo;
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg px-6 py-4">
            <p className="text-sm text-gray-600 mb-2">
              Powered by <span className="font-semibold text-purple-600">Claude 3.5 Haiku</span>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>73% cheaper than Sonnet</span>
              <span>•</span>
              <span>3-5x faster responses</span>
              <span>•</span>
              <span>~$0.0006 per check</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
