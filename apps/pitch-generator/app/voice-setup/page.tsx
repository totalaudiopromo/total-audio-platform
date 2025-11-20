'use client';

import { useState } from 'react';
import { Shield, AlertCircle, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { VoiceGuardLogo } from '@/components/VoiceGuardBrand';

export default function VoiceSetupPage() {
  const [voiceData, setVoiceData] = useState({
    background: '',
    writingSamples: '',
    principles: '',
    preferences: '',
    constraints: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleCopy = (field: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const questions = [
    {
      field: 'background',
      label: 'Your Background & Role',
      placeholder: 'Paste your background here...\n\nExample: I run Liberty Music PR, a boutique agency specialising in radio promotion for indie artists. We work with BBC Radio 1, 6 Music, and regional stations across the UK. I have been in the industry for 8 years and value authentic, personal relationships with DJs and producers.',
      helper: 'Tell us about your agency, experience, and the types of artists you work with'
    },
    {
      field: 'writingSamples',
      label: 'Writing Samples',
      placeholder: 'Paste 2-3 examples of your best pitches here...\n\nExample: "Hi Jack, Hope you're well! Quick one about this track from Billie Marten - it's got that late-night Radio 1 energy you champion. She's already had support from Huw Stephens and this feels like a natural next step. The production is clean but not over-polished, exactly the kind of thing that works on your show. Stream below - would love to know what you think. Cheers, Sam"',
      helper: 'Copy and paste 2-3 of your most successful pitch emails'
    },
    {
      field: 'principles',
      label: 'Your Communication Principles',
      placeholder: 'Paste your communication style guide here...\n\nExample:\n- Always personalise to the specific DJ/show\n- Keep it under 150 words\n- Lead with why it fits their taste, not the artist bio\n- Never use PR speak like "hotly-tipped" or "exciting new artist"\n- Always include a specific call to action',
      helper: 'What rules do you follow when writing pitches?'
    },
    {
      field: 'preferences',
      label: 'Tone & Style Preferences',
      placeholder: 'Paste your tone preferences here...\n\nExample:\n- Professional but warm (like emailing a friend who happens to be in radio)\n- British spelling always\n- Use "Cheers" not "Best regards"\n- Reference previous conversations when relevant\n- Show genuine enthusiasm without being pushy',
      helper: 'How should your pitches sound and feel?'
    },
    {
      field: 'constraints',
      label: 'Things to Avoid',
      placeholder: 'Paste your no-go list here...\n\nExample:\n- Never mention streaming numbers in first pitch\n- Avoid generic compliments\n- Don\'t compare artists to more than one reference\n- Never send mass emails\n- Don\'t pitch to shows that don\'t fit the genre',
      helper: 'What should VoiceGuard™ never do in your pitches?'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <VoiceGuardLogo />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Create Your VoiceGuard™ Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Copy and paste from your Apple Notes to train VoiceGuard™ on your authentic voice.
            Every pitch will sound like you wrote it personally.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border-2 border-amber-600 rounded-full">
            <Shield className="w-4 h-4 text-amber-800" />
            <span className="text-sm font-bold text-amber-800">
              LIBERTY MUSIC PR DEMO MODE
            </span>
          </div>
        </div>

        {/* Voice Setup Form */}
        <div className="space-y-8">
          {questions.map((q) => (
            <div
              key={q.field}
              className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <label className="text-lg font-bold text-gray-900 block mb-1">
                    {q.label}
                  </label>
                  <p className="text-sm text-gray-600">{q.helper}</p>
                </div>
                <button
                  onClick={() => handleCopy(q.field, voiceData[q.field as keyof typeof voiceData])}
                  className="ml-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Copy content"
                >
                  {copiedField === q.field ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <textarea
                value={voiceData[q.field as keyof typeof voiceData]}
                onChange={(e) => setVoiceData({...voiceData, [q.field]: e.target.value})}
                placeholder={q.placeholder}
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm resize-none focus:border-amber-500 focus:outline-none"
              />
              <div className="mt-2 text-xs text-gray-500">
                💡 Tip: Copy directly from Apple Notes and paste here
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 border-4 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-4">
              Ready to Activate VoiceGuard™?
            </h2>
            <p className="text-white/90 mb-6">
              Once analyzed, VoiceGuard™ will ensure every pitch matches your authentic voice
            </p>

            {!analysisComplete ? (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !voiceData.background || !voiceData.writingSamples}
                className="bg-white text-amber-600 px-8 py-4 rounded-xl font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600" />
                    Analyzing Your Voice...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze My Voice
                  </>
                )}
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-center gap-3 text-white mb-4">
                  <Shield className="w-8 h-8" />
                  <span className="text-2xl font-black">VoiceGuard™ Activated!</span>
                </div>
                <div className="space-y-2 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Voice profile analyzed and stored</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Writing style patterns identified</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Communication principles locked in</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Ready to generate authentic pitches</span>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="/pitch/generate"
                    className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                  >
                    Start Generating Pitches →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How VoiceGuard™ Works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Analyzes your writing patterns to understand your unique voice</li>
                <li>• Ensures every generated pitch sounds authentically like you</li>
                <li>• Prevents generic AI-sounding copy that damages credibility</li>
                <li>• Adapts to your specific UK music industry communication style</li>
                <li>• Updates and improves based on your feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}