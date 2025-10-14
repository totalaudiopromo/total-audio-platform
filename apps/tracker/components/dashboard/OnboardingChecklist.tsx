'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Sparkles, X } from 'lucide-react';

interface OnboardingChecklistProps {
  hasCampaigns: boolean;
  hasResults: boolean;
  hasIntegrations: boolean;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: {
    label: string;
    href: string;
  };
}

export function OnboardingChecklist({
  hasCampaigns,
  hasResults,
  hasIntegrations,
}: OnboardingChecklistProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const items: ChecklistItem[] = [
    {
      id: 'create-campaign',
      title: 'Create your first campaign',
      description: 'Set up a campaign to start tracking your music promotion',
      completed: hasCampaigns,
      action: {
        label: 'Create Campaign',
        href: '#new-campaign-trigger',
      },
    },
    {
      id: 'import-contacts',
      title: 'Import contacts from Audio Intel',
      description: 'Bring in enriched contacts or upload a CSV file',
      completed: hasIntegrations,
      action: {
        label: 'Import Contacts',
        href: '/dashboard/import',
      },
    },
    {
      id: 'log-results',
      title: 'Log your first result',
      description: 'Add campaign results to unlock AI-powered insights',
      completed: hasResults,
      action: {
        label: 'Add Results',
        href: '#',
      },
    },
  ];

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const isFullyComplete = completedCount === totalCount;

  // Don't show if dismissed or fully complete
  if (isDismissed || isFullyComplete) return null;

  return (
    <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-4 border-purple-500 shadow-brutal relative overflow-hidden">
      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white border-2 border-purple-300 hover:bg-purple-50 transition-all z-10"
        aria-label="Dismiss checklist"
      >
        <X className="h-4 w-4 text-purple-700" />
      </button>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-10">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-600 rounded-2xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Get Started with Tracker
            </h2>
            <p className="text-sm font-bold text-gray-700">
              Complete these steps to unlock the full power of campaign intelligence
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-gray-900 uppercase tracking-wider">
              Progress: {completedCount}/{totalCount}
            </span>
            <span className="text-sm font-bold text-purple-600">
              {Math.round((completedCount / totalCount) * 100)}% Complete
            </span>
          </div>
          <div className="h-3 bg-white rounded-full border-2 border-black overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border-2 p-4 transition-all ${
                item.completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className={`text-base font-bold mb-1 ${
                      item.completed
                        ? 'text-green-900 line-through'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm font-medium mb-3 ${
                      item.completed ? 'text-green-700' : 'text-gray-600'
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Action Button */}
                  {!item.completed && (
                    <Link
                      href={item.action.href}
                      onClick={(e) => {
                        if (item.action.href.startsWith('#')) {
                          e.preventDefault();
                          const target = document.querySelector(item.action.href);
                          if (target) {
                            (target as HTMLElement).click();
                          }
                        }
                      }}
                      className="inline-block px-5 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
                    >
                      {item.action.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Encouragement Message */}
        {completedCount > 0 && (
          <div className="mt-6 bg-white rounded-xl border-2 border-purple-300 p-4 text-center">
            <p className="text-sm font-bold text-purple-900">
              {completedCount === 1 && "🎉 Great start! Keep going to unlock AI insights."}
              {completedCount === 2 && "🚀 Almost there! Complete the final step."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
