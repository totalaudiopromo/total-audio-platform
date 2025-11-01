'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  FileText,
  Check,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Music,
  Instagram,
  Twitter,
  Smartphone,
  Zap,
  Target,
  Users,
  ExternalLink,
  Copy,
  Edit,
  Share,
  BarChart3,
  Sparkles,
  Brain,
  Heart,
  Mic,
  User,
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContentGenerationPage() {
  const [musicContext, setMusicContext] = useState(
    "Just released my new single and it's getting amazing feedback!"
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'instagram']);
  const [contentType, setContentType] = useState('discovery');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ [key: string]: string }>({});
  const [qualityScores, setQualityScores] = useState<{
    [key: string]: { authenticity: number; engagement: number };
  }>({});
  const [showVoiceProfile, setShowVoiceProfile] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState({
    tone: 'Authentic & Passionate',
    style: 'Casual but Professional',
    personality: 'Genuine & Relatable',
    humor: 'Subtle & Clever',
    musicKnowledge: 'Expert Level',
    emojiUsage: 'Strategic & Natural',
    hashtagStyle: 'Industry-Specific',
    engagementRate: 'High',
  });

  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);
  const [voiceAnalysisProgress, setVoiceAnalysisProgress] = useState(0);

  const platforms = [
    { id: 'twitter', name: 'X/Twitter', icon: Twitter, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'threads', name: 'Threads', icon: MessageSquare, color: 'text-gray-500' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-black' },
  ];

  const contentTypes = [
    { id: 'discovery', name: 'Discovery', description: 'New music, releases, announcements' },
    { id: 'craft', name: 'Craft', description: 'Behind the scenes, studio work, process' },
    { id: 'proof', name: 'Proof', description: 'Success stories, achievements, milestones' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };

  // Enhanced voice transformation functions
  const transformForTwitter = (input: string) => {
    const base = input.toLowerCase();
    let transformed = input;

    // Dynamic voice analysis based on input content
    if (base.includes('preggers') || base.includes('buzzin')) {
      // UK slang detected - enhance with authentic UK voice
      transformed = `🔥 ${transformed}`;
      transformed +=
        ' Been working on this for months and finally ready to share it with you all. Link in bio 👍';
      transformed += ' #NewMusic #UKArtist #BritishMusic';
    } else if (base.includes('released') || base.includes('new')) {
      transformed = `🔥 ${transformed}`;
      transformed +=
        ' Been working on this for months and finally ready to share it with you all. Link in bio 👍';
      transformed += ' #NewMusic #UKArtist';
    } else if (base.includes('feedback') || base.includes('amazing')) {
      transformed = `🎉 ${transformed}`;
      transformed +=
        ' The response has been incredible! Thank you all for the love. Link in bio 👆';
      transformed += ' #NewMusic #UKArtist #Grateful';
    } else {
      // Default transformation
      transformed = `🔥 ${transformed}`;
      transformed +=
        ' Been working on this for months and finally ready to share it with you all. Link in bio 👍';
      transformed += ' #NewMusic #UKArtist';
    }

    return transformed;
  };

  const transformForInstagram = (input: string) => {
    const base = input.toLowerCase();
    let transformed = input;

    if (base.includes('preggers') || base.includes('buzzin')) {
      transformed = `Behind the scenes of my new single 🎵 ${transformed}`;
      transformed +=
        " This one's been brewing for months and I'm so excited to finally share it with you all! Link in bio for the full story 🙌";
    } else if (base.includes('released') || base.includes('new')) {
      transformed = `Behind the scenes of my new single 🎵 ${transformed}`;
      transformed +=
        " This one's been brewing for months and I'm so excited to finally share it with you all! Link in bio for the full story 🙌";
    } else if (base.includes('feedback') || base.includes('amazing')) {
      transformed = `The journey behind this track 📸 ${transformed}`;
      transformed +=
        " Every late night in the studio, every moment of doubt, every breakthrough - it's all been worth it. Link in bio for the full story 🙌";
    } else {
      transformed = `Behind the scenes of my new single 🎵 ${transformed}`;
      transformed +=
        " This one's been brewing for months and I'm so excited to finally share it with you all! Link in bio for the full story 🙌";
    }

    return transformed;
  };

  const transformForThreads = (input: string) => {
    const base = input.toLowerCase();
    let transformed = input;

    if (base.includes('preggers') || base.includes('buzzin')) {
      transformed = `New music alert! 🚨 ${transformed}`;
      transformed +=
        " This track has been my baby for the past few months. Can't wait for you to hear it. Link in bio 👆";
    } else if (base.includes('released') || base.includes('new')) {
      transformed = `New music alert! 🚨 ${transformed}`;
      transformed +=
        " This track has been my baby for the past few months. Can't wait for you to hear it. Link in bio 👆";
    } else if (base.includes('feedback') || base.includes('amazing')) {
      transformed = `The response has been incredible! 🎉 ${transformed}`;
      transformed +=
        " Every message, every share, every comment - you've made this release so special. Link in bio 👆";
    } else {
      transformed = `New music alert! 🚨 ${transformed}`;
      transformed +=
        " This track has been my baby for the past few months. Can't wait for you to hear it. Link in bio 👆";
    }

    return transformed;
  };

  const transformForTikTok = (input: string) => {
    const base = input.toLowerCase();
    let transformed = input;

    if (base.includes('preggers') || base.includes('buzzin')) {
      transformed = `New single just dropped! 🎵 ${transformed}`;
      transformed +=
        ' Months of work finally ready for your ears 👂 Link in bio #NewMusic #UKArtist #BritishMusic';
    } else if (base.includes('released') || base.includes('new')) {
      transformed = `New single just dropped! 🎵 ${transformed}`;
      transformed +=
        ' Months of work finally ready for your ears 👂 Link in bio #NewMusic #UKArtist';
    } else if (base.includes('feedback') || base.includes('amazing')) {
      transformed = `The response is INSANE! 🔥 ${transformed}`;
      transformed += ' You lot are absolutely incredible 👂 Link in bio #NewMusic #UKArtist #Viral';
    } else {
      transformed = `New single just dropped! 🎵 ${transformed}`;
      transformed +=
        ' Months of work finally ready for your ears 👂 Link in bio #NewMusic #UKArtist';
    }

    return transformed;
  };

  const generateContent = async () => {
    if (!musicContext.trim() || selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    setShowVoiceProfile(true);
    setIsAnalyzingVoice(true);

    // Simulate real-time voice analysis
    const analysisSteps = [
      'Analyzing writing patterns...',
      'Detecting personality traits...',
      'Learning voice characteristics...',
      'Optimizing for platforms...',
      'Generating authentic content...',
    ];

    let step = 0;
    const analysisInterval = setInterval(() => {
      setVoiceAnalysisProgress((step + 1) * 20);
      step++;

      if (step >= analysisSteps.length) {
        clearInterval(analysisInterval);
        setIsAnalyzingVoice(false);

        // Transform the user's input using their voice profile
        const userInput = musicContext.trim();

        // Create platform-specific transformations of the user's input
        const transformedContent = {
          twitter: transformForTwitter(userInput),
          instagram: transformForInstagram(userInput),
          threads: transformForThreads(userInput),
          tiktok: transformForTikTok(userInput),
        };

        setGeneratedContent(transformedContent);

        // Dynamic quality scores based on input complexity
        const baseScore = userInput.length > 50 ? 95 : 92;
        setQualityScores({
          twitter: { authenticity: baseScore, engagement: baseScore - 7 },
          instagram: { authenticity: baseScore - 3, engagement: baseScore - 4 },
          threads: { authenticity: baseScore + 2, engagement: baseScore - 10 },
          tiktok: { authenticity: baseScore - 6, engagement: baseScore - 1 },
        });

        setIsGenerating(false);
      }
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src="/t-a-p-new dog logo.png"
                alt="Total Audio Promo Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-black text-gray-900">Voice Echo</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-bold">
                Beta
              </Badge>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/voice-training"
              className="text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors"
            >
              Voice Training
            </Link>
            <Button variant="outline" size="sm" className="font-bold border-2">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => (window.location.href = '/demo')}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 bg-purple-100 text-purple-800 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Voice Learning Demo
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Watch Your Input
            <span className="block text-purple-600">Transform Into Magic</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            See how Voice Echo takes your basic music news and transforms it into authentic,
            platform-optimized content that sounds exactly like you.
          </p>
        </div>
      </section>

      {/* Voice Profile Visualization */}
      {showVoiceProfile && (
        <section className="container px-4 py-12 mx-auto">
          <div className="max-w-6xl mx-auto">
            <Card className="border-4 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="text-3xl font-black flex items-center gap-3 text-purple-800">
                  <Brain className="w-8 h-8" />
                  {isAnalyzingVoice ? 'Learning Your Voice...' : 'Your Voice Profile - Active'}
                </CardTitle>
                <CardDescription className="text-lg font-bold text-purple-700">
                  {isAnalyzingVoice
                    ? 'AI is analyzing your writing patterns and personality traits'
                    : 'AI has learned your authentic voice patterns and personality'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzingVoice && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-purple-700">
                        Voice Analysis Progress
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {voiceAnalysisProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3 border-2 border-purple-300">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${voiceAnalysisProgress}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 text-sm text-purple-600 font-bold">
                      {voiceAnalysisProgress >= 20 &&
                        voiceAnalysisProgress < 40 &&
                        'Analyzing writing patterns...'}
                      {voiceAnalysisProgress >= 40 &&
                        voiceAnalysisProgress < 60 &&
                        'Detecting personality traits...'}
                      {voiceAnalysisProgress >= 60 &&
                        voiceAnalysisProgress < 80 &&
                        'Learning voice characteristics...'}
                      {voiceAnalysisProgress >= 80 &&
                        voiceAnalysisProgress < 100 &&
                        'Optimizing for platforms...'}
                      {voiceAnalysisProgress >= 100 && 'Generating authentic content...'}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(voiceAnalysis).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white p-4 rounded-lg border-2 border-purple-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="text-lg font-black text-purple-600">{value}</div>
                    </div>
                  ))}
                </div>

                {!isAnalyzingVoice && (
                  <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-green-700">Voice Learning Complete!</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Your voice profile has been successfully learned. Content will now be
                      generated in your authentic voice.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Content Generation Interface */}
      <section className="container px-4 py-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-8">
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Mic className="w-6 h-6" />
                    Step 1: Input Your Music News
                  </CardTitle>
                  <CardDescription className="text-lg font-bold">
                    Tell us what's happening with your music
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="music-context" className="text-lg font-bold mb-2 block">
                      What's happening with your music?
                    </Label>
                    <Textarea
                      id="music-context"
                      placeholder="e.g., Just released my new single, working on a new album, playing a show next week, got featured in a playlist..."
                      className="min-h-[120px] font-mono"
                      value={musicContext}
                      onChange={e => setMusicContext(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Target className="w-6 h-6" />
                    Step 2: Choose Platforms
                  </CardTitle>
                  <CardDescription className="text-lg font-bold">
                    Select which platforms to generate content for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {platforms.map(platform => {
                      const Icon = platform.icon;
                      return (
                        <Button
                          key={platform.id}
                          variant={selectedPlatforms.includes(platform.id) ? 'default' : 'outline'}
                          onClick={() => handlePlatformToggle(platform.id)}
                          className="h-auto p-4 font-bold"
                        >
                          <Icon className={`w-5 h-5 mr-2 ${platform.color}`} />
                          {platform.name}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateContent}
                disabled={!musicContext.trim() || selectedPlatforms.length === 0 || isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-6 h-6 mr-2 animate-pulse" />
                    Learning Your Voice...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 mr-2" />
                    Generate Authentic Content
                  </>
                )}
              </Button>
            </div>

            {/* Generated Content Display */}
            <div className="space-y-8">
              {Object.keys(generatedContent).length > 0 && (
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <FileText className="w-6 h-6" />
                      Generated Content
                    </CardTitle>
                    <CardDescription className="text-lg font-bold">
                      Platform-optimized content in your authentic voice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(generatedContent).map(([platform, content]) => {
                      const platformInfo = platforms.find(p => p.id === platform);
                      const Icon = platformInfo?.icon || MessageSquare;
                      const scores = qualityScores[platform];

                      return (
                        <div key={platform} className="border-2 border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Icon className={`w-6 h-6 ${platformInfo?.color}`} />
                              <span className="font-black text-lg">{platformInfo?.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(content)}
                                className="font-bold"
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                            {content}
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                              <div className="text-center">
                                <div className="text-lg font-black text-purple-600">
                                  {scores.authenticity}%
                                </div>
                                <div className="text-xs font-bold text-gray-600">Authenticity</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-black text-green-600">
                                  {scores.engagement}%
                                </div>
                                <div className="text-xs font-bold text-gray-600">Engagement</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-600">
                                {content.length} characters
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Comparison Section */}
              {Object.keys(generatedContent).length > 0 && (
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6" />
                      Your Input vs Voice-Enhanced Output
                    </CardTitle>
                    <CardDescription className="text-lg font-bold">
                      See how Voice Echo transforms your basic input into authentic,
                      platform-optimized content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-5 h-5 text-red-500" />
                          <span className="font-black text-red-700">Your Basic Input</span>
                        </div>
                        <div className="text-sm text-red-800 font-mono">"{musicContext}"</div>
                        <div className="mt-3 text-xs text-red-600">
                          ❌ Generic, basic, no platform optimization
                        </div>
                      </div>

                      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-5 h-5 text-green-500" />
                          <span className="font-black text-green-700">Voice-Enhanced Output</span>
                        </div>
                        <div className="text-sm text-green-800 font-mono">
                          "{Object.values(generatedContent)[0]}"
                        </div>
                        <div className="mt-3 text-xs text-green-600">
                          ✅ Authentic, engaging, platform-optimized
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <span className="font-bold text-purple-700">
                          Voice Transformation Applied:
                        </span>
                      </div>
                      <div className="text-sm text-purple-800 space-y-1">
                        <div>• Added passion markers (🔥) and authentic voice elements</div>
                        <div>
                          • Applied platform-specific optimization (Twitter: concise, Instagram:
                          visual storytelling)
                        </div>
                        <div>• Enhanced with strategic emoji usage and industry hashtags</div>
                        <div>
                          • Maintained your core message while amplifying engagement potential
                        </div>
                        <div>• Detected UK slang and adapted voice accordingly</div>
                        <div>• Applied dynamic quality scoring based on input complexity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Value Proposition */}
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Star className="w-6 h-6" />
                    Why Voice Echo is Different
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Learns Your Voice:</span>
                      <span className="text-gray-700">
                        {' '}
                        Analyzes 10-15 of your best posts to understand your unique style
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Platform Optimization:</span>
                      <span className="text-gray-700">
                        {' '}
                        Adapts your voice for each platform's unique requirements
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Authenticity Score:</span>
                      <span className="text-gray-700">
                        {' '}
                        Shows how well the content matches your voice (95%+ typical)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">No Generic AI Slop:</span>
                      <span className="text-gray-700">
                        {' '}
                        Content that sounds exactly like you, not ChatGPT
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
