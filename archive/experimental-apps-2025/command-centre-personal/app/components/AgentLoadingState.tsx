'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { agentColorUtils, AGENT_STATUS_STATES } from '@/lib/agent-color-system';
import { Check, X, Zap, CheckCircle, XCircle, Rocket } from 'lucide-react';

interface LoadingStep {
  id: string;
  agentType: string;
  agentName: string;
  message: string;
  duration: number;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface AgentLoadingStateProps {
  workflow: 'contact-processing' | 'email-campaign' | 'data-analysis' | 'content-generation';
  onComplete?: () => void;
  onError?: (error: string) => void;
}

const AgentLoadingState: React.FC<AgentLoadingStateProps> = ({ workflow, onComplete, onError }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<LoadingStep[]>([]);

  // Define workflows with their agent sequences (useMemo to prevent recreation)
  const workflows = useMemo(
    () => ({
      'contact-processing': [
        {
          id: '1',
          agentType: 'contact-agent',
          agentName: 'Contact Validator',
          message: 'Validating contact data format and structure...',
          duration: 2000,
        },
        {
          id: '2',
          agentType: 'contact-agent',
          agentName: 'Duplicate Detector',
          message: 'Scanning for duplicate contacts across databases...',
          duration: 3000,
        },
        {
          id: '3',
          agentType: 'integration-agent',
          agentName: 'Industry Intelligence',
          message: 'Gathering music industry intelligence and contact insights...',
          duration: 4000,
        },
        {
          id: '4',
          agentType: 'contact-agent',
          agentName: 'Data Enrichment',
          message: 'Enriching contacts with social profiles and company data...',
          duration: 3500,
        },
        {
          id: '5',
          agentType: 'database-agent',
          agentName: 'Data Organiser',
          message: 'Organising enriched contacts into campaign-ready database...',
          duration: 2500,
        },
      ],
      'email-campaign': [
        {
          id: '1',
          agentType: 'content-generator',
          agentName: 'Content Generator',
          message: 'Creating personalised email content for your campaign...',
          duration: 3000,
        },
        {
          id: '2',
          agentType: 'email-scheduler',
          agentName: 'Campaign Scheduler',
          message: 'Scheduling emails for optimal delivery times...',
          duration: 2000,
        },
        {
          id: '3',
          agentType: 'email-scheduler',
          agentName: 'Delivery Engine',
          message: 'Sending personalised emails to verified contacts...',
          duration: 4000,
        },
      ],
      'data-analysis': [
        {
          id: '1',
          agentType: 'analytics-agent',
          agentName: 'Data Collector',
          message: 'Collecting performance metrics across all platforms...',
          duration: 2500,
        },
        {
          id: '2',
          agentType: 'analytics-agent',
          agentName: 'Pattern Analyzer',
          message: 'Analyzing engagement patterns and success metrics...',
          duration: 3500,
        },
        {
          id: '3',
          agentType: 'competitive-intel',
          agentName: 'Market Intelligence',
          message: 'Gathering competitive intelligence and market insights...',
          duration: 4000,
        },
      ],
      'content-generation': [
        {
          id: '1',
          agentType: 'viral-content-automation',
          agentName: 'Trend Analyzer',
          message: 'Analyzing current trends and viral content patterns...',
          duration: 3000,
        },
        {
          id: '2',
          agentType: 'content-generator',
          agentName: 'Content Creator',
          message: 'Generating original content optimized for your audience...',
          duration: 4500,
        },
        {
          id: '3',
          agentType: 'brand-validator',
          agentName: 'Brand Validator',
          message: 'Ensuring content aligns with Total Audio Promo branding...',
          duration: 2000,
        },
      ],
    }),
    []
  );

  // Initialize steps
  useEffect(() => {
    const workflowSteps = workflows[workflow].map(step => ({
      ...step,
      status: 'pending' as const,
    }));
    setSteps(workflowSteps);
  }, [workflow, workflows]);

  // Process steps sequentially
  useEffect(() => {
    if (steps.length === 0) return;

    const processStep = async (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        onComplete?.();
        return;
      }

      // Mark current step as active
      setSteps(prev =>
        prev.map((step, index) => ({
          ...step,
          status: index === stepIndex ? 'active' : step.status,
        }))
      );

      setCurrentStep(stepIndex);

      // Simulate processing time
      const currentStepData = steps[stepIndex];
      await new Promise(resolve => setTimeout(resolve, currentStepData.duration));

      // Mark current step as completed (with small chance of error for demo)
      const hasError = Math.random() < 0.05; // 5% chance of error

      setSteps(prev =>
        prev.map((step, index) => ({
          ...step,
          status: index === stepIndex ? (hasError ? 'error' : 'completed') : step.status,
        }))
      );

      if (hasError) {
        onError?.(`Error in ${currentStepData.agentName}: Simulated processing error`);
        return;
      }

      // Process next step
      setTimeout(() => processStep(stepIndex + 1), 500);
    };

    processStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]); // Only run when steps are first set, other deps intentionally omitted

  const renderStep = (step: LoadingStep, index: number) => {
    const theme = agentColorUtils.getAgentTheme(step.agentType);
    const isActive = step.status === 'active';
    const isCompleted = step.status === 'completed';
    const isError = step.status === 'error';
    const isPending = step.status === 'pending';

    return (
      <div
        key={step.id}
        className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-500 ${
          isActive ? 'scale-105 shadow-xl' : 'shadow-lg'
        }`}
        style={{
          backgroundColor: isError ? '#FFEBEE' : theme.secondary,
          borderColor: isError ? '#F44336' : theme.primary,
          opacity: isPending ? 0.5 : 1,
          boxShadow: isActive ? `0 0 20px ${theme.primary}40` : undefined,
        }}
      >
        {/* Step Number & Status */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg"
          style={{
            backgroundColor: isError ? '#F44336' : isCompleted ? '#4CAF50' : theme.primary,
            color: 'white',
          }}
        >
          {isCompleted ? (
            <Check className="w-5 h-5" />
          ) : isError ? (
            <X className="w-5 h-5" />
          ) : isActive ? (
            <Zap className="w-5 h-5" />
          ) : (
            index + 1
          )}
        </div>

        {/* Agent Icon */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full text-xl"
          style={{ backgroundColor: theme.primary + '20' }}
        >
          {theme.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="font-bold text-lg mb-1"
            style={{ color: isError ? '#F44336' : theme.accent }}
          >
            {step.agentName}
          </h3>
          <p className="text-sm" style={{ color: isError ? '#C62828' : theme.accent + 'CC' }}>
            {isError ? 'Processing failed - retrying...' : step.message}
          </p>
        </div>

        {/* Progress Indicator */}
        {isActive && (
          <div className="flex items-center justify-center w-8 h-8">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: theme.primary, borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {isCompleted && (
          <div className="flex items-center justify-center w-8 h-8">
            <CheckCircle className="w-6 h-6 text-green-500 animate-bounce" />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center w-8 h-8">
            <XCircle className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  const completedCount = steps.filter(step => step.status === 'completed').length;
  const totalCount = steps.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          <Rocket className="w-8 h-8 inline mr-2" />
          Agent Workflow in Progress
        </h1>
        <p className="text-lg text-gray-600">
          Multiple agents are working together to process your request
        </p>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>
              {completedCount}/{totalCount} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">{steps.map(renderStep)}</div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>This workflow is powered by the Total Audio Promo Agent Network</p>
        <p>Sprint Week Mode: Optimized for speed and accuracy</p>
      </div>
    </div>
  );
};

export default AgentLoadingState;
