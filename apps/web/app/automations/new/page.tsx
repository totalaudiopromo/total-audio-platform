/**
 * New Automation Wizard
 * /automations/new
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORKFLOW_TEMPLATES, getTemplateCategories } from '../templates';

export default function NewAutomationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'event' | 'schedule' | 'manual'>('event');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createFlow() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/automations/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          triggerType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/automations/${data.data.id}`);
      } else {
        setError(data.message || 'Failed to create automation');
      }
    } catch (err) {
      setError('Failed to create automation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const categories = getTemplateCategories();

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Create Automation</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-240 ${
                  step >= s
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all duration-240 ${
                    step > s ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Automation Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-240"
                  placeholder="e.g., Post-Release Follow-Up"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-240"
                  placeholder="Describe what this automation does..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!name}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-all duration-240"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Trigger Type */}
        {step === 2 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Trigger Type</h2>

            <div className="space-y-4 mb-8">
              {[
                {
                  value: 'event' as const,
                  label: 'Event-Based',
                  description: 'Triggered by events like email opens, campaign status changes',
                },
                {
                  value: 'schedule' as const,
                  label: 'Scheduled',
                  description: 'Run on a recurring schedule (hourly, daily, weekly)',
                },
                {
                  value: 'manual' as const,
                  label: 'Manual',
                  description: 'Trigger manually when needed',
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTriggerType(option.value)}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-240 ${
                    triggerType === option.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white mb-1">{option.label}</div>
                  <div className="text-sm text-slate-400">{option.description}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-240"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-all duration-240"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Template (Optional) */}
        {step === 3 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-2">
              Choose a Template (Optional)
            </h2>
            <p className="text-slate-400 mb-6">
              Start with a prebuilt template or build from scratch
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setSelectedTemplate(null)}
                className={`p-6 rounded-xl border-2 text-left transition-all duration-240 ${
                  selectedTemplate === null
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white mb-1">Blank Canvas</div>
                <div className="text-sm text-slate-400">
                  Start from scratch and build your own workflow
                </div>
              </button>

              {WORKFLOW_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-240 ${
                    selectedTemplate === template.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white mb-1">{template.name}</div>
                  <div className="text-sm text-slate-400 mb-2">
                    {template.description}
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                    {template.category.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-240"
              >
                Back
              </button>
              <button
                onClick={createFlow}
                disabled={loading}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-all duration-240"
              >
                {loading ? 'Creating...' : 'Create Automation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
