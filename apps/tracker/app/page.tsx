'use client';

import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth/AuthButton';
import { 
  ChartBarIcon, 
  PlayIcon, 
  SpeakerWaveIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <PlayIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tracker</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Pricing
              </a>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-6">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Used by 500+ Independent Artists & PR Agencies
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Stop Tracking Campaigns
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Spreadsheets
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Real-time campaign analytics across Spotify, radio, and social media.
            Built for indie artists and PR agencies who need professional insights without the chaos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              onClick={() => window.location.href = '/signup'}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
            >
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-slate-500">
            No credit card required • 14-day free trial • Setup in under 2 minutes
          </p>
        </div>

        {/* Features Grid */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Professional Campaign Tracking
              <br />
              <span className="text-2xl md:text-3xl font-bold text-slate-600">Without The Spreadsheet Chaos</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything indie artists and PR agencies need to track campaigns like the pros.
              No more scattered Excel files or lost data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Watch your campaign metrics update live across streaming platforms, social media, and radio.
                No more waiting days for spreadsheet updates.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SpeakerWaveIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Multi-Platform Tracking
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Spotify, Apple Music, YouTube, Instagram, TikTok, and radio plays—all in one dashboard.
                Finally, see the complete picture.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DocumentTextIcon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Professional Reports
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Generate label-ready reports in seconds with custom branding.
                Impress managers and stakeholders with polished insights.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserGroupIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Share campaigns, assign roles, and stay aligned with your team.
                Perfect for PR agencies managing multiple artists.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClockIcon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Time-Saving Automation
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Auto-collect data, generate reports, and set up smart alerts.
                Spend less time tracking, more time creating.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PlayIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Release Tracking
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Track every release from pre-save to post-campaign with granular metrics.
                Understand what works and replicate success.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 hover:border-blue-300 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-5xl font-black text-slate-900">Free</span>
                </div>
                <p className="text-slate-600">Perfect for testing the waters</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">1 active campaign</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">5 tracked platforms</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" size="lg" onClick={() => window.location.href = '/signup'}>
                Get Started
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-xl border-2 border-transparent relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-5xl font-black text-white">£19</span>
                  <span className="text-white/80">/month</span>
                </div>
                <p className="text-white/90">For serious indie artists</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-white">10 active campaigns</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-white">Advanced analytics & reports</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-white">Unlimited platforms</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-white">Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-slate-50" size="lg" onClick={() => window.location.href = '/signup'}>
                Start Free Trial
              </Button>
            </div>

            {/* Agency Tier */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 hover:border-purple-300 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Agency</h3>
                <div className="mb-4">
                  <span className="text-5xl font-black text-slate-900">£79</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600">For PR agencies & labels</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Unlimited campaigns</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Team collaboration tools</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">White-label reports</span>
                </li>
                <li className="flex items-start">
                  <ChartBarIcon className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Dedicated account manager</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" size="lg" onClick={() => window.location.href = '/signup'}>
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-16 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Stop Drowning In Spreadsheets
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join 500+ indie artists and PR agencies tracking campaigns with professional tools.
            Setup takes under 2 minutes.
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            onClick={() => window.location.href = '/signup'}
          >
            Start Your Free Trial
          </Button>
          <p className="text-sm text-white/80 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PlayIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Tracker</span>
            </div>
            <div className="text-sm text-slate-400">
              © 2024 Tracker. Built for the music industry.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
