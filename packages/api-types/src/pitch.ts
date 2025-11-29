/**
 * Pitch Generator API Types
 */

import type { ApiResponse, Contact } from './common';

export interface GeneratePitchRequest {
  contactId: string;
  contact?: Contact;
  artistName: string;
  trackTitle: string;
  genre?: string;
  trackLink?: string;
  releaseDate?: string;
  keyHook: string;
  tone?: 'casual' | 'professional' | 'enthusiastic';
}

export interface GeneratedPitch {
  id: string;
  subject_line: string;
  pitch_body: string;
  suggested_send_time?: string | null;
  contact_name: string;
  artist_name: string;
  track_title: string;
}

export interface GeneratePitchResponse {
  pitchId: string;
  pitch: GeneratedPitch;
}

export type GeneratePitchApiResponse = ApiResponse<GeneratePitchResponse>;

export interface AnalyzePitchRequest {
  pitchBody: string;
  subjectLine?: string;
  contactType?: string;
}

export interface PitchAnalysis {
  score: number;
  grade: 'excellent' | 'good' | 'needs_work' | 'poor';
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  toneAnalysis: {
    formality: 'too_formal' | 'professional' | 'casual' | 'too_casual';
    enthusiasm: 'high' | 'moderate' | 'low';
    personalisation: 'high' | 'moderate' | 'low';
  };
  lengthAnalysis: {
    wordCount: number;
    isOptimal: boolean;
    recommendation: string;
  };
}

export interface AnalyzePitchResponse {
  analysis: PitchAnalysis;
}

export type AnalyzePitchApiResponse = ApiResponse<AnalyzePitchResponse>;

export type PitchStatus = 'draft' | 'sent' | 'replied' | 'no_response';

export interface Pitch {
  id: string;
  user_id: string;
  contact_id: string;
  contact_name: string;
  artist_name: string;
  track_title: string;
  pitch_body: string;
  subject_line: string;
  status: PitchStatus;
  created_at: string;
  updated_at: string;
}
