/**
 * VoiceGuard API
 * POST /api/autopilot/identity/voice-guard
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkBrandVoice, enforceBrandVoice } from '@total-audio/pr-autopilot/identity/identityKernel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, enforce = false } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (enforce) {
      const result = enforceBrandVoice(message);
      return NextResponse.json(result);
    } else {
      const result = checkBrandVoice(message);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('VoiceGuard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
