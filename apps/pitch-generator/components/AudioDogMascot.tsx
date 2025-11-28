'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Audio the Dog Mascot Component
 *
 * A distinctive, animated mascot for the Total Audio Platform.
 * Uses neobrutalist postcraft aesthetic with subtle, delightful animations.
 *
 * States:
 * - idle: Default floating animation (empty states, waiting)
 * - processing: Focused typing animation (loading, working)
 * - success: Celebration bounce (completion, win)
 * - error: Confused wobble (errors, issues)
 * - action: Dynamic throw animation (export, send, launch)
 */

export type MascotMood = 'idle' | 'processing' | 'success' | 'error' | 'action';
export type MascotSize = 'sm' | 'md' | 'lg' | 'xl';

interface AudioDogMascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  message?: string;
  showSpeechBubble?: boolean;
  className?: string;
}

const moodConfig = {
  idle: {
    image: '/assets/loading-states/chaos-overwhelmed.png',
    alt: 'Audio the Dog - ready to help',
    animation: 'animate-mascot-float',
  },
  processing: {
    image: '/assets/loading-states/processing-contacts.png',
    alt: 'Audio the Dog - hard at work',
    animation: 'animate-mascot-focus',
  },
  success: {
    image: '/assets/loading-states/success-complete.png',
    alt: 'Audio the Dog - celebrating success',
    animation: 'animate-mascot-celebrate',
  },
  error: {
    image: '/assets/loading-states/error-state.png',
    alt: 'Audio the Dog - something went wrong',
    animation: 'animate-mascot-confused',
  },
  action: {
    image: '/assets/loading-states/vinyl-throw-action.png',
    alt: 'Audio the Dog - taking action',
    animation: 'animate-mascot-action',
  },
};

const sizeConfig = {
  sm: { width: 80, height: 80, containerClass: 'w-20 h-20' },
  md: { width: 120, height: 120, containerClass: 'w-30 h-30' },
  lg: { width: 160, height: 160, containerClass: 'w-40 h-40' },
  xl: { width: 200, height: 200, containerClass: 'w-48 h-48' },
};

export function AudioDogMascot({
  mood = 'idle',
  size = 'lg',
  message,
  showSpeechBubble = false,
  className = '',
}: AudioDogMascotProps) {
  const moodData = moodConfig[mood];
  const sizeData = sizeConfig[size];

  return (
    <div
      className={`mascot-container relative inline-flex flex-col items-center gap-4 ${className}`}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && message && (
        <div className="speech-bubble relative bg-white border-4 border-black rounded-2xl px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xs animate-fade-in">
          <p className="text-sm font-bold text-gray-900 text-center">{message}</p>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-black" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white" />
        </div>
      )}

      {/* Mascot Image Container */}
      <div className={`mascot-image-container relative ${moodData.animation}`}>
        {/* Glow effect for success state */}
        {mood === 'success' && (
          <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
        )}

        {/* Shadow base - postcraft style */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
          style={{
            width: sizeData.width * 0.7,
            height: sizeData.height * 0.15,
            transform: 'translateX(-50%) scaleY(0.3)',
          }}
        />

        <Image
          src={moodData.image}
          alt={moodData.alt}
          width={sizeData.width}
          height={sizeData.height}
          className={`${sizeData.containerClass} object-contain relative z-10 drop-shadow-lg`}
          priority
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/total_audio_promo_logo_trans.png';
          }}
        />
      </div>

      {/* Message without speech bubble */}
      {!showSpeechBubble && message && (
        <p className="text-sm font-bold text-gray-600 text-center max-w-xs animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
}

// Convenience exports for common use cases
export function AudioDogIdle(props: Omit<AudioDogMascotProps, 'mood'>) {
  return <AudioDogMascot mood="idle" {...props} />;
}

export function AudioDogProcessing(props: Omit<AudioDogMascotProps, 'mood'>) {
  return <AudioDogMascot mood="processing" {...props} />;
}

export function AudioDogSuccess(props: Omit<AudioDogMascotProps, 'mood'>) {
  return <AudioDogMascot mood="success" {...props} />;
}

export function AudioDogError(props: Omit<AudioDogMascotProps, 'mood'>) {
  return <AudioDogMascot mood="error" {...props} />;
}

export function AudioDogAction(props: Omit<AudioDogMascotProps, 'mood'>) {
  return <AudioDogMascot mood="action" {...props} />;
}

export default AudioDogMascot;
