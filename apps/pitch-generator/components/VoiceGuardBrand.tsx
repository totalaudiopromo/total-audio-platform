'use client';

import { Shield } from 'lucide-react';

export function VoiceGuardLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Shield className="w-12 h-12 text-indigo-600" strokeWidth={1.5} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-indigo-600">VG</span>
        </div>
      </div>
      <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        VoiceGuard
      </span>
    </div>
  );
}
