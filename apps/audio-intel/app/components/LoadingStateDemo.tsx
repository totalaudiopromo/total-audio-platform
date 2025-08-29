'use client'

import React, { useState, useEffect } from 'react'
import ContactLoadingState, { LoadingState } from './ContactLoadingState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const LoadingStateDemo: React.FC = () => {
  const [currentState, setCurrentState] = useState<LoadingState>('upload')
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const states: { state: LoadingState; label: string; message: string }[] = [
    { state: 'upload', label: 'Upload', message: 'Ready to process your contact spreadsheets...' },
    { state: 'processing', label: 'Processing', message: 'Analysing and cleaning your contact data...' },
    { state: 'analysing', label: 'Analysing', message: 'Gathering music industry intelligence...' },
    { state: 'success', label: 'Success', message: 'Contact enrichment completed successfully!' },
    { state: 'error', label: 'Error', message: 'Oops! Something went wrong. Let\'s try again.' },
    { state: 'export', label: 'Export', message: 'Downloading your organised contact database...' },
    { state: 'launch', label: 'Launch', message: 'Your music is flying out to all verified contacts!' }
  ]

  const runFullDemo = () => {
    setIsAnimating(true)
    setProgress(0)
    
    // Upload state
    setCurrentState('upload')
    setTimeout(() => {
      // Processing state
      setCurrentState('processing')
      setProgress(25)
      
      setTimeout(() => {
        setProgress(50)
        
        setTimeout(() => {
          // Analysing state  
          setCurrentState('analysing')
          setProgress(75)
          
          setTimeout(() => {
            setProgress(95)
            
            setTimeout(() => {
              // Success state
              setCurrentState('success')
              setProgress(100)
              setIsAnimating(false)
            }, 1000)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Audio Intel Loading States Demo</CardTitle>
        <p className="text-center text-gray-600 text-sm">
          Professional loading animations for the music industry workflow
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Loading State Display */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
          <ContactLoadingState
            state={currentState}
            progress={progress}
            message={states.find(s => s.state === currentState)?.message || ''}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {states.map(({ state, label }) => (
            <Button
              key={state}
              variant={currentState === state ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCurrentState(state)
                if (state === 'upload') setProgress(0)
                else if (state === 'processing') setProgress(35)
                else if (state === 'analysing') setProgress(75)
                else if (state === 'export' || state === 'launch') setProgress(0) // Action states don't show progress
                else setProgress(100)
              }}
              disabled={isAnimating}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Full Demo Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runFullDemo} 
            disabled={isAnimating}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isAnimating ? 'Running Demo...' : 'Run Full Workflow Demo'}
          </Button>
        </div>

        {/* Implementation Guide */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">🎯 Implementation Guide:</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Copy your mascot images to <code>/public/assets/loading-states/</code></li>
            <li>Include: <code>upload-contacts.png</code>, <code>processing-contacts.png</code>, <code>analyzing-data.png</code>, <code>success-complete.png</code>, <code>error-state.png</code>, <code>vinyl-throw-action.png</code></li>
            <li>Use high-quality PNG files with transparent backgrounds for professional appearance</li>
            <li>The component automatically falls back to the main logo if images aren't found</li>
            <li>Loading states use: gentle-bob, typing-motion, success-bounce, error-shake animations</li>
            <li>Action states (Export/Launch) use: export-pulse, launch-energy, dynamic-throw animations</li>
            <li>Progress bar includes shine animation for professional polish</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoadingStateDemo