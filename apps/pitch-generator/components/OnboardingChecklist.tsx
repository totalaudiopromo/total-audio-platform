'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  href: string;
  completed: boolean;
}

interface OnboardingChecklistProps {
  userId: string;
}

export function OnboardingChecklist({ userId }: OnboardingChecklistProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'add_contact',
      title: 'Add your first contact',
      description: 'Import or add a radio station, blog, or playlist contact',
      href: '/pitch/contacts',
      completed: false,
    },
    {
      id: 'generate_pitch',
      title: 'Generate your first pitch',
      description: 'Create an AI-powered pitch using our proven templates',
      href: '/dashboard',
      completed: false,
    },
    {
      id: 'customize_voice',
      title: 'Customize your voice profile',
      description: 'Personalise how the AI writes pitches in your style',
      href: '/profile',
      completed: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchOnboardingStatus() {
      try {
        const response = await fetch('/api/user/onboarding-status');
        if (!response.ok) {
          console.error('Failed to fetch onboarding status');
          return;
        }

        const data = await response.json();

        setSteps(prevSteps =>
          prevSteps.map(step => ({
            ...step,
            completed: data[step.id] || false,
          }))
        );
      } catch (error) {
        console.error('Error fetching onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOnboardingStatus();
  }, [userId]);

  const completedCount = steps.filter(step => step.completed).length;
  const totalCount = steps.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  // Hide checklist when all steps completed
  if (completedCount === totalCount && !isLoading) {
    return null;
  }

  // Allow manual dismissal
  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to persist across page reloads
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding-dismissed', 'true');
    }
  };

  // Check if previously dismissed
  useEffect(() => {
    const dismissed =
      typeof window !== 'undefined' ? localStorage.getItem('onboarding-dismissed') : null;
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  return (
    <div className="glass-panel relative overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-amber-50/50 pointer-events-none" />

      <div className="relative px-6 py-6 sm:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Get Started with Pitch Generator</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Complete these steps to unlock the full power of AI pitch writing
              </p>
            </div>
          </div>

          {completedCount > 0 && (
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition"
            >
              Dismiss
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-900">
              {completedCount} of {totalCount} completed
            </span>
            <span className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {isLoading ? (
            <>
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-white/50 rounded-xl border-2 border-gray-200" />
                </div>
              ))}
            </>
          ) : (
            steps.map((step, index) => (
              <Link
                key={step.id}
                href={step.href}
                className={`block p-4 rounded-xl border-2 transition group ${
                  step.completed
                    ? 'bg-green-50 border-green-600 hover:bg-green-100'
                    : 'bg-white border-gray-300 hover:border-amber-600 hover:shadow-[2px_2px_0px_0px_rgba(147,51,234,0.3)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-amber-600 transition" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          step.completed ? 'text-green-900' : 'text-gray-900'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.completed && (
                        <span className="text-xs font-black uppercase tracking-wider text-green-600">
                          Done
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-0.5 ${
                        step.completed ? 'text-green-700' : 'text-gray-600'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  {!step.completed && (
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* CTA Footer */}
        {completedCount === 0 && !isLoading && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
            <p className="text-sm text-amber-900 font-bold">
              💡 Tip: Start by adding a contact from your existing spreadsheet or database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
