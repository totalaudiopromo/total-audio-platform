'use client';
import { Upload, Settings, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function StepIndicator() {
  const { state } = useApp();

  const steps = [
    {
      id: 'upload',
      title: 'Upload Track',
      icon: Upload,
      description: 'Upload your music file',
    },
    {
      id: 'customize',
      title: 'Customize Pitch',
      icon: Settings,
      description: 'Personalize your outreach',
    },
    {
      id: 'results',
      title: 'Find Curators',
      icon: Target,
      description: 'Discover perfect matches',
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (stepId === 'upload') {
      return state.uploadComplete
        ? 'completed'
        : state.currentStep === 'upload'
          ? 'current'
          : 'upcoming';
    }
    if (stepId === 'customize') {
      if (state.showResults) return 'completed';
      return state.currentStep === 'customize'
        ? 'current'
        : state.uploadComplete
          ? 'upcoming'
          : 'disabled';
    }
    if (stepId === 'results') {
      return state.showResults ? 'current' : 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/20 z-0">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-in-out"
            style={{
              width: state.showResults ? '100%' : state.uploadComplete ? '50%' : '0%',
            }}
          />
        </div>

        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${
                  status === 'completed'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500 text-white'
                    : status === 'current'
                      ? 'bg-white/10 border-purple-400 text-white backdrop-blur-xl'
                      : status === 'upcoming'
                        ? 'bg-white/5 border-white/30 text-white/60'
                        : 'bg-white/5 border-white/20 text-white/40'
                }
              `}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Step Info */}
              <div className="mt-4 text-center max-w-32">
                <div
                  className={`
                  font-semibold text-sm mb-1 transition-colors duration-300
                  ${
                    status === 'completed' || status === 'current'
                      ? 'text-white'
                      : status === 'upcoming'
                        ? 'text-white/70'
                        : 'text-white/50'
                  }
                `}
                >
                  {step.title}
                </div>
                <div
                  className={`
                  text-xs transition-colors duration-300
                  ${
                    status === 'completed' || status === 'current'
                      ? 'text-white/70'
                      : 'text-white/50'
                  }
                `}
                >
                  {step.description}
                </div>
              </div>

              {/* Active Step Pulse */}
              {status === 'current' && (
                <div className="absolute -inset-2 rounded-full border-2 border-purple-400/30 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
