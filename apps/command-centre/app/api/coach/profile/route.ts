/**
 * CoachOS Profile API
 * GET /api/coach/profile - Get user's coach profile
 * POST /api/coach/profile - Create or update coach profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import {
  getCoachProfile,
  createCoachProfile,
  updateCoachProfile,
} from '@total-audio/coach-os';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get coach profile
    const profile = await getCoachProfile(user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'No coach profile found', exists: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Failed to get coach profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, experienceLevel, genre, preferences } = body;

    // Check if profile exists
    const existingProfile = await getCoachProfile(user.id);

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await updateCoachProfile(user.id, {
        role,
        experienceLevel,
        genre,
        preferences,
      });
    } else {
      // Create new profile
      if (!role || !experienceLevel) {
        return NextResponse.json(
          { error: 'role and experienceLevel are required' },
          { status: 400 }
        );
      }

      profile = await createCoachProfile({
        userId: user.id,
        role,
        experienceLevel,
        genre,
        preferences,
      });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Failed to save coach profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save profile' },
      { status: 500 }
    );
  }
}
