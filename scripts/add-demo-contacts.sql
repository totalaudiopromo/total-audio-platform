-- Add varied demo contacts for Liberty Music PR testing
-- User: chrisschofield@libertymusicpr.com
-- Includes: BBC Radio presenters, independent labels, streaming platforms

INSERT INTO contacts (user_id, name, email, outlet, role, notes, preferred_tone, created_at)
VALUES
  -- BBC Radio Presenters
  ('chrisschofield@libertymusicpr.com', 'Jack Saunders', 'jack.saunders@bbc.co.uk', 'BBC Radio 1', 'Presenter', 'New Music show - Alternative, Indie, Rock, Electronic. Key tastemaker for breaking new artists.', 'professional', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Nick Grimshaw', 'nick.grimshaw@bbc.co.uk', 'BBC 6 Music', 'Presenter', 'Alternative and indie music specialist. Former Radio 1 Breakfast Show host.', 'casual', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Clara Amfo', 'clara.amfo@bbc.co.uk', 'BBC Radio 1', 'Presenter', 'Mid-morning show - Pop, R&B, Hip-Hop. Champion of diverse new music.', 'enthusiastic', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Gayle Lofthouse', 'gayle.lofthouse@bbc.co.uk', 'BBC Radio', 'Presenter', 'Weekday show', 'professional', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Russell Walker-Brown', 'russell.walker-brown@bbc.co.uk', 'BBC Radio', 'Presenter', 'Late night show', 'casual', NOW()),

  -- Streaming Platforms
  ('chrisschofield@libertymusicpr.com', 'Spotify Editorial', 'editorial@spotify.com', 'Spotify', 'Playlist Curators', 'Global streaming platform - Editorial team managing major playlists', 'professional', NOW()),

  -- Independent Record Labels
  ('chrisschofield@libertymusicpr.com', 'Rough Trade Records', 'info@roughtraderecords.com', 'Rough Trade Records', 'A&R / Press', 'Legendary independent label - Indie, Alternative, Punk', 'casual', NOW()),
  ('chrisschofield@libertymusicpr.com', '4AD Records', 'info@4ad.com', '4AD', 'A&R / Press', 'Independent label - Alternative, Art Rock, Electronic', 'professional', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Domino Recording Co', 'press@dominomusic.com', 'Domino Recording Co', 'Press Contact', 'Independent label - Indie, Alternative, Electronic', 'professional', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Warp Records', 'info@warp.net', 'Warp Records', 'A&R / Press', 'Electronic music pioneers - IDM, Ambient, Experimental', 'casual', NOW()),
  ('chrisschofield@libertymusicpr.com', 'Ninja Tune', 'contact@ninjatune.net', 'Ninja Tune', 'A&R / Press', 'Independent label - Electronic, Hip-Hop, Experimental', 'casual', NOW())
ON CONFLICT (user_id, email) DO NOTHING;
