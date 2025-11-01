'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConversionOptimizer, useSession } from '@/lib/conversion-optimizer';
import { cn } from '@/lib/utils';
import { Play, Star, TrendingUp, Users, Music, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

interface HeroVariant {
  headlines: {
    primary: string;
    secondary: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  socialProof: {
    testimonial: string;
    author: string;
    title: string;
  }[];
}

const defaultHero: HeroVariant = {
  headlines: {
    primary: 'Get Your Music on UK Playlists That Actually Matter',
    secondary:
      'Connect with verified UK playlist curators and grow your streaming numbers with targeted submissions that work.',
  },
  cta: {
    primary: 'Start Free Trial',
    secondary: 'No credit card required',
  },
  features: [
    {
      title: 'Verified UK Curators',
      description: '2,500+ active playlist curators',
      icon: 'verified',
    },
    {
      title: 'Smart Matching',
      description: 'AI-powered genre and mood matching',
      icon: 'target',
    },
    {
      title: 'Real Results',
      description: 'Average 50K+ streams per placement',
      icon: 'trending',
    },
  ],
  socialProof: [
    {
      testimonial:
        'Finally got my track on a 50K playlist that actually gets streams. Game changer.',
      author: 'Jamie Chen',
      title: 'Electronic Producer, Manchester',
    },
  ],
};

export default function HeroSection({ className }: HeroSectionProps) {
  const { sessionId } = useSession();
  const { assignVariant, getVariantConfig, trackEvent } = useConversionOptimizer();

  const [heroContent, setHeroContent] = useState<HeroVariant>(defaultHero);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    // Track page view
    if (!hasTrackedView) {
      trackEvent({
        eventType: 'page_view',
        variantId: 'hero-variant',
        testId: 'music-producer-pain-points-2025-01',
        sessionId,
      });
      setHasTrackedView(true);
    }

    // Get copy variant
    const copyVariant = assignVariant(sessionId, 'music-producer-pain-points-2025-01');
    const copyConfig = getVariantConfig(sessionId, 'music-producer-pain-points-2025-01');

    if (copyConfig?.copy) {
      setHeroContent({
        headlines: copyConfig.copy.headlines,
        cta: copyConfig.copy.cta,
        features: copyConfig.copy.features,
        socialProof: copyConfig.copy.socialProof,
      });
    }
  }, [sessionId, assignVariant, getVariantConfig, trackEvent, hasTrackedView]);

  const handleCtaClick = (ctaType: 'primary' | 'secondary') => {
    trackEvent({
      eventType: 'cta_click',
      variantId: 'hero-variant',
      testId: 'music-producer-pain-points-2025-01',
      sessionId,
      metadata: { ctaType, location: 'hero' },
    });
  };

  const getFeatureIcon = (iconName: string) => {
    const iconProps = { className: 'w-6 h-6 text-blue-400' };

    switch (iconName) {
      case 'verified':
        return <CheckCircle {...iconProps} />;
      case 'target':
        return <Star {...iconProps} />;
      case 'trending':
        return <TrendingUp {...iconProps} />;
      case 'automation':
        return <Play {...iconProps} />;
      case 'uk-flag':
        return <Users {...iconProps} />;
      case 'chart':
        return <TrendingUp {...iconProps} />;
      case 'mentor':
        return <Users {...iconProps} />;
      default:
        return <Music {...iconProps} />;
    }
  };

  return (
    <section className={cn('relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden', className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Social Proof Badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Star className="w-3 h-3 mr-1" />
                Trusted by 5,000+ UK Producers
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                50M+ Streams Generated
              </Badge>
            </div>

            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {heroContent.headlines.primary}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                {heroContent.headlines.secondary}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold h-auto"
                  onClick={() => handleCtaClick('primary')}
                >
                  {heroContent.cta.primary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg h-auto"
                  onClick={() => handleCtaClick('secondary')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-gray-400">{heroContent.cta.secondary}</p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {heroContent.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual/Demo */}
          <div className="relative">
            {/* Glassmorphism Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                {/* Fake Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Active Submissions</h3>
                    <Badge className="bg-green-500/20 text-green-400">Live</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">New Music Friday UK</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        47K followers • Electronic • Reviewed in 24h
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">UK Indie Discoveries</span>
                        <Badge className="bg-green-500/20 text-green-400">Accepted</Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        23K followers • Indie Rock • +2.3K streams
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">London Beats</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Under Review</Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        89K followers • Hip Hop • Response due tomorrow
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">127</div>
                      <div className="text-xs text-gray-400">Playlists</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">45.2K</div>
                      <div className="text-xs text-gray-400">New Streams</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
              +47%
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              <Music className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Social Proof Testimonial */}
        {heroContent.socialProof.length > 0 && (
          <div className="mt-20 text-center">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-xl text-gray-300 italic">
                "{heroContent.socialProof[0].testimonial}"
              </blockquote>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {heroContent.socialProof[0].author.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">
                    {heroContent.socialProof[0].author}
                  </div>
                  <div className="text-gray-400 text-sm">{heroContent.socialProof[0].title}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm mb-6">As featured in</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-gray-500 font-semibold">BBC Introducing</div>
            <div className="text-gray-500 font-semibold">NME</div>
            <div className="text-gray-500 font-semibold">Mixmag</div>
            <div className="text-gray-500 font-semibold">DJ Mag</div>
          </div>
        </div>
      </div>
    </section>
  );
}
