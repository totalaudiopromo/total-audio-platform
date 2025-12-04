'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@total-audio/core-db/client';
import {
  Sparkles,
  Upload,
  Zap,
  Send,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  Clock,
  Target,
} from 'lucide-react';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Audio Intel',
    description: 'Transform 15 hours of contact research into 15 minutes',
    icon: Sparkles,
  },
  {
    id: 'upload',
    title: 'Upload Your Contacts',
    description: 'Start with a CSV or try our sample data',
    icon: Upload,
  },
  {
    id: 'enrich',
    title: 'Watch the Magic',
    description: 'AI enriches your contacts with verified data',
    icon: Zap,
  },
  {
    id: 'export',
    title: 'Export to Pitch Generator',
    description: 'One-click export for personalised outreach',
    icon: Send,
  },
  {
    id: 'track',
    title: 'Track Your Campaigns',
    description: 'Measure success with industry benchmarks',
    icon: BarChart3,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load progress from localStorage first (runs once on mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tap_onboarding_step');
      if (saved) {
        const savedStep = parseInt(saved, 10);
        if (!isNaN(savedStep) && savedStep >= 0 && savedStep < STEPS.length) {
          setCurrentStep(savedStep);
        }
      }
      setHasLoadedFromStorage(true);
    }
  }, []);

  // Save progress to localStorage (only after initial load is complete)
  useEffect(() => {
    if (hasLoadedFromStorage && typeof window !== 'undefined') {
      localStorage.setItem('tap_onboarding_step', String(currentStep));
    }
  }, [currentStep, hasLoadedFromStorage]);

  const handleComplete = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('user_profiles').update({ onboarding_completed: true }).eq('id', user.id);
    }

    localStorage.removeItem('tap_onboarding_step');
    router.push('/dashboard');
  };

  const handleSkip = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          onboarding_skipped_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    localStorage.removeItem('tap_onboarding_step');
    router.push('/dashboard');
  };

  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        disabled={isLoading}
        className="fixed top-4 right-4 px-4 py-2 text-gray-600 font-bold hover:text-gray-900 transition-colors z-50 min-h-[44px]"
      >
        Skip for now
      </button>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-24">
        {/* Step indicator */}
        <div className="text-center mb-8">
          <span className="text-sm font-black uppercase tracking-wider text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Step card */}
        <div className="bg-white rounded-2xl border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6">
            <StepIcon className="h-8 w-8 text-blue-600" />
          </div>

          {/* Title & description */}
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-3">
            {step.title}
          </h1>
          <p className="text-gray-600 font-bold text-center mb-8">{step.description}</p>

          {/* Step-specific content */}
          <div className="mb-8">
            {currentStep === 0 && <WelcomeContent />}
            {currentStep === 1 && <UploadContent />}
            {currentStep === 2 && <EnrichContent />}
            {currentStep === 3 && <ExportContent />}
            {currentStep === 4 && <TrackContent />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            {isLastStep ? (
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 min-h-[44px]"
              >
                {isLoading ? 'Loading...' : 'Get Started'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all min-h-[44px]"
              >
                Continue
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-600 w-6'
                  : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-300'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 1: Welcome
function WelcomeContent() {
  return (
    <div className="space-y-6">
      {/* Value prop stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-black">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-black text-gray-900">Time Saved</span>
          </div>
          <p className="text-2xl font-black text-blue-600">15 hours → 15 minutes</p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border-2 border-black">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="font-black text-gray-900">Success Rate</span>
          </div>
          <p className="text-2xl font-black text-green-600">100% enrichment</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border-2 border-black">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-black text-gray-900">Data Quality</span>
          </div>
          <p className="text-2xl font-black text-blue-600">Verified contacts</p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <p className="text-gray-700 font-bold italic mb-3">
          "Audio Intel transformed my workflow. What used to take me an entire weekend now takes
          less time than making a cuppa. The contact data is spot-on — I've had responses from BBC
          Radio 6 Music contacts I never would've found manually."
        </p>
        <p className="text-gray-600 font-black">— Radio Promoter, 5+ years experience</p>
      </div>

      {/* What you'll learn */}
      <div className="space-y-3">
        <h3 className="font-black text-gray-900">What you'll learn:</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 font-bold">
              How to upload and enrich your contact lists
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 font-bold">
              How to export enriched data for personalised pitches
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 font-bold">How to track your campaign performance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Step 2: Upload
function UploadContent() {
  return (
    <div className="space-y-6">
      {/* File format guidance */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          CSV Format Requirements
        </h3>
        <p className="text-gray-700 font-bold mb-4">
          Your CSV should include at least one of these columns:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border-2 border-black">
            <p className="font-black text-gray-900">Required columns:</p>
            <ul className="mt-2 space-y-1 text-gray-700 font-bold text-sm">
              <li>• Name (station or contact name)</li>
              <li>• Email (optional but helpful)</li>
              <li>• Website (optional but helpful)</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-3 border-2 border-black">
            <p className="font-black text-gray-900">We'll add:</p>
            <ul className="mt-2 space-y-1 text-gray-700 font-bold text-sm">
              <li>• Verified email addresses</li>
              <li>• Social media profiles</li>
              <li>• Contact preferences</li>
              <li>• Genre focus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example CSV */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-black text-gray-900 mb-3">Example CSV format:</h3>
        <div className="bg-white rounded-lg p-4 border-2 border-black font-mono text-sm overflow-x-auto">
          <pre className="text-gray-700">
            {`Name,Email,Website
BBC Radio 6 Music,,https://bbc.co.uk/6music
Amazing Radio,info@amazingradio.com,
Indie Station,,https://indiestation.co.uk`}
          </pre>
        </div>
      </div>

      {/* Sample data button */}
      <div className="text-center">
        <p className="text-gray-600 font-bold mb-3">Don't have a CSV ready? No problem.</p>
        <button
          onClick={() => {
            // This would trigger sample data load in real implementation
            alert('Sample data feature coming soon!');
          }}
          className="px-6 py-3 bg-green-600 text-white font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all min-h-[44px]"
        >
          Try Sample Data
        </button>
      </div>
    </div>
  );
}

// Step 3: Enrich
function EnrichContent() {
  return (
    <div className="space-y-6">
      {/* Process visualization */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-900 text-center">The Enrichment Process</h3>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black">
              1
            </div>
            <div>
              <p className="font-black text-gray-900">AI Analysis</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                Our AI analyses your contact list and identifies missing information
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-black">
              2
            </div>
            <div>
              <p className="font-black text-gray-900">Data Discovery</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                We search across multiple verified sources for accurate contact details
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black">
              3
            </div>
            <div>
              <p className="font-black text-gray-900">Verification</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                Every contact is verified for accuracy before being added to your list
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success metrics */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-black text-gray-900 mb-4 text-center">Enrichment Results</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600 mb-1">100%</p>
            <p className="text-gray-700 font-bold text-sm">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-green-600 mb-1">~15min</p>
            <p className="text-gray-700 font-bold text-sm">Average Time</p>
          </div>
        </div>
      </div>

      {/* Real example */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="font-black text-gray-900 mb-3">Real Example:</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border-2 border-black">
            <p className="text-gray-600 font-bold text-sm mb-1">Before enrichment:</p>
            <p className="font-mono text-sm text-gray-700">
              BBC Radio 6 Music, [no email], https://bbc.co.uk/6music
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block bg-green-600 text-white rounded-full p-2">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border-2 border-black">
            <p className="text-gray-600 font-bold text-sm mb-1">After enrichment:</p>
            <p className="font-mono text-sm text-gray-700">
              BBC Radio 6 Music, music@bbc.co.uk, Twitter: @BBC6Music, Genre: Alternative/Indie
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Export
function ExportContent() {
  return (
    <div className="space-y-6">
      {/* Export flow diagram */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-900 text-center">Seamless Integration</h3>

        <div className="flex items-center justify-center gap-4">
          <div className="bg-blue-100 rounded-xl p-4 border-2 border-black text-center">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-black text-gray-900 text-sm">Audio Intel</p>
            <p className="text-gray-600 font-bold text-xs">Enriched Contacts</p>
          </div>

          <ChevronRight className="h-6 w-6 text-gray-400" />

          <div className="bg-green-100 rounded-xl p-4 border-2 border-black text-center">
            <Send className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-black text-gray-900 text-sm">Pitch Generator</p>
            <p className="text-gray-600 font-bold text-xs">Personalised Pitches</p>
          </div>
        </div>
      </div>

      {/* What Pitch Generator does */}
      <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
        <h3 className="font-black text-gray-900 mb-4">Pitch Generator Features:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-gray-900">AI-Powered Personalisation</p>
              <p className="text-gray-700 font-bold text-sm">
                Each pitch is tailored to the recipient's preferences and genre focus
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-gray-900">Bulk Generation</p>
              <p className="text-gray-700 font-bold text-sm">
                Generate hundreds of personalised pitches in minutes, not hours
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-gray-900">Authentic Voice</p>
              <p className="text-gray-700 font-bold text-sm">
                Maintains your authentic voice whilst optimising for response rates
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Export process */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-black text-gray-900 mb-3">One-Click Export</h3>
        <p className="text-gray-700 font-bold mb-4">
          After enrichment is complete, simply click "Export to Pitch Generator" and your contacts
          are ready for personalised outreach.
        </p>
        <div className="bg-white rounded-lg p-4 border-2 border-black">
          <p className="text-gray-600 font-bold text-sm mb-2">Example export:</p>
          <ul className="space-y-1 text-gray-700 font-bold text-sm">
            <li>✓ All contact details preserved</li>
            <li>✓ Enrichment data included</li>
            <li>✓ Ready for AI pitch generation</li>
            <li>✓ No manual data entry required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Step 5: Track
function TrackContent() {
  return (
    <div className="space-y-6">
      {/* Campaign tracking overview */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Campaign Tracker Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-black">
            <p className="font-black text-gray-900 mb-2">Track Performance</p>
            <ul className="space-y-1 text-gray-700 font-bold text-sm">
              <li>• Email open rates</li>
              <li>• Response rates</li>
              <li>• Follow-up reminders</li>
              <li>• Success metrics</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-black">
            <p className="font-black text-gray-900 mb-2">Industry Benchmarks</p>
            <ul className="space-y-1 text-gray-700 font-bold text-sm">
              <li>• Compare to averages</li>
              <li>• Identify top performers</li>
              <li>• Optimise campaigns</li>
              <li>• Learn what works</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <h3 className="font-black text-gray-900">Why Track Your Campaigns?</h3>

        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-gray-900">Optimise Your Approach</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                Learn which contacts are most responsive and adjust your strategy accordingly
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-gray-900">Never Miss a Follow-Up</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                Automated reminders ensure you follow up at the right time
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-gray-900">Measure Success</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                Track your progress over time and prove ROI on your promotion efforts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success story */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-black text-gray-900 mb-3">Real Results:</h3>
        <p className="text-gray-700 font-bold italic mb-3">
          "The Campaign Tracker showed me that my Tuesday morning sends had 40% higher open rates
          than Friday afternoons. That one insight alone improved my response rate significantly."
        </p>
        <p className="text-gray-600 font-black text-sm">— Independent Artist, Sheffield</p>
      </div>

      {/* Ready to start */}
      <div className="bg-blue-600 text-white rounded-xl p-6 border-2 border-black text-center">
        <h3 className="font-black text-2xl mb-2">Ready to Transform Your Workflow?</h3>
        <p className="font-bold">Click "Get Started" to begin your Audio Intel journey</p>
      </div>
    </div>
  );
}
