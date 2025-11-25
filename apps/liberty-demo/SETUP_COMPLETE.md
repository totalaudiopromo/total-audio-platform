# Liberty Demo - Setup Complete ✅

## What's Been Set Up

### 1. Next.js App Structure

- ✅ Full Next.js 16 app with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with Total Audio brand colours (#3AA9BE)
- ✅ Responsive design utilities
- ✅ Accessibility support (tailwindcss-animate)

### 2. Platform Integration

- ✅ Workspace package references (`@total-audio/ui`, `@total-audio/core-db`)
- ✅ Shared testing utilities (`@total-audio/testing`)
- ✅ Environment variables for API integration
- ✅ Build scripts in root package.json

### 3. CI/CD Pipeline

- ✅ GitHub Actions workflow updated (`.github/workflows/ci.yml`)
- ✅ Automated builds on push to main
- ✅ TypeScript validation
- ✅ Test execution
- ✅ Build artifact caching

### 4. Vercel Deployment

- ✅ vercel.json configuration
- ✅ Environment variable setup
- ✅ Build command configuration
- ✅ Deploy script: `pnpm run deploy:liberty-demo`

### 5. Documentation

- ✅ Comprehensive README with migration guide
- ✅ Environment variable examples
- ✅ API integration examples
- ✅ Conversion guide from Vite to Next.js

## Directory Structure

```
apps/liberty-demo/
├── app/                         # Next.js pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                  # React components (ready for your code)
├── lib/                         # Utilities (ready for your code)
├── public/                      # Static assets (logos, images)
├── tests/mobile/               # Mobile test suite
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── migrate-from-vite.sh        # Migration helper script
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── README.md                   # Full documentation
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment config
```

## Your Current Work Location

**Old Location (Vite):**

```
/Users/chrisschofield/workspace/liberty-music-pr/liberty-dashboard/
```

**New Location (Next.js):**

```
/Users/chrisschofield/workspace/active/total-audio-platform/apps/liberty-demo/
```

## Next Steps - When You're Ready

### Step 1: Finish Current Session

- Complete your work in the other chat
- Commit everything in `/liberty-music-pr/liberty-dashboard/`
- Make sure you're happy with the current state

### Step 2: Run Migration Script

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/liberty-demo
./migrate-from-vite.sh
```

This will copy:

- All components
- All utilities (lib/)
- Public assets (logos, images)
- Type definitions
- Constants

### Step 3: Convert Routes to Next.js

The migration script can't do this automatically. You'll need to:

1. Check your current `App.tsx` or `pages/` directory for routes
2. Create equivalent `app/*/page.tsx` files

**Example:**

```tsx
// OLD: src/pages/Campaigns.tsx or route in App.tsx
function Campaigns() { ... }

// NEW: app/campaigns/page.tsx
export default function Campaigns() { ... }
```

### Step 4: Update Imports

```tsx
// OLD (Vite)
import Button from './components/Button';
import { useNavigate } from 'react-router-dom';

// NEW (Next.js)
import { Button } from '@total-audio/ui'; // Shared components
import Button from '@/components/Button'; // Local components
import { useRouter } from 'next/navigation';
```

### Step 5: Test Locally

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
pnpm install  # Install dependencies (first time only)
cd apps/liberty-demo
pnpm dev      # Start dev server on port 3005
```

Visit: http://localhost:3005

### Step 6: Deploy to Vercel

```bash
# From apps/liberty-demo/
vercel link  # Link to Vercel account (one-time)
vercel       # Preview deployment

# Or from root
pnpm run deploy:liberty-demo  # Production deployment
```

## Available Commands

From **Total Audio platform root**:

```bash
# Development
cd apps/liberty-demo && pnpm dev

# Or from root
pnpm --filter liberty-demo dev

# Build
pnpm run build:liberty-demo

# Deploy
pnpm run deploy:liberty-demo

# Test
cd apps/liberty-demo && pnpm test:mobile
```

## Shared Resources Available

### UI Components (@total-audio/ui)

```tsx
import { Button, Card, Input, Modal } from '@total-audio/ui';
```

### Database Utilities (@total-audio/core-db)

```tsx
import { supabase } from '@total-audio/core-db';
```

### Testing Utilities (@total-audio/testing)

```tsx
import { validateAllTouchTargets, validateAccessibility } from '@total-audio/testing';
```

## Integration with Other Apps

### Audio Intel API

```typescript
const response = await fetch('https://intel.totalaudiopromo.com/api/enrich', {
  method: 'POST',
  body: JSON.stringify({ contacts: [...] })
})
```

### Pitch Generator API

```typescript
const response = await fetch('https://pitch.totalaudiopromo.com/api/generate', {
  method: 'POST',
  body: JSON.stringify({ artist: '...', contacts: [...] })
})
```

### Campaign Tracker API

```typescript
const response = await fetch('https://tracker.totalaudiopromo.com/api/campaigns', {
  method: 'POST',
  body: JSON.stringify({ campaignData: {...} })
})
```

## Environment Variables Needed

Copy `.env.example` to `.env.local` and fill in:

**Required:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Optional (for API integration):**

- `AUDIO_INTEL_API_URL` (default: https://intel.totalaudiopromo.com/api)
- `PITCH_GENERATOR_API_URL` (default: https://pitch.totalaudiopromo.com/api)
- `TRACKER_API_URL` (default: https://tracker.totalaudiopromo.com/api)

## What You Get

✅ **Automatic CI/CD** - Every push to main triggers build + tests
✅ **Shared components** - Use Total Audio design system
✅ **Mobile testing** - Playwright mobile test suite ready
✅ **Type safety** - Full TypeScript support
✅ **Easy deployment** - One command to deploy to Vercel
✅ **Integration ready** - Pre-configured API endpoints for Intel, Pitch, Tracker

## Support

For help with:

- **Platform setup**: See main README at `/Users/chrisschofield/workspace/active/total-audio-platform/README.md`
- **Migration issues**: Check `README.md` in this directory
- **Deployment**: See `.github/workflows/ci.yml`
- **API integration**: Check respective app docs (audio-intel, pitch-generator, tracker)

---

**Setup Date**: 22 November 2025
**Status**: ✅ Ready for migration
**Next Action**: Finish current work, then run `./migrate-from-vite.sh`
