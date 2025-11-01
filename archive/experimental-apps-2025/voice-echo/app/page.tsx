'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Users,
  Target,
  Zap,
  Check,
  Play,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Search,
  Upload,
  Download,
  Settings,
  BarChart3,
  Shield,
  Headphones,
  Music,
  Radio,
  Newspaper,
  ExternalLink,
  MessageSquare,
  Share,
  Brain,
} from 'lucide-react';
import { AudioCharacter } from '@/components/ui/audio-character';
import Image from 'next/image';
import Link from 'next/link';

// Track cross-promotion clicks
function trackCrossPromotionClick(target: string, location: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'cross_promotion_click', {
      target,
      location,
      timestamp: new Date().toISOString(),
    });
  }
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'cross_promotion_click',
      data: { target, location, timestamp: new Date().toISOString() },
    }),
  });
}

export default function VoiceEchoLanding() {
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
            <Link
              href="/content-generation"
              className="text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors"
            >
              Content Generation
            </Link>
            <Button variant="outline" size="sm" className="font-bold border-2">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => (window.location.href = '/voice-training')}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Cross-Promotion Banner */}
      <section className="w-full px-4 py-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b-4 border-yellow-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Need playlist promotion? Try Playlist Pulse
                </h3>
                <p className="text-gray-700 font-bold">
                  Get instant access to 50,000+ verified playlist curators with AI-powered pitch
                  generation
                </p>
              </div>
            </div>
            <Link
              href="https://pulse.totalaudiopromo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              onClick={() => trackCrossPromotionClick('playlist_pulse', 'hero_banner')}
            >
              <span>Try Playlist Pulse</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 bg-purple-100 text-purple-800 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Content Creation
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Your Authentic Voice,
            <span className="block text-purple-600">Amplified Across Every Platform</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            Stop posting generic AI content. Voice Echo learns your unique voice and creates
            platform-perfect posts for X, Instagram, Threads & TikTok that sound exactly like you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xl px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              onClick={() => (window.location.href = '/voice-training')}
            >
              <Zap className="w-6 h-6 mr-2" />
              Start Voice Training
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-black text-xl px-8 py-6 border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              onClick={() => (window.location.href = '/content-generation')}
            >
              <Brain className="w-6 h-6 mr-2" />
              See Voice Learning Demo
            </Button>
          </div>

          {/* Demo Transformation */}
          <div className="max-w-6xl mx-auto bg-white rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-16 items-center">
              {/* Before */}
              <div className="text-center">
                <Badge className="mb-8 rounded-full px-8 py-3 text-lg font-black bg-gray-100 text-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  BEFORE
                </Badge>
                <div className="bg-gray-50 rounded-2xl p-10 border-4 border-gray-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-gray-900 font-mono text-2xl font-black">
                    "Just dropped my new track!"
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  <ArrowRight className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* After */}
              <div className="text-center">
                <Badge className="mb-8 rounded-full px-8 py-3 text-lg font-black bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  AFTER
                </Badge>
                <div className="bg-white rounded-2xl p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <Music className="w-6 h-6 text-blue-500" />
                      <span className="font-black text-xl">X/Twitter | 280 characters</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Target className="w-6 h-6 text-red-500" />
                      <span className="font-bold text-lg">
                        "🔥 Just dropped my new track! Been working on this for months and finally
                        ready to share it with you all. Link in bio 👆 #NewMusic #UKArtist"
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="w-6 h-6 text-orange-500" />
                      <span className="font-bold text-lg">Instagram | Visual-first caption</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Users className="w-6 h-6 text-purple-500" />
                      <span className="font-bold text-lg">
                        "Behind the scenes of my new track 🎵 This one's been brewing for months and
                        I'm so excited to finally share it with you all! Link in bio for the full
                        story 👆"
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Zap className="w-6 h-6 text-yellow-500" />
                      <span className="font-bold text-lg">Threads | Conversational tone</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Check className="w-6 h-6 text-green-500" />
                      <span className="font-black text-xl">Authentic Voice: 95% Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Trusted by Independent Musicians
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="text-4xl font-black text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                2,847+
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Posts Generated</div>
              <div className="text-base font-bold text-gray-600">
                Authentic content across X, Instagram, Threads & TikTok
              </div>
            </div>

            <div className="bg-white p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="text-4xl font-black text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                4
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Platforms</div>
              <div className="text-base font-bold text-gray-600">
                X, Instagram, Threads & TikTok optimized
              </div>
            </div>

            <div className="bg-white p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="text-4xl font-black text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                95%
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Voice Match</div>
              <div className="text-base font-bold text-gray-600">
                Authentic voice preservation you can trust
              </div>
            </div>

            <div className="bg-white p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="text-4xl font-black text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                8
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Hours Saved</div>
              <div className="text-base font-bold text-gray-600">
                Average time saved per week on content creation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              The Problem: AI Content Sounds Generic
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Generic AI Content</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Most AI tools generate robotic, soulless content that sounds nothing like you
                      and fails to connect with your audience authentically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Platform Confusion</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Each platform has different formats, character limits, and audience
                      expectations - creating content that works across X, Instagram, Threads &
                      TikTok is exhausting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      Time-Consuming Process
                    </h3>
                    <p className="text-xl font-bold text-gray-700">
                      Hours spent crafting different versions for each platform, trying to maintain
                      your authentic voice while optimizing for engagement and reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-center">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-8">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-6">The Reality</h3>
                <p className="text-xl font-bold text-gray-700 mb-8">
                  Most musicians waste countless hours on content creation that could be automated
                  while preserving their authentic voice.
                </p>
                <div className="text-4xl font-black text-purple-600 mb-4">8hrs</div>
                <div className="text-2xl font-black text-gray-700">
                  Average time wasted per week
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              The Solution: AI-Powered Voice Learning
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-gray-50 p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-8 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Voice Learning</h3>
              <p className="text-lg font-bold text-gray-700">
                Upload 10-15 of your best social media posts and our AI learns your authentic voice,
                tone, style, and personality to create content that sounds exactly like you.
              </p>
            </div>

            <div className="bg-gray-50 p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-8 group-hover:scale-110 transition-transform duration-200">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Platform Optimization</h3>
              <p className="text-lg font-bold text-gray-700">
                95% voice match while optimizing for each platform's unique requirements - X
                character limits, Instagram visual-first approach, Threads conversational tone,
                TikTok viral format.
              </p>
            </div>

            <div className="bg-gray-50 p-10 text-center rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-8 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Multi-Platform</h3>
              <p className="text-lg font-bold text-gray-700">
                Generate authentic content for X, Instagram, Threads & TikTok simultaneously - each
                version optimized for the platform's audience and format requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent Parsing Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              ✨ Voice Learning - Our Secret Weapon
            </h2>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              While other AI tools generate generic content, Voice Echo learns your authentic voice
              from your best posts. We preserve your personality while optimizing for engagement
              across every platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-8">What Makes Us Different</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Learns Your Voice</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Analyzes your writing style, tone, humor, and personality from your best
                      social media posts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Platform Optimization</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Adapts your voice for each platform's unique requirements - character limits,
                      hashtags, tone, and format.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Authentic Output</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Generates content that sounds exactly like you while optimizing for engagement
                      and reach.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Multi-Platform Ready</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Built for the reality of managing multiple social platforms, not just one
                      generic output.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">
                Example: Voice Learning
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-gray-900 mb-3">📥 Your Best Posts:</h4>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div>"Just dropped my new track! Been working on this for months 🎵"</div>
                    <div>
                      "Studio session today was 🔥 Can't wait to share what we're cooking up"
                    </div>
                    <div>"Big thanks to everyone who came to the show last night!"</div>
                    <div>"New music coming soon... this one's special 👆"</div>
                  </div>
                </div>
                <div className="text-center">
                  <ArrowRight className="w-8 h-8 text-blue-500 mx-auto" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-3">📤 Platform-Optimized Content:</h4>
                  <div className="bg-green-100 p-4 rounded-lg font-mono text-sm">
                    <div>
                      ✅ X: "🔥 Just dropped my new track! Been working on this for months and
                      finally ready to share it with you all. Link in bio 👆 #NewMusic #UKArtist"
                    </div>
                    <div>
                      ✅ Instagram: "Behind the scenes of my new track 🎵 This one's been brewing
                      for months and I'm so excited to finally share it with you all! Link in bio
                      for the full story 👆"
                    </div>
                    <div>
                      ✅ Threads: "Just dropped my new track! Been working on this for months and
                      finally ready to share it with you all. Link in bio 👆"
                    </div>
                    <div>
                      ✅ TikTok: "New track just dropped! 🔥 Been working on this for months 🎵 Link
                      in bio 👆"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Simple, Transparent Pricing
            </h2>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              Choose the plan that fits your content creation needs. All plans include our core
              voice learning features.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-white p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Starter</h3>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £19<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">50 content generations per month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">All voice learning features</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">
                    4 platform support (X, Instagram, Threads, TikTok)
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Email support</span>
                </li>
              </ul>

              <Button
                className="w-full rounded-2xl font-black text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white hover:bg-gray-50 text-black border-4 border-gray-300"
                onClick={() => (window.location.href = '/voice-training')}
              >
                Start Voice Training
              </Button>
            </div>

            {/* Professional - Most Popular */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MOST POPULAR
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Professional</h3>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £19<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">200 content generations per month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Priority processing</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Advanced editing tools</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Social media integrations</span>
                </li>
              </ul>

              <Button
                className="w-full rounded-2xl font-black text-xl py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                onClick={() => (window.location.href = '/voice-training')}
              >
                Start Free Trial
              </Button>
            </div>

            {/* Agency */}
            <div className="bg-white p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Agency</h3>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £39.99<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">500 contact enrichments per month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Fastest processing</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">White-label exports</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Phone + email support</span>
                </li>
              </ul>

              <Button
                className="w-full rounded-2xl font-black text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white hover:bg-gray-50 text-black border-4 border-gray-300"
                onClick={() => (window.location.href = '/demo')}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
            Ready to Transform Your Music Promotion?
          </h2>
          <p className="text-2xl font-bold text-gray-700 mb-12 max-w-4xl mx-auto">
            Join hundreds of artists and labels who've already saved 15+ hours per week with
            AI-powered contact intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-2xl px-12 py-8 text-2xl font-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              onClick={() => (window.location.href = '/demo')}
            >
              <Play className="w-8 h-8 mr-4" />
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-4 border-gray-300 px-12 py-8 text-2xl font-black hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white"
              onClick={() =>
                (window.location.href =
                  'mailto:info@totalaudiopromo.com?subject=Audio Intel Demo Request&body=Hi, I would like to schedule a demo of Audio Intel. Please let me know your availability.')
              }
            >
              Schedule Demo
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Cross-Promotion Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Need playlist promotion?</h3>
                  <p className="text-white/80 font-bold">
                    Try Playlist Pulse - our sister tool for AI-powered playlist curator discovery
                    and pitch generation
                  </p>
                </div>
              </div>
              <Link
                href="https://pulse.totalaudiopromo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                onClick={() => trackCrossPromotionClick('playlist_pulse', 'footer')}
              >
                <span>Try Playlist Pulse</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Image
                    src="/t-a-p-new dog logo.png"
                    alt="Total Audio Promo Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <span className="text-2xl font-black">Audio Intel</span>
              </div>
              <p className="text-lg font-bold text-gray-300 mb-8">
                AI-powered contact intelligence for the music industry. Transform basic email lists
                into detailed contact insights. Powered by Total Audio Promo.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Product</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/demo"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@totalaudiopromo.com"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    API Access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:info@totalaudiopromo.com"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@totalaudiopromo.com"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/documentation"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Our Ecosystem</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="https://pulse.totalaudiopromo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-white font-bold transition-colors"
                    onClick={() => trackCrossPromotionClick('playlist_pulse', 'footer_ecosystem')}
                  >
                    <Music className="w-4 h-4" />
                    <span>Playlist Pulse</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:info@totalaudiopromo.com"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="https://totalaudiopromo.com/privacy"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://totalaudiopromo.com/terms"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://totalaudiopromo.com/about"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    About Total Audio Promo
                  </a>
                </li>
                <li>
                  <a
                    href="https://totalaudiopromo.com/blog"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@totalaudiopromo.com"
                    className="text-gray-300 hover:text-white font-bold transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-bold">
              © 2025 Audio Intel - Powered By Total Audio Promo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
