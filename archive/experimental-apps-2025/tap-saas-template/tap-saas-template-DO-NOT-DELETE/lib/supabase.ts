import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (with service role)
// Only create if service key is available
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase; // Fallback to regular client if no service key

// Types
export interface Contact {
  id: string;
  user_id: string;
  name: string;
  role?: string;
  outlet?: string;
  email?: string;
  genre_tags?: string[];
  last_contact?: string;
  total_interactions?: number;
  response_rate?: number;
  notes?: string;
  preferred_tone?: 'casual' | 'professional' | 'enthusiastic';
  created_at?: string;
  updated_at?: string;
}

export interface Pitch {
  id: string;
  user_id: string;
  contact_id?: string;
  contact_name: string;
  contact_outlet?: string;
  artist_name: string;
  track_title: string;
  genre: string;
  release_date?: string;
  key_hook: string;
  track_link?: string;
  tone: 'casual' | 'professional' | 'enthusiastic';
  pitch_body: string;
  subject_line: string;
  subject_line_options?: {
    option1: string;
    option2: string;
    option3: string;
  };
  suggested_send_time?: string;
  status: 'draft' | 'sent' | 'replied' | 'success' | 'no_reply';
  response_received?: boolean;
  sent_at?: string;
  replied_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PitchTemplate {
  id: string;
  user_id?: string;
  name: string;
  genre: string;
  description?: string;
  opening_lines?: string[];
  hook_structure?: string;
  closing_ctas?: string[];
  template_body: string;
  is_system?: boolean;
  success_rate?: number;
  times_used?: number;
  created_at?: string;
  updated_at?: string;
}
