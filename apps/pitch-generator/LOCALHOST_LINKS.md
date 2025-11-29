# Pitch Generator - All Localhost Links

**Base URL:**`http://localhost:3010` (or check your dev server output)

---

## Public Pages (No Auth Required)

### Landing & Marketing

- **Homepage:**`http://localhost:3010/`
- **Pricing:**`http://localhost:3010/pricing`
- **Blog:**`http://localhost:3010/blog`
- **Blog Posts:**
  - BBC Radio 1 Pitch Writing: `http://localhost:3010/blog/bbc-radio-1-pitch-writing`
  - Music Blog Pitch Writing: `http://localhost:3010/blog/music-blog-pitch-writing`
  - Spotify Playlist Pitch Templates: `http://localhost:3010/blog/spotify-playlist-pitch-templates`
- **Privacy Policy:**`http://localhost:3010/privacy`
- **Terms:**`http://localhost:3010/terms`

### Public Demos

- **Skills Demo:**`http://localhost:3010/skills/demo`
- **Public Demo:**`http://localhost:3010/demo`

---

## Authentication Pages

- **Sign In:**`http://localhost:3010/auth/signin`
- **Auth Callback:**`http://localhost:3010/auth/callback`
- **Unauthorized:**`http://localhost:3010/unauthorized`

---

## Dashboard & Main App (Auth Required)

### Dashboard

- **Dashboard:**`http://localhost:3010/dashboard`
- **Dashboard Integrations:**`http://localhost:3010/dashboard/integrations`

### Pitch Generation Flow

- **Generate Pitch:**`http://localhost:3010/pitch/generate`
- **Batch Generate:**`http://localhost:3010/pitch/batch`
- **Pitch Review:**`http://localhost:3010/pitch/review/[id]` (replace [id] with actual pitch ID)
- **Pitch History:**`http://localhost:3010/pitch/history`
- **Templates:**`http://localhost:3010/pitch/templates`
- **Contacts:**`http://localhost:3010/pitch/contacts`

---

## Settings & Profile (Auth Required)

- **Profile:**`http://localhost:3010/profile`
- **Voice Profile:**`http://localhost:3010/profile/voice`
- **Settings:**`http://localhost:3010/settings`

---

## Success & Error Pages

- **Success:**`http://localhost:3010/success`
- **Not Found (404):**`http://localhost:3010/not-found` (or any invalid route)
- **Error:**`http://localhost:3010/error`
- **Global Error:**`http://localhost:3010/global-error`

---

## Demo Flow Pages (Recommended Order)

### For Liberty Music PR Demo:

1. **Homepage:**`http://localhost:3010/`
   - Shows value proposition and features

2. **Sign In:**`http://localhost:3010/auth/signin`
   - Demo login

3. **Dashboard:**`http://localhost:3010/dashboard`
   - Overview of pitches and stats

4. **Generate Pitch:**`http://localhost:3010/pitch/generate`
   - Main pitch generation form (brutalist styling )

5. **Pitch Review:**`http://localhost:3010/pitch/review/[id]`
   - Review generated pitch (brutalist styling )

6. **Templates:**`http://localhost:3010/pitch/templates`
   - Browse template library (brutalist styling )

7. **Batch Generate:**`http://localhost:3010/pitch/batch`
   - Generate multiple pitches at once (brutalist styling )

8. **Contacts:**`http://localhost:3010/pitch/contacts`
   - Manage contacts (brutalist styling )

9. **History:**`http://localhost:3010/pitch/history`
   - View all past pitches (brutalist styling )

---

## Quick Test Links

### Test Brutalist Design Consistency:

- **Generate Form:**`http://localhost:3010/pitch/generate` 
- **Template Cards:**`http://localhost:3010/pitch/templates` 
- **Batch Cards:**`http://localhost:3010/pitch/batch` 
- **Dashboard Cards:**`http://localhost:3010/dashboard` 
- **Contact Cards:**`http://localhost:3010/pitch/contacts` 

### Test Integration Flow:

1. **Audio Intel → Pitch Generator:**
   - From Audio Intel, copy contact data
   - Go to: `http://localhost:3010/pitch/generate?import=clipboard`
   - Contact should auto-import

2. **Pitch Generator → Campaign Tracker:**
   - Generate a pitch: `http://localhost:3010/pitch/generate`
   - Review pitch: `http://localhost:3010/pitch/review/[id]`
   - Click "Send to Tracker" button

---

## Notes

- **Port:**Default is `3010` (check your terminal output when running `npm run dev`)
- **Dynamic Routes:**Replace `[id]` with actual IDs from your database
- **Auth Required:**Most pages require authentication (redirects to `/auth/signin`)

---

## Start Dev Server

```bash
cd apps/pitch-generator
npm run dev
```

Then visit: `http://localhost:3010` (or the port shown in terminal)
