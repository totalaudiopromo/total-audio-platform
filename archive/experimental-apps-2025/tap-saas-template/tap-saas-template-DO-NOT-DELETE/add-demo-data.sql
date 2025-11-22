-- Add demo contacts for testing
INSERT INTO intel_contacts (user_id, name, role, outlet, email, genre_tags, notes, preferred_tone) VALUES
('demo-user', 'Sarah Johnson', 'Music Editor', 'BBC Radio 1', 'sarah.johnson@bbc.co.uk', '["pop", "indie", "alternative"]', 'Loves discovering new indie artists, prefers personal pitches', 'friendly'),
('demo-user', 'Mike Chen', 'Playlist Curator', 'Spotify UK', 'mike.chen@spotify.com', '["electronic", "dance", "ambient"]', 'Focuses on electronic and dance music, responds well to data-driven pitches', 'professional'),
('demo-user', 'Emma Williams', 'Blog Writer', 'The Line of Best Fit', 'emma@thelineofbestfit.com', '["indie", "folk", "singer-songwriter"]', 'Independent music blogger, prefers authentic stories', 'casual'),
('demo-user', 'David Thompson', 'Radio Presenter', 'Amazing Radio', 'david@amazingradio.co.uk', '["rock", "indie", "alternative"]', 'Evening show presenter, loves supporting emerging artists', 'enthusiastic'),
('demo-user', 'Lisa Park', 'Music Journalist', 'NME', 'lisa.park@nme.com', '["rock", "indie", "punk"]', 'Senior writer, interested in breaking news and exclusives', 'direct');

-- Add demo pitches
INSERT INTO pitches (user_id, contact_id, artist_name, track_title, subject_line, body, genre, status, template_id) VALUES
('demo-user', (SELECT id FROM intel_contacts WHERE name = 'Sarah Johnson' LIMIT 1), 'The Echoes', 'Midnight Drive', 'New indie gem: The Echoes - Midnight Drive', 'Hi Sarah,

Hope you''re doing well! I wanted to share something special with you.

The Echoes just dropped "Midnight Drive" - it''s that perfect blend of dreamy indie pop with those lush guitar textures you love. Think early Beach House meets The xx, but with their own fresh take.

The track has already gained traction on SoundCloud with 50k+ plays in the first week, and their previous single was featured on Amazing Radio''s evening show.

Would love to know your thoughts - I think it could be perfect for your show.

Best,
Chris

P.S. They''re playing a few London dates next month if you''d like to catch them live.', 'indie', 'sent', NULL),
('demo-user', (SELECT id FROM intel_contacts WHERE name = 'Mike Chen' LIMIT 1), 'Neon Dreams', 'Digital Sunset', 'Fresh electronic vibes: Neon Dreams - Digital Sunset', 'Hi Mike,

Hope this finds you well! 

Neon Dreams just released "Digital Sunset" - it''s a beautiful blend of ambient electronic with those driving beats that get people moving. Perfect for those late-night playlists.

The track has some interesting data behind it:
- 78% completion rate on first listen
- 45% of listeners added to their own playlists
- Strong performance in 18-34 demographic

They''ve got a unique sound that bridges ambient and dance - think ODESZA meets Burial.

Would love your thoughts on it for your electronic playlists.

Cheers,
Chris', 'electronic', 'draft', NULL),
('demo-user', (SELECT id FROM intel_contacts WHERE name = 'Emma Williams' LIMIT 1), 'Acoustic Stories', 'Coffee Shop Dreams', 'Intimate new track: Acoustic Stories - Coffee Shop Dreams', 'Hi Emma,

Hope you''re having a great week!

Acoustic Stories just shared "Coffee Shop Dreams" with me, and honestly, it stopped me in my tracks. It''s that perfect kind of intimate, storytelling folk that feels like it was written in a quiet corner of a coffee shop.

The artist, Jake, wrote this after spending six months traveling through small towns, playing in cafes and bars. You can hear that journey in every note - it''s authentic in a way that''s rare these days.

The track has that same raw, honest quality as early Bon Iver or Phoebe Bridgers, but with his own voice and story.

Thought you might connect with it given your love for authentic, independent music.

Best,
Chris', 'folk', 'sent', NULL);
