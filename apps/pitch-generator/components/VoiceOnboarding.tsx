'use client';

import { useState } from 'react';
import { X, Sparkles, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface VoiceOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupLater: () => void;
  onSetupNow: () => void;
}

export function VoiceOnboarding({ isOpen, onClose, onSetupLater, onSetupNow }: VoiceOnboardingProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Welcome to Pitch Generator!
          </h2>
          <p className="text-gray-600 font-medium">
            Set up your authentic voice to generate personalized pitches that sound like you
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <Zap className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="font-black text-gray-900 mb-1">Fast Setup</h3>
            <p className="text-sm text-gray-700">Takes 2-3 minutes to complete</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-black text-gray-900 mb-1">Sounds Like You</h3>
            <p className="text-sm text-gray-700">Pitches match your real voice</p>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <Sparkles className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="font-black text-gray-900 mb-1">Better Results</h3>
            <p className="text-sm text-gray-700">Authentic pitches get more replies</p>
          </div>
        </div>

        {/* What we need */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-black text-gray-900 mb-3">What we'll ask you:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Your background:</strong> Who you are in the music industry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Your style:</strong> How you communicate (casual, professional, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Your approach:</strong> How you like to pitch your music</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Your wins:</strong> Achievements that build credibility</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onSetupNow}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-black px-6 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Set Up My Voice (2 mins)
          </button>
          <button
            onClick={onSetupLater}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-bold px-6 py-4 rounded-xl border-2 border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can always set this up later in your profile settings
        </p>
      </div>
    </div>
  );
}
