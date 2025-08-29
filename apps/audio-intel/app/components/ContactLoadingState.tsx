'use client'

import React from 'react'
import Image from 'next/image'

export type LoadingState = 'upload' | 'processing' | 'analysing' | 'success' | 'error' | 'export' | 'launch'

interface ContactLoadingStateProps {
  state: LoadingState
  progress: number
  message: string
}

const ContactLoadingState: React.FC<ContactLoadingStateProps> = ({ state, progress, message }) => {
  // Map states to image files and CSS classes
  const stateConfig = {
    upload: {
      image: '/assets/loading-states/chaos-overwhelmed.png',
      cssClass: 'loading-character',
      alt: 'Audio mascot overwhelmed with chaos - uploading contacts'
    },
    processing: {
      image: '/assets/loading-states/processing-contacts.png',
      cssClass: 'loading-character processing-character',
      alt: 'Audio mascot typing at computer - processing contacts'
    },
    analysing: {
      image: '/assets/loading-states/analyzing-data.png',
      cssClass: 'loading-character',
      alt: 'Audio mascot examining contact sheets - analysing data'
    },
    success: {
      image: '/assets/loading-states/success-complete.png',
      cssClass: 'loading-character success-character',
      alt: 'Audio mascot celebrating with checkmark - success!'
    },
    error: {
      image: '/assets/loading-states/error-state.png',
      cssClass: 'loading-character error-character',
      alt: 'Audio mascot scratching head with X - error occurred'
    },
    export: {
      image: '/assets/loading-states/vinyl-throw-action.png',
      cssClass: 'action-character export-character',
      alt: 'Audio mascot throwing vinyl record - exporting contacts'
    },
    launch: {
      image: '/assets/loading-states/vinyl-throw-action.png',
      cssClass: 'action-character launch-character',
      alt: 'Audio mascot throwing vinyl record - launching campaign'
    }
  }

  const config = stateConfig[state]

  const isActionState = state === 'export' || state === 'launch'
  const containerClass = isActionState ? 'action-container' : 'loading-container'

  return (
    <div className={containerClass}>
      {/* Character Image */}
      <div className="relative">
        <Image
          src={config.image}
          alt={config.alt}
          width={128}
          height={128}
          className={`${config.cssClass} w-32 h-32`}
          priority
          // Fallback to main logo if loading state images aren't available yet
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/total_audio_promo_logo_trans.png'
          }}
        />
      </div>

      {/* Progress Bar (hide for success/error/action states) */}
      {state !== 'success' && state !== 'error' && state !== 'export' && state !== 'launch' && (
        <div className="w-full max-w-xs">
          <div className="progress-bar bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Status Message */}
      {isActionState ? (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {state === 'export' ? 'Sending Your Contacts' : 'Campaign Launched!'}
          </h3>
          <p className="text-gray-600 max-w-sm text-center">
            {message}
          </p>
        </div>
      ) : (
        <p className="status-message max-w-sm text-center">
          {message}
        </p>
      )}

      {/* Additional context for professional users */}
      {state === 'processing' && (
        <div className="text-xs text-gray-400 text-center mt-2 max-w-sm">
          <p>Using Total Audio Promo AI to enrich your contacts with music industry intelligence...</p>
        </div>
      )}
    </div>
  )
}

export default ContactLoadingState

// Export convenience components for specific states
export const UploadLoadingState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="upload" {...props} />
)

export const ProcessingLoadingState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="processing" {...props} />
)

export const AnalysingLoadingState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="analysing" {...props} />
)

export const SuccessLoadingState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="success" {...props} />
)

export const ErrorLoadingState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="error" {...props} />
)

export const ExportActionState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="export" {...props} />
)

export const LaunchActionState = (props: Omit<ContactLoadingStateProps, 'state'>) => (
  <ContactLoadingState state="launch" {...props} />
)