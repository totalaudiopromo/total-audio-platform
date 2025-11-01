-- Pitch Generator Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contacts table (shared with Intel - for now we'll create a simple version)
-- In production, this would reference the Intel database
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  outlet VARCHAR(255),
  email VARCHAR(255),
  genre_tags TEXT[], -- Array of genres like ['indie', 'folk', 'alternative']
  last_contact TIMESTAMP,
  total_interactions INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0.00,
  notes TEXT,
  preferred_tone VARCHAR(50) DEFAULT 'professional', -- casual, professional, enthusiastic
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pitches table
CREATE TABLE IF NOT EXISTS pitches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  contact_name VARCHAR(255) NOT NULL, -- Denormalized for history
  contact_outlet VARCHAR(255),
  artist_name VARCHAR(255) NOT NULL,
  track_title VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  release_date DATE,
  key_hook TEXT NOT NULL,
  track_link VARCHAR(500),
  tone VARCHAR(50) NOT NULL DEFAULT 'professional', -- casual, professional, enthusiastic
  pitch_body TEXT NOT NULL,
  subject_line VARCHAR(255) NOT NULL,
  subject_line_options JSONB, -- Store all 3 options
  suggested_send_time VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, replied, success, no_reply
  response_received BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pitch templates table
CREATE TABLE IF NOT EXISTS pitch_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- NULL for system templates
  name VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  opening_lines JSONB, -- Array of opening line variations
  hook_structure TEXT,
  closing_ctas JSONB, -- Array of CTA options
  template_body TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pitch performance tracking
CREATE TABLE IF NOT EXISTS pitch_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pitch_id UUID REFERENCES pitches(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  reply_time_hours INTEGER,
  outcome VARCHAR(50), -- coverage, playlist, interview, rejection, no_reply
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User settings/preferences
CREATE TABLE IF NOT EXISTS user_pitch_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  default_artist_name VARCHAR(255),
  default_tone VARCHAR(50) DEFAULT 'professional',
  signature TEXT,
  batch_limit INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pitches_user_id ON pitches(user_id);
CREATE INDEX idx_pitches_contact_id ON pitches(contact_id);
CREATE INDEX idx_pitches_status ON pitches(status);
CREATE INDEX idx_pitches_created_at ON pitches(created_at DESC);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_templates_genre ON pitch_templates(genre);
CREATE INDEX idx_templates_system ON pitch_templates(is_system);

-- Insert system templates (5 genre-specific templates)
INSERT INTO pitch_templates (name, genre, description, template_body, is_system, opening_lines, closing_ctas) VALUES 
(
  'Indie/Alternative - BBC 6 Music Style',
  'indie',
  'Perfect for BBC 6 Music, Amazing Radio, and indie-focused outlets',
  'Hi {{contact_name}},

{{context_opener}}

I wanted to share "{{track_title}}" by {{artist_name}} - {{key_hook}}

{{genre_context}}

Would love to send it over for your consideration.

Best,
{{sender_name}}

🎵 Listen: {{track_link}}',
  true,
  '["Hope you''ve been well since we last spoke", "Quick one for you", "I know you champion indie artists on {{outlet}}", "Thought this might fit your {{show_time}} show", "Following up on our last chat about {{previous_topic}}"]',
  '["Would love to send it over", "Let me know if you''d like the full track", "Happy to send more info if it''s of interest", "Would this fit your upcoming shows?"]'
),
(
  'Electronic/Dance - Specialist Show',
  'electronic',
  'For electronic music specialists, blog-friendly pitch',
  'Hi {{contact_name}},

{{context_opener}}

Got a new {{genre}} track from {{artist_name}} that I think fits your vibe perfectly - {{key_hook}}

{{production_detail}}

The track drops {{release_date}}. Would love your thoughts.

Cheers,
{{sender_name}}

🎵 {{track_link}}',
  true,
  '["Hope all''s well", "Quick pitch for you", "Been following your recent shows", "Saw you played {{similar_artist}} recently", "This one''s right in your wheelhouse"]',
  '["Would love your thoughts", "Let me know if you want more details", "Happy to send the full track", "Think this could work for your show?"]'
),
(
  'Folk/Singer-Songwriter - Story-Driven',
  'folk',
  'Intimate, story-focused pitch for folk and singer-songwriter music',
  'Hi {{contact_name}},

{{context_opener}}

I wanted to share something special - "{{track_title}}" by {{artist_name}}.

{{story_hook}}

{{key_hook}}

It''s out {{release_date}}. Would mean the world to share it with your listeners.

Warmly,
{{sender_name}}

🎵 {{track_link}}',
  true,
  '["Hope you''re well", "It''s been a while", "I know you appreciate honest songwriting", "This one feels like your kind of artist", "Thought of you when I heard this"]',
  '["Would love to share it with you", "Let me know if you''d like to hear more", "Happy to set up a chat with the artist", "Think your listeners would connect with this"]'
),
(
  'Hip-Hop/Urban - Direct & Confident',
  'hiphop',
  'Confident, cultural context for hip-hop and urban music',
  'Hey {{contact_name}},

{{context_opener}}

{{artist_name}} just dropped "{{track_title}}" and it''s the one - {{key_hook}}

{{cultural_context}}

Out {{release_date}}. You should hear this.

{{sender_name}}

🎵 {{track_link}}',
  true,
  '["What''s good", "Hope you''re well", "Been a minute", "Saw your recent coverage of {{similar_artist}}", "Got something for you"]',
  '["Let me know what you think", "This deserves your ears", "Worth checking out for sure", "Should be on your radar"]'
),
(
  'Rock/Punk - Energetic & Tour-Focused',
  'rock',
  'High-energy pitch emphasizing live performance and touring',
  'Hi {{contact_name}},

{{context_opener}}

{{artist_name}} are back with "{{track_title}}" - {{key_hook}}

{{touring_context}}

Track drops {{release_date}}. This one''s made for live shows.

{{sender_name}}

🎵 {{track_link}}',
  true,
  '["Hope you''re well", "Quick one", "Saw you covered {{similar_artist}} last month", "Got a banger for you", "This one''s got serious energy"]',
  '["Let me know if you want more info", "They''re touring through {{region}} soon", "Would love to get this in front of your audience", "Think it''d go down well with your listeners"]'
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pitches_updated_at BEFORE UPDATE ON pitches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON pitch_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON user_pitch_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

