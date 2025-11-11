# Pitch Generator Scripts

This directory contains utility scripts for seeding and managing Pitch Generator data.

## Available Scripts

### `seed-demo-contacts.ts`

Seeds the database with high-quality demo contacts for testing and demonstration purposes.

**Contacts included:**

- Chris Schofield (sadact) - Independent electronic artist
- Danny Howard - BBC Radio 1 presenter (House/Techno)
- Pete Tong - BBC Radio 1 presenter (Dance/Electronic)
- Tom Ravenscroft - BBC 6 Music presenter (Alternative/Experimental)
- Electronic Playlist Team - Spotify Editorial

**Usage:**

```bash
npm run seed:demo
```

**Requirements:**

- `.env.local` file with Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- User account with email: `chris@libertymusicpr.com`

**Features:**

- Automatically checks for existing contacts to prevent duplicates
- Uses realistic response rates based on industry experience
- Includes genre tags and professional notes for each contact
- Safe to run multiple times (duplicate prevention)

### Other Scripts

- `seed-chris-voice-profile.ts` - Seeds Chris's authentic voice profile
- `seed-kyara-demo-contacts.ts` - Seeds KYARA campaign contacts
- `seed-pitch-templates.ts` - Seeds pitch templates
- `check-brand-colours.js` - Validates brand colour usage
- Various migration and setup scripts

## Notes

All seed scripts use the Supabase service role key and should only be run in development environments. The contacts are associated with the user ID (email address) specified in each script.
