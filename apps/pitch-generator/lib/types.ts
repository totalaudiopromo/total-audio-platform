/**
 * Application-level types for Pitch Generator
 *
 * These types extend the database types from @total-audio/core-db
 * and provide application-specific interfaces.
 */

import type { Database } from '@total-audio/core-db';

// Database table row types
export type Pitch = Database['public']['Tables']['pitches']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type PitchTemplate = Database['public']['Tables']['pitch_templates']['Row'];

// Insert types for creating new records
export type PitchInsert = Database['public']['Tables']['pitches']['Insert'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type PitchTemplateInsert = Database['public']['Tables']['pitch_templates']['Insert'];

// Update types for modifying records
export type PitchUpdate = Database['public']['Tables']['pitches']['Update'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];
export type PitchTemplateUpdate = Database['public']['Tables']['pitch_templates']['Update'];

// Application-specific types
export interface VoiceProfile {
  user_id: string;
  writing_style: string | null;
  key_phrases: string[] | null;
  tone_preferences: string | null;
  created_at: string;
  updated_at: string;
}

export interface PitchGenerationRequest {
  artistName: string;
  genre: string;
  contactName: string;
  contactOutlet?: string;
  keyHook: string;
  trackLink?: string;
  releaseDate?: string;
  tone?: string;
  templateId?: string;
}

export interface PitchGenerationResponse {
  pitch: Pitch;
  subjectLineOptions: string[];
  suggestedSendTime: string;
}

export interface BatchPitchRequest {
  contacts: Contact[];
  artistName: string;
  genre: string;
  keyHook: string;
  trackLink?: string;
  releaseDate?: string;
  tone?: string;
  templateId?: string;
}

export type PitchStatus = 'draft' | 'pending' | 'sent' | 'opened' | 'replied' | 'bounced';
