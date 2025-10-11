# Total Audio Platform - Port Assignments

To avoid conflicts when working on multiple sites, use these dedicated ports:

## Port Assignments

- **Audio Intel**: Port 3000
- **Pitch Generator**: Port 3001
- **Tracker**: Port 3004
- **Newsletter Dashboard**: Port 3002
- **Command Centre**: Port 3003

## Starting Tracker

Use the startup script:
```bash
./start-tracker.sh
```

Or manually:
```bash
PORT=3004 npm run dev
```

## Avoiding Port Conflicts

### Option 1: Use Different Ports (Recommended)
Always start each app on its dedicated port above.

### Option 2: Use Package Manager Workspaces
From the root directory:
```bash
# Start specific app
npm run dev --workspace=tracker
npm run dev --workspace=audio-intel
npm run dev --workspace=pitch-generator
```

### Option 3: Kill All Node Processes Before Starting
```bash
killall -9 node
npm run dev
```

## Checking What's Running

```bash
# See what's on each port
lsof -i :3000
lsof -i :3001
lsof -i :3004

# See all node processes
ps aux | grep node

# Kill specific port
lsof -ti:3004 | xargs kill -9
```

## OAuth Redirect URIs

Make sure your Google OAuth client has redirect URIs for the correct port:

**Tracker (Port 3004)**:
- http://localhost:3004/api/integrations/google-sheets/callback
- http://localhost:3004/api/integrations/gmail/callback

**Audio Intel (Port 3000)**:
- http://localhost:3000/api/auth/callback/google

**Pitch Generator (Port 3001)**:
- http://localhost:3001/api/auth/callback/google

---

**Pro Tip**: Add these to your `.zshrc` or `.bashrc`:

```bash
alias tracker='cd ~/workspace/active/total-audio-platform/apps/tracker && ./start-tracker.sh'
alias intel='cd ~/workspace/active/total-audio-platform/apps/audio-intel && PORT=3000 npm run dev'
alias pitch='cd ~/workspace/active/total-audio-platform/apps/pitch-generator && PORT=3001 npm run dev'
```

Then just type `tracker` to start Tracker anywhere!
