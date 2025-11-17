'use client';

import { Fingerprint, Shield, Zap, CheckCircle } from 'lucide-react';

/**
 * VoiceGuard™ Brand Components
 *
 * Consistent branding for VoiceGuard voice preservation technology
 */

interface VoiceGuardLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function VoiceGuardLogo({ size = 'md', showText = true }: VoiceGuardLogoProps) {
  const sizes = {
    sm: { icon: 'h-5 w-5', text: 'text-sm' },
    md: { icon: 'h-8 w-8', text: 'text-lg' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <Fingerprint className={`${sizes[size].icon} text-brand-amber-dark`} />
      {showText && (
        <span className={`${sizes[size].text} font-black text-brand-amber-dark`}>VoiceGuard™</span>
      )}
    </div>
  );
}

export function VoiceGuardBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 border-2 border-brand-amber px-3 py-1 text-xs font-black text-brand-amber-dark">
      <Fingerprint className="h-3 w-3" />
      VoiceGuard™
    </span>
  );
}

interface VoiceGuardFeatureBoxProps {
  title: string;
  description: string;
}

export function VoiceGuardFeatureBox({ title, description }: VoiceGuardFeatureBoxProps) {
  return (
    <div className="rounded-xl border-2 border-brand-amber bg-brand-amber/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Fingerprint className="h-5 w-5 text-brand-amber-dark" />
        <h4 className="text-sm font-black text-brand-amber-dark">{title}</h4>
      </div>
      <p className="text-xs text-gray-900/70">{description}</p>
    </div>
  );
}

export function VoiceGuardExplainer() {
  return (
    <div className="rounded-2xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Fingerprint className="h-12 w-12 text-brand-amber-dark" />
          <h2 className="text-3xl font-black">VoiceGuard™ Technology</h2>
        </div>
        <p className="text-gray-900/60 max-w-2xl mx-auto">
          Advanced AI voice preservation that ensures your pitches sound authentic, not robotic
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-amber/10 border-2 border-brand-amber mb-4">
            <Shield className="h-6 w-6 text-brand-amber-dark" />
          </div>
          <h3 className="font-black text-lg mb-2">Preserves Your Voice</h3>
          <p className="text-sm text-gray-900/60">
            Analyzes your writing patterns, tone, and credibility markers to maintain authenticity
          </p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-amber/10 border-2 border-brand-amber mb-4">
            <Zap className="h-6 w-6 text-brand-amber-dark" />
          </div>
          <h3 className="font-black text-lg mb-2">Scales Personalisation</h3>
          <p className="text-sm text-gray-900/60">
            Generate 50 personalised pitches that sound like you wrote each one individually
          </p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-amber/10 border-2 border-brand-amber mb-4">
            <CheckCircle className="h-6 w-6 text-brand-amber-dark" />
          </div>
          <h3 className="font-black text-lg mb-2">Proven Results</h3>
          <p className="text-sm text-gray-900/60">
            15-20% response rates vs 3-5% with generic AI pitches
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-900/50">
          VoiceGuard™ is powered by Anthropic Claude and trained on professional music industry
          communication patterns
        </p>
      </div>
    </div>
  );
}

interface VoiceGuardStatusProps {
  active: boolean;
  profileCompleted: boolean;
}

export function VoiceGuardStatus({ active, profileCompleted }: VoiceGuardStatusProps) {
  if (!active || !profileCompleted) {
    return (
      <div className="rounded-xl border-2 border-gray-300 bg-gray-50 p-4 flex items-center gap-3">
        <Fingerprint className="h-5 w-5 text-gray-400" />
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600">VoiceGuard™ Inactive</p>
          <p className="text-xs text-gray-500">
            Complete your voice profile to enable authentic tone preservation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-success bg-success/5 p-4 flex items-center gap-3">
      <VoiceGuardBadge />
      <div className="flex-1">
        <p className="text-sm font-bold text-success">VoiceGuard™ Active</p>
        <p className="text-xs text-gray-900/60">Generating pitches in your authentic voice</p>
      </div>
    </div>
  );
}
