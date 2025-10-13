/**
 * Enhanced Demo Components
 * Sprint Week optimized components for professional demo presentation
 * Uses centralized brand system for consistency
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Music,
  Users,
  Target,
  Play,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react'
import { BRAND_COLORS, brandUtils, COMMON_CLASSES } from '@/lib/brand-system'
import ContactLoadingState, { LoadingState } from '@/app/components/ContactLoadingState'

interface DemoMetric {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}

interface DemoShowcaseProps {
  className?: string
}

/**
 * Professional Demo Metrics Display
 */
export function DemoMetrics({ className = '' }: DemoShowcaseProps) {
  const [metrics, setMetrics] = useState<DemoMetric[]>([
    {
      label: 'Contacts Processed',
      value: '0',
      icon: <Users className="w-5 h-5" />,
      color: BRAND_COLORS.primary.blue
    },
    {
      label: 'Time Saved',
      value: '0 hours',
      icon: <Clock className="w-5 h-5" />,
      color: BRAND_COLORS.secondary.yellow
    },
    {
      label: 'Accuracy Rate',
      value: '0%',
      icon: <Target className="w-5 h-5" />,
      color: BRAND_COLORS.status.success
    },
    {
      label: 'Active Users',
      value: '0',
      icon: <TrendingUp className="w-5 h-5" />,
      color: BRAND_COLORS.status.info
    }
  ])

  // Animate metrics on mount
  useEffect(() => {
    const animateMetrics = () => {
      const targets = [
        { label: 'Contacts Processed', value: '2,847' },
        { label: 'Time Saved', value: '156 hours' },
        { label: 'Accuracy Rate', value: '94%' },
        { label: 'Active Users', value: '127' }
      ]

      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        
        setMetrics(current => current.map((metric, index) => {
          const target = targets[index]
          if (target && target.label === metric.label) {
            // Animate numbers
            if (metric.label === 'Contacts Processed') {
              const current = Math.round((2847 * progress) / 100)
              return { ...metric, value: current.toLocaleString() }
            } else if (metric.label === 'Time Saved') {
              const current = Math.round((156 * progress) / 100)
              return { ...metric, value: `${current} hours` }
            } else if (metric.label === 'Accuracy Rate') {
              const current = Math.round((94 * progress) / 100)
              return { ...metric, value: `${current}%` }
            } else if (metric.label === 'Active Users') {
              const current = Math.round((127 * progress) / 100)
              return { ...metric, value: current.toString() }
            }
          }
          return metric
        }))

        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 80)
    }

    const timer = setTimeout(animateMetrics, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <Card key={index} className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
            >
              {metric.icon}
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {metric.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Interactive Demo Flow
 */
interface DemoFlowProps {
  onComplete?: () => void
}

export function InteractiveDemoFlow({ onComplete }: DemoFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      state: 'upload' as LoadingState,
      title: 'Upload Contacts',
      description: 'Drop your messy spreadsheets here',
      duration: 2000
    },
    {
      state: 'processing' as LoadingState,
      title: 'Processing Data',
      description: 'Cleaning and organising your contacts',
      duration: 3000
    },
    {
      state: 'analysing' as LoadingState,
      title: 'AI Analysis',
      description: 'Gathering music industry intelligence',
      duration: 4000
    },
    {
      state: 'success' as LoadingState,
      title: 'Complete!',
      description: 'Your contacts are enriched and ready',
      duration: 1000
    }
  ]

  const runDemo = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    setProgress(0)

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      
      // Animate progress during each step
      const stepProgress = 100 / steps.length
      const startProgress = i * stepProgress
      const endProgress = (i + 1) * stepProgress
      
      const stepDuration = steps[i].duration
      const progressInterval = 50
      const progressIncrement = stepProgress / (stepDuration / progressInterval)
      
      let currentProgress = startProgress
      
      const progressTimer = setInterval(() => {
        currentProgress += progressIncrement
        if (currentProgress >= endProgress) {
          currentProgress = endProgress
          clearInterval(progressTimer)
        }
        setProgress(currentProgress)
      }, progressInterval)

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, stepDuration))
      clearInterval(progressTimer)
    }

    setIsRunning(false)
    onComplete?.()
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className={COMMON_CLASSES.heading2}>
          Interactive Demo
        </CardTitle>
        <CardDescription>
          See Audio Intel in action with real-time processing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Demo Progress */}
        {isRunning && (
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {steps[currentStep]?.title}
              </div>
              <div className="text-sm text-gray-600">
                {steps[currentStep]?.description}
              </div>
            </div>
          </div>
        )}

        {/* Loading State Display */}
        <div className="min-h-[200px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-6">
          {isRunning ? (
            <ContactLoadingState
              state={steps[currentStep]?.state || 'upload'}
              progress={Math.round(progress)}
              message={steps[currentStep]?.description || ''}
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">•</div>
              <div className="text-lg font-bold text-gray-900">
                Ready to see the magic?
              </div>
              <div className="text-gray-600">
                Watch how we transform chaos into organised intelligence
              </div>
            </div>
          )}
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center">
          <Button
            onClick={runDemo}
            disabled={isRunning}
            size="lg"
            className={brandUtils.getButtonClasses('primary')}
          >
            {isRunning ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Demo
              </>
            )}
          </Button>
        </div>

        {/* Demo Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: BRAND_COLORS.status.success }} />
            <div className="font-bold text-gray-900">Real Processing</div>
            <div className="text-sm text-gray-600">Same AI pipeline as production</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: BRAND_COLORS.primary.blue }} />
            <div className="font-bold text-gray-900">Lightning Fast</div>
            <div className="text-sm text-gray-600">Process 100+ contacts in seconds</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: BRAND_COLORS.secondary.yellow }} />
            <div className="font-bold text-gray-900">Professional Quality</div>
            <div className="text-sm text-gray-600">Industry-ready intelligence</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Professional Results Showcase
 */
interface ResultsShowcaseProps {
  className?: string
}

export function ResultsShowcase({ className = '' }: ResultsShowcaseProps) {
  const [selectedResult, setSelectedResult] = useState(0)

  const results = [
    {
      title: 'Basic Email',
      before: 'john@bbc.co.uk',
      after: `• BBC Radio 1 | National Public Service
• UK National Coverage | High Reach  
• Email: Weekday mornings preferred
• Focus: New UK artists, breaking acts
• Tip: Include streaming numbers + press quote
• Research Confidence: High`
    },
    {
      title: 'Playlist Curator',
      before: 'sarah@spotify.com',
      after: `• Spotify Editorial Team | Global Platform
• Worldwide Distribution | 200M+ Listeners
• Email: Via official channels only
• Focus: Emerging artists, trending genres
• Tip: Submit via Spotify for Artists portal
• Research Confidence: High`
    },
    {
      title: 'Music Blogger',
      before: 'editor@musicblog.co.uk',
      after: `• Independent Music Blog | UK Focus
• UK & European Coverage | 50K Monthly Readers
• Email: Accepts submissions Tuesday-Thursday
• Focus: Alternative, indie, emerging artists
• Tip: Include high-res images and bio
• Research Confidence: Medium`
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className={COMMON_CLASSES.heading2}>
          See the Transformation
        </h3>
        <p className={COMMON_CLASSES.body}>
          From basic emails to actionable intelligence
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-2">
          {results.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedResult(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedResult === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Example {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Before */}
        <Card className="border-2 border-red-200">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-red-700">
              Before: {results[selectedResult].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="font-mono text-lg text-center text-red-900">
                {results[selectedResult].before}
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-red-600">
              Basic contact information only
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <ArrowRight className="w-12 h-12" style={{ color: BRAND_COLORS.primary.blue }} />
        </div>

        {/* After */}
        <Card className="border-2 border-green-200 md:col-start-2">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-green-700">
              After: Enriched Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-6 rounded-lg">
              <pre className="text-sm whitespace-pre-line text-green-900">
                {results[selectedResult].after}
              </pre>
            </div>
            <div className="text-center mt-4 text-sm text-green-600">
              Complete industry intelligence ready for outreach
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Button
          size="lg"
          className={brandUtils.getButtonClasses('primary')}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Try It Yourself
        </Button>
      </div>
    </div>
  )
}

export default {
  DemoMetrics,
  InteractiveDemoFlow,
  ResultsShowcase
}