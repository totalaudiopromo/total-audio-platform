'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BetaSignup {
  name: string;
  email: string;
  role: 'independent-artist' | 'pr-agency' | 'label' | 'other';
  interests: string[];
  referralSource: string;
  currentTools: string;
  goals: string;
}

export default function BetaSignupPage() {
  const [formData, setFormData] = useState<BetaSignup>({
    name: '',
    email: '',
    role: 'independent-artist',
    interests: [],
    referralSource: '',
    currentTools: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Track the beta signup
        await fetch('/api/beta-tracker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: `beta-${Date.now()}`,
            email: formData.email,
            app: 'beta-signup',
            action: 'signup',
            timestamp: new Date().toISOString()
          }),
        });
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Beta signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 border-4 border-black text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Welcome to Audio Intel Beta!</h1>
          <p className="text-gray-700 mb-8 text-lg font-bold">
            Thank you for joining the future of music promotion! Your beta access is ready.
          </p>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border-2 border-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-blue-900 mb-4 text-xl">Your Beta Includes:</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left font-bold">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                100 contact enrichments per month
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                200 email validations per month
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                10 CSV exports per month
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                Direct founder support
              </li>
            </ul>
          </div>

          <a 
            href="http://localhost:3001" 
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white font-black py-4 px-8 rounded-lg hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Start Using Audio Intel Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <Image 
              src="/t-a-p-new dog logo.png" 
              alt="Total Audio Promo Logo" 
              width={112} 
              height={112}
              className="rounded-lg w-20 h-20 sm:w-28 sm:h-28"
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Join Audio Intel Beta
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-gray-700 max-w-2xl mx-auto px-4">
            Revolutionary contact enrichment and email validation for music professionals. 
            <span className="block mt-2 text-gray-600">Shape the future of artist success.</span>
          </p>
        </div>

        {/* Beta Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 border-4 border-black">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-8">
            <label className="block text-sm font-black text-gray-900 mb-4">I am a... *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'independent-artist', label: 'Independent Artist' },
                { value: 'pr-agency', label: 'PR Agency' },
                { value: 'label', label: 'Record Label' },
                { value: 'other', label: 'Other' }
              ].map((role) => (
                <label key={role.value} className="relative">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    formData.role === role.value
                      ? 'border-blue-500 bg-blue-50 text-blue-800 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-gray-300 bg-white hover:border-gray-400 font-bold text-gray-700'
                  }`}>
                    <div className="text-sm">{role.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <label className="block text-sm font-black text-gray-900 mb-4">Audio Intel features I'm most interested in... (select all that apply)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Contact enrichment & data enhancement',
                'Email validation & verification',
                'Industry contact database access',
                'AI-powered contact intelligence',
                'Multi-client agency dashboard',
                'CSV export & data management'
              ].map((interest) => (
                <label key={interest} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 hover:border-gray-400 cursor-pointer transition-all duration-200 bg-white hover:shadow-sm">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Tools */}
          <div className="mb-8">
            <label className="block text-sm font-black text-gray-900 mb-3">What tools do you currently use for contact enrichment or music promotion?</label>
            <textarea
              value={formData.currentTools}
              onChange={(e) => setFormData(prev => ({ ...prev, currentTools: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900"
              rows={3}
              placeholder="e.g., SubmitHub, Groover, Chartmetric, Apollo, ZoomInfo, etc."
            />
          </div>

          {/* Goals */}
          <div className="mb-10">
            <label className="block text-sm font-black text-gray-900 mb-3">What are your main goals with Audio Intel?</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900"
              rows={3}
              placeholder="e.g., Build verified industry contacts, validate email lists, enrich existing contacts with social data..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white font-black py-4 px-8 rounded-lg hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Joining Audio Intel Beta...' : 'Join Audio Intel Beta'}
          </button>

          <p className="text-sm text-gray-600 text-center mt-6 font-semibold">
            By joining, you help shape the future of Audio Intel with your feedback.
          </p>
        </form>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-lg text-gray-700 font-bold">
            Questions? Email <a href="mailto:info@totalaudiopromo.com" className="text-blue-600 hover:text-blue-700 font-black underline">info@totalaudiopromo.com</a>
          </p>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            We respond within 2 hours during UK business hours
          </p>
        </div>
      </div>
    </div>
  );
}