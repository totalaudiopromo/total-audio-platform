-- Add Voice Profile columns to user_pitch_settings
-- This enables authentic, personalized pitch generation using the user's own voice

ALTER TABLE user_pitch_settings
ADD COLUMN IF NOT EXISTS voice_background TEXT,
ADD COLUMN IF NOT EXISTS voice_style TEXT,
ADD COLUMN IF NOT EXISTS voice_achievements TEXT,
ADD COLUMN IF NOT EXISTS voice_approach TEXT,
ADD COLUMN IF NOT EXISTS voice_differentiator TEXT,
ADD COLUMN IF NOT EXISTS voice_typical_opener TEXT,
ADD COLUMN IF NOT EXISTS voice_context_notes TEXT,
ADD COLUMN IF NOT EXISTS voice_profile_completed BOOLEAN DEFAULT false;

-- Add comment explaining the voice profile system
COMMENT ON COLUMN user_pitch_settings.voice_background IS 'User background in music (e.g., "Producer for 5 years, pitched to BBC Radio 1")';
COMMENT ON COLUMN user_pitch_settings.voice_style IS 'How user describes their pitching style (e.g., "Direct but friendly, no corporate speak")';
COMMENT ON COLUMN user_pitch_settings.voice_achievements IS 'User biggest wins (e.g., "Got played on 6 Music three times")';
COMMENT ON COLUMN user_pitch_settings.voice_approach IS 'What makes their approach different (e.g., "I focus on genuine relationships over mass emails")';
COMMENT ON COLUMN user_pitch_settings.voice_differentiator IS 'What makes them unique (e.g., "I test everything in my own campaigns first")';
COMMENT ON COLUMN user_pitch_settings.voice_typical_opener IS 'How they typically open conversations (e.g., "Hope you have been well...")';
COMMENT ON COLUMN user_pitch_settings.voice_context_notes IS 'Any additional context for authentic voice (e.g., "I am a dad of two, based in Brighton")';
COMMENT ON COLUMN user_pitch_settings.voice_profile_completed IS 'Whether user has completed their voice profile setup';
