/**
 * OperatorOS Bridge (TotalAudioPromo.com)
 * Lightweight OperatorOS integration for production site
 */

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import OperatorOS packages to avoid SSR issues
const BootScreen = dynamic(
  () => import('@total-audio/operator-boot').then(mod => mod.BootScreen),
  { ssr: false }
);

const SignalScreen = dynamic(
  () => import('@total-audio/operator-boot').then(mod => mod.SignalScreen),
  { ssr: false }
);

const ReadyScreen = dynamic(
  () => import('@total-audio/operator-boot').then(mod => mod.ReadyScreen),
  { ssr: false }
);

const OperatorDesktop = dynamic(
  () => import('@total-audio/operator-os').then(mod => mod.OperatorDesktop),
  { ssr: false }
);

type BootPhase = 'operator' | 'signal' | 'ready' | 'complete';

export default function OperatorPage() {
  const [phase, setPhase] = useState<BootPhase>('operator');

  const handleOperatorComplete = () => {
    setPhase('signal');
  };

  const handleSignalComplete = () => {
    setPhase('ready');
  };

  const handleReadyComplete = () => {
    setPhase('complete');
  };

  return (
    <>
      {phase === 'operator' && <BootScreen onComplete={handleOperatorComplete} />}
      {phase === 'signal' && <SignalScreen onComplete={handleSignalComplete} />}
      {phase === 'ready' && <ReadyScreen onComplete={handleReadyComplete} />}
      {phase === 'complete' && <OperatorDesktop />}
    </>
  );
}
