"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowRight, Music, Star, Users, CheckCircle, ChevronDown, ChevronUp, 
  Zap, Upload, Download, User, Mail, Headphones, BarChart, Target,
  Award, Briefcase, Globe, Phone, Sparkles, FileText, Check, X, ExternalLink, Database,
  Clock, TrendingUp, MessageSquare, Eye, Play, Pause
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Track cross-promotion clicks
function trackCrossPromotionClick(target: string, location: string) {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cross_promotion_click', {
        target,
        location,
        timestamp: new Date().toISOString()
      });
    }
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event: 'cross_promotion_click', 
        data: { target, location, timestamp: new Date().toISOString() } 
      }),
    }).catch(error => {
      console.error('Analytics error:', error);
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }
}

// Track button clicks
function trackButtonClick(buttonType: string, location: string) {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'button_click', {
        button_type: buttonType,
        location,
        timestamp: new Date().toISOString()
      });
    }
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event: 'button_click', 
        data: { button_type: buttonType, location, timestamp: new Date().toISOString() } 
      }),
    }).catch(error => {
      console.error('Analytics error:', error);
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }
}

export default function PlaylistPulseLanding() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeSaved, setTimeSaved] = useState(0);
  const [responseRate, setResponseRate] = useState(0);

  // Dynamic metrics for the comparison section
  const dynamicMetrics = [
    { label: "Time Saved", value: "15 hours", icon: Clock, color: "text-blue-500" },
    { label: "Response Rate", value: "3x higher", icon: TrendingUp, color: "text-green-500" },
    { label: "Curators Found", value: "50+ matches", icon: Users, color: "text-purple-500" },
    { label: "Pitches Sent", value: "Personalized", icon: MessageSquare, color: "text-yellow-500" }
  ];

  // Animated counter effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentMetric((prev) => (prev + 1) % dynamicMetrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, dynamicMetrics.length]);

  // Animated time saved counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSaved((prev) => {
        if (prev >= 15) return 15;
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Animated response rate counter
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseRate((prev) => {
        if (prev >= 3) return 3;
        return prev + 0.05;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = () => {
    try {
      trackButtonClick('sign_in', 'header');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/auth/signin';
    }
  };

  const handleGetStarted = () => {
    try {
      trackButtonClick('get_started', 'header');
      router.push('/auth/signup');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/auth/signup';
    }
  };

  const handleUploadTrack = () => {
    try {
      trackButtonClick('upload_track', 'hero');
      router.push('/upload');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/upload';
    }
  };

  const handleStartTrial = () => {
    try {
      trackButtonClick('start_trial', 'hero');
      router.push('/auth/signup?plan=trial');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/auth/signup?plan=trial';
    }
  };

  const handlePricingTrial = (plan: string) => {
    try {
      trackButtonClick('pricing_trial', plan);
      router.push(`/auth/signup?plan=${plan}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = `/auth/signup?plan=${plan}`;
    }
  };

  const handleContactSales = () => {
    try {
      trackButtonClick('contact_sales', 'pricing');
      window.location.href = 'mailto:sales@totalaudiopromo.com?subject=Enterprise%20Inquiry%20-%20Playlist%20Pulse';
    } catch (error) {
      console.error('Email error:', error);
      // Fallback to simple mailto
      window.open('mailto:sales@totalaudiopromo.com?subject=Enterprise%20Inquiry%20-%20Playlist%20Pulse');
    }
  };

  const handleUploadTrackCTA = () => {
    try {
      trackButtonClick('upload_track_cta', 'how_it_works');
      router.push('/upload');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/upload';
    }
  };

  const handleFinalCTA = () => {
    try {
      trackButtonClick('final_cta', 'bottom');
      router.push('/upload');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/upload';
    }
  };

  const playlistMetrics = [
    {
      stat: "50K+ Playlists Covered",
      subtext: "Spotify, Apple Music, YouTube, and SoundCloud playlists"
    },
    {
      stat: "200+ Genres Mapped",
      subtext: "From trap to ambient, death metal to lo-fi hip-hop"
    },
    {
      stat: "3x Higher Response Rate",
      subtext: "AI-powered personalized pitches that actually work"
    },
    {
      stat: "15 Hours Saved",
      subtext: "Average time saved per week on curator research"
    }
  ];

  const faqs = [
    {
      q: "How accurate are the curator contacts?",
      a: "All 50,000+ contacts are verified monthly. Dead emails are automatically removed, and we track response rates to ensure quality."
    },
    {
      q: "Do the AI pitches actually work?",
      a: "Yes! Our users see 3x higher response rates compared to generic templates. The AI personalizes each pitch based on curator preferences and your track details."
    },
    {
      q: "Can I customize the AI-generated pitches?",
      a: "Absolutely. You can edit any pitch before sending, save custom templates, and train the AI on your preferred tone and style."
    },
    {
      q: "What happens if I don't get playlist placements?",
      a: "While we can't guarantee placements (no one can!), we do guarantee high-quality contacts and personalized pitches. Most users see responses within 48 hours."
    },
    {
      q: "Is this just another contact database?",
      a: "No - we're the only platform that combines verified contacts with AI-powered pitch generation and seamless workflow integration. It's like having a playlist promotion expert working 24/7."
    },
    {
      q: "Do you work with all genres?",
      a: "Yes! From trap to ambient, death metal to lo-fi hip-hop. Our AI understands 200+ micro-genres and subgenres."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Image 
                src="/assets/logo/t-a-p-new dog logo.png" 
                alt="Total Audio Promo Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-black text-gray-900">Playlist Pulse</span>
              <span className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm">Beta</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="https://audiointel.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => trackCrossPromotionClick('audio_intel', 'header_nav')}
            >
              <Database className="w-4 h-4" />
              <span>Audio Intel</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <a href="#pricing" className="text-sm font-bold text-gray-700 hover:text-yellow-600 transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="text-sm font-bold text-gray-700 hover:text-yellow-600 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="text-sm font-bold text-gray-700 hover:text-yellow-600 transition-colors">
              FAQ
            </a>
            <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-bold" onClick={handleSignIn}>
              Sign In
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-yellow-100 text-yellow-800 font-bold px-6 py-3 rounded-full text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 inline-block">
            <Zap className="w-5 h-5 mr-2 inline" />
            AI-Powered Playlist Promotion
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Stop Wasting
            <span className="block text-yellow-600">{timeSaved.toFixed(1)} Hours a Week</span>
            Researching Playlist Contacts
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            Get instant access to 50,000+ verified playlist curators with AI-powered pitch generation that gets {responseRate.toFixed(1)}x more responses
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-6 text-lg rounded-2xl transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 flex items-center gap-2" onClick={handleUploadTrack}>
              <Upload className="h-6 w-6" />
              Upload Your Track - Get Curators in Minutes
            </button>
            <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-2xl transition-colors font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" onClick={handleStartTrial}>
              Start Free Trial - No Credit Card Required
            </button>
          </div>

          {/* Dynamic Demo Transformation */}
          <div className="max-w-6xl mx-auto bg-white rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-16 items-center">
              {/* Before */}
              <div className="text-center">
                <span className="bg-gray-100 text-gray-700 font-bold px-8 py-3 rounded-full text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 inline-block">
                  BEFORE
                </span>
                <div className="bg-gray-50 rounded-2xl p-10 border-4 border-gray-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-gray-900 font-mono text-2xl font-black mb-4">Generic Playlist Database</div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-gray-600">
                      <X className="w-5 h-5 text-red-500" />
                      <span className="font-bold">10,000+ contacts</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <X className="w-5 h-5 text-red-500" />
                      <span className="font-bold">No genre matching</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <X className="w-5 h-5 text-red-500" />
                      <span className="font-bold">Generic templates</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <X className="w-5 h-5 text-red-500" />
                      <span className="font-bold">Low response rates</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <X className="w-5 h-5 text-red-500" />
                      <span className="font-bold">Manual research</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Arrow with Play/Pause */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white" />}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-600 mb-2">Live Metrics</div>
                  <div className="bg-yellow-100 rounded-lg p-3 border-2 border-yellow-300">
                    <div className="flex items-center gap-2">
                      {React.createElement(dynamicMetrics[currentMetric].icon, { 
                        className: `w-5 h-5 ${dynamicMetrics[currentMetric].color}` 
                      })}
                      <span className="font-bold text-gray-900">{dynamicMetrics[currentMetric].label}: {dynamicMetrics[currentMetric].value}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="text-center">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold px-8 py-3 rounded-full text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 inline-block">
                  AFTER
                </span>
                <div className="bg-white rounded-2xl p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">Genre-Matched Curators</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">AI-Generated Pitches</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">Personalized Outreach</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">{responseRate.toFixed(1)}x Higher Response Rate</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-lg">Verified Contacts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-lg">Real-time Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Promotion Banner */}
      <section className="w-full px-4 py-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b-4 border-blue-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-400 rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Need contact enrichment? Try Audio Intel</h3>
                <p className="text-gray-700 font-bold">Transform basic email lists into music industry intelligence with AI-powered contact enrichment</p>
              </div>
            </div>
            <Link 
              href="https://audiointel.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              onClick={() => trackCrossPromotionClick('audio_intel', 'hero_banner')}
            >
              <span>Try Audio Intel</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Trusted by Music Industry Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {playlistMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-8 text-center rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group">
                <div className="text-4xl font-black text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {metric.stat.split(' ')[0]}
                </div>
                <div className="text-lg font-black text-gray-700 mb-2">
                  {metric.stat.split(' ').slice(1).join(' ')}
                </div>
                <div className="text-sm font-bold text-gray-600">
                  {metric.subtext}
                </div>
              </div>
            ))}
          </div>
          {/* Platform logos */}
          <div className="flex flex-wrap gap-6 justify-center items-center mt-12 opacity-60">
            <div className="w-28 h-10 bg-yellow-100 rounded flex items-center justify-center text-yellow-800 font-bold text-sm">Spotify</div>
            <div className="w-28 h-10 bg-yellow-100 rounded flex items-center justify-center text-yellow-800 font-bold text-sm">Apple Music</div>
            <div className="w-28 h-10 bg-yellow-100 rounded flex items-center justify-center text-yellow-800 font-bold text-sm">YouTube</div>
            <div className="w-28 h-10 bg-yellow-100 rounded flex items-center justify-center text-yellow-800 font-bold text-sm">SoundCloud</div>
            <div className="w-28 h-10 bg-yellow-100 rounded flex items-center justify-center text-yellow-800 font-bold text-sm">Tidal</div>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 font-bold">
              From upload to playlist placement in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl font-black text-black">1</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Upload Your Track 🎵</h3>
              <p className="text-gray-700 font-bold">
                Drag and drop your audio file. Our AI analyzes genre, mood, tempo, and energy to understand your sound profile.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl font-black text-black">2</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Get Matched Curators 🎯</h3>
              <p className="text-gray-700 font-bold">
                Instantly see 50+ verified curators who love your genre, with contact info, playlist stats, and submission preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl font-black text-black">3</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Send AI-Powered Pitches 🚀</h3>
              <p className="text-gray-700 font-bold">
                One-click sending of personalized pitches that mention specific playlist details and highlight why your track fits perfectly.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg rounded-2xl transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 flex items-center gap-2 mx-auto" onClick={handleUploadTrackCTA}>
              <Upload className="h-6 w-6" />
              Start Your Free Trial Now
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-700 font-bold">
              Choose the plan that fits your needs. All plans include 7-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border-4 border-gray-300 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Solo Artist</h3>
                <div className="text-4xl font-black text-gray-900 mb-4">£29<span className="text-lg text-gray-600">/month</span></div>
                <ul className="space-y-3 text-gray-700 font-bold mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    500 curator contacts/month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    AI pitch generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Basic analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Email support
                  </li>
                </ul>
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" onClick={() => handlePricingTrial('solo')}>
                  Start Free Trial
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white border-4 border-yellow-400 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Most Popular</div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">PR Agency</h3>
                <div className="text-4xl font-black text-gray-900 mb-4">£99<span className="text-lg text-gray-600">/month</span></div>
                <ul className="space-y-3 text-gray-700 font-bold mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Unlimited curator contacts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Advanced AI customization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Team collaboration tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    White-label options
                  </li>
                </ul>
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" onClick={() => handlePricingTrial('agency')}>
                  Start Free Trial
                </button>
              </div>
            </div>

            <div className="bg-gray-50 border-4 border-gray-300 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-black text-gray-900 mb-4">Custom</div>
                <ul className="space-y-3 text-gray-700 font-bold mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Advanced reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    API access
                  </li>
                </ul>
                <button className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg transition-colors font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" onClick={handleContactSales}>
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border-4 border-gray-300 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <button
                  className="w-full flex justify-between items-center text-lg font-black text-left text-gray-900 focus:outline-none hover:text-yellow-600 transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
                {openFaq === i && (
                  <div className="pt-4 text-gray-700 font-bold text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            Ready to 3x Your Playlist Response Rate?
          </h2>
          <p className="text-xl text-gray-700 font-bold mb-8">
            Join 10,000+ artists and agencies who've stopped wasting time on playlist research.
          </p>
          
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-12 py-6 text-xl rounded-2xl transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 flex items-center gap-2 mx-auto mb-6" onClick={handleFinalCTA}>
            <Upload className="h-6 w-6" />
            Upload Your Track Now - Get Curators in 3 Minutes
          </button>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 font-bold">
            <span>7-Day Free Trial</span>
            <span>No Credit Card</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Cross-Promotion Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-400/10 to-blue-600/10 border border-blue-400/20 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-400 rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Need contact enrichment?</h3>
                  <p className="text-white/80 font-bold">Try Audio Intel - our sister tool for enriching music industry contacts with AI-powered insights</p>
                </div>
              </div>
              <Link 
                href="https://audiointel.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                onClick={() => trackCrossPromotionClick('audio_intel', 'footer')}
              >
                <span>Try Audio Intel</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Image 
                    src="/assets/logo/t-a-p-new dog logo.png" 
                    alt="Total Audio Promo Logo" 
                    width={40} 
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <span className="text-2xl font-black">Playlist Pulse</span>
              </div>
              <p className="text-lg font-bold text-gray-300 mb-8">
                AI-powered playlist curator discovery and pitch generation. Get your music heard by the right people. Powered by Total Audio Promo.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Product</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#pricing" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-300 hover:text-white font-bold transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-300 hover:text-white font-bold transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Start Free Trial
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Our Ecosystem</h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="https://audiointel.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-white font-bold transition-colors"
                    onClick={() => trackCrossPromotionClick('audio_intel', 'footer_ecosystem')}
                  >
                    <Database className="w-4 h-4" />
                    <span>Audio Intel</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/documentation" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://totalaudiopromo.com/about" className="text-gray-300 hover:text-white font-bold transition-colors">
                    About Total Audio Promo
                  </a>
                </li>
                <li>
                  <a href="https://totalaudiopromo.com/blog" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-bold">
              © 2025 Playlist Pulse - Powered By Total Audio Promo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}