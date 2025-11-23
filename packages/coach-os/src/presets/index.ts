/**
 * CoachOS Presets
 * Coaching presets for different roles and experience levels
 */

import type { CoachingPreset, CoachRole, ExperienceLevel } from '../types';

// Import preset JSON files
import beginnerArtist from './beginner_artist.json';
import intermediateArtist from './intermediate_artist.json';
import advancedArtist from './advanced_artist.json';
import prAgencyBeginner from './pr_agency_beginner.json';
import prAgencyAdvanced from './pr_agency_advanced.json';

/**
 * Get a coaching preset by role and experience level
 */
export function getPreset(
  role: CoachRole,
  experienceLevel: ExperienceLevel
): CoachingPreset | null {
  const key = `${role}_${experienceLevel}`;

  const presets: Record<string, CoachingPreset> = {
    'artist_beginner': beginnerArtist as CoachingPreset,
    'artist_intermediate': intermediateArtist as CoachingPreset,
    'artist_advanced': advancedArtist as CoachingPreset,
    'pr_agency_beginner': prAgencyBeginner as CoachingPreset,
    'pr_agency_advanced': prAgencyAdvanced as CoachingPreset,
    // Manager presets can be added later
  };

  return presets[key] || null;
}

/**
 * Get all available presets
 */
export function getAllPresets(): CoachingPreset[] {
  return [
    beginnerArtist as CoachingPreset,
    intermediateArtist as CoachingPreset,
    advancedArtist as CoachingPreset,
    prAgencyBeginner as CoachingPreset,
    prAgencyAdvanced as CoachingPreset,
  ];
}

/**
 * Get presets for a specific role
 */
export function getPresetsByRole(role: CoachRole): CoachingPreset[] {
  const all = getAllPresets();
  return all.filter((preset) => preset.role === role);
}
