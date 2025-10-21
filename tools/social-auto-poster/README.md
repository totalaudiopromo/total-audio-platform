# Unified Social Auto-Poster

Post to LinkedIn, Bluesky, and Threads with ONE command.
Set it and forget it.

## Quick Start

### 1. Install
```bash
cd tools/social-auto-poster
npm install
```

### 2. Setup (ONE TIME)
```bash
node setup-wizard.js
```

Follow the prompts for each platform you want to use.

### 3. Post Now
```bash
node unified-poster.js post "Your content here"
```

### 4. Set and Forget
```bash
node scheduler.js start
```

Done! Now runs in background.

## Commands

### Manual Posting
```bash
# Post to all platforms
node unified-poster.js post "Hello world!"

# Schedule for later
node unified-poster.js schedule "Content" "2025-10-22T10:00:00Z"

# View stats
node unified-poster.js stats
```

### Auto-Scheduler
```bash
# Start scheduler (runs forever)
node scheduler.js start

# Add to auto-post queue
node scheduler.js queue "Post this automatically"
```

## Platform Setup

### LinkedIn (Easiest)
1. Go to https://www.linkedin.com/developers/apps
2. Create app, add "Share on LinkedIn" (FREE)
3. Run setup wizard

### Bluesky (Easy)
1. Settings > App Passwords
2. Create new password
3. Run setup wizard

### Threads (Complex)
1. Requires Facebook Developer account
2. Add Threads product to app
3. Get access token
4. Run setup wizard

## Files Created

- `social-config.json` - Your credentials (keep private!)
- `scheduled-posts.json` - Scheduled posts
- `content-queue.json` - Auto-post queue

## Support

- LinkedIn: FREE tier, 5 posts/day
- Bluesky: FREE, unlimited
- Threads: FREE after setup

## Troubleshooting

**"Config not found"**
Run: `node setup-wizard.js`

**"LinkedIn auth failed"**
Access token may have expired. Re-run setup wizard.

**"Bluesky failed"**
Check your app password is correct.

**"Threads not posting"**
Threads setup is complex. May need developer account verification.
