-- Seed Chris Schofield's Voice Profile
-- Run this to populate your authentic voice profile

INSERT INTO user_pitch_settings (
  user_id,
  voice_background,
  voice_style,
  voice_achievements,
  voice_approach,
  voice_differentiator,
  voice_typical_opener,
  voice_context_notes,
  voice_profile_completed
) VALUES (
  'demo@example.com', -- Update this to your actual email
  'I''m a producer who''s been making electronic music for 5 years under the name sadact. I''ve pitched tracks to BBC Radio 1, 6 Music, and worked with several indie labels on radio campaigns. I''ve learned radio promo the hard way - by doing it myself and connecting with contacts who actually care about the music.',
  'I keep it direct but friendly. No corporate speak or forced formality. I write like I''m talking to someone at a gig, not sending a press release. Casual but professional - I respect people''s time but don''t pretend to be something I''m not.',
  'My last track got played on BBC 6 Music three times and I''ve built genuine relationships with radio producers over the years. I''ve pitched successfully to Radio 1, worked with artists like Royal Blood and Architects indirectly through my network, and learned from real campaigns with real budgets.',
  'I don''t do mass emails. I research every contact, understand what they actually play, and only pitch tracks that genuinely fit their vibe. If it''s not right for them, I don''t waste their time. Quality over quantity, always.',
  'I''m a producer myself (sadact), so I understand both the creative and promotion sides. I test everything in my own campaigns before recommending it. I''ve been on both sides - making the music and pitching it - so I know what works and what''s just bullshit marketing speak.',
  'I usually start with something personal like "Hope you''ve been well" or reference something specific I heard them play recently. Makes it feel less like a pitch and more like a conversation between people who actually care about music.',
  'Dad of two based in Brighton. Electronic music focus. I work full-time at Postman so I run campaigns in the evenings and weekends. I built Audio Intel because I needed it myself - tired of spending 15+ hours researching contacts for every campaign.'
)
ON CONFLICT (user_id)
DO UPDATE SET
  voice_background = EXCLUDED.voice_background,
  voice_style = EXCLUDED.voice_style,
  voice_achievements = EXCLUDED.voice_achievements,
  voice_approach = EXCLUDED.voice_approach,
  voice_differentiator = EXCLUDED.voice_differentiator,
  voice_typical_opener = EXCLUDED.voice_typical_opener,
  voice_context_notes = EXCLUDED.voice_context_notes,
  voice_profile_completed = EXCLUDED.voice_profile_completed;
