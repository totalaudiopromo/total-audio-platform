# Liberty Music PR - Demo Dashboard

Demo dashboard for Liberty Music PR, integrating Audio Intel, Pitch Generator, and Campaign Tracker.

## Quick Start

```bash
# From Total Audio platform root
cd /Users/chrisschofield/workspace/active/total-audio-platform

# Install dependencies (if not already done)
pnpm install

# Run development server
cd apps/liberty-demo
pnpm dev

# Or from root
pnpm --filter liberty-demo dev
```

The app will be available at http://localhost:3005

## Migration Instructions

**Your current work is in:** `/Users/chrisschofield/workspace/liberty-music-pr/liberty-dashboard/`

### When You're Ready to Migrate:

1. **Finish your current session** and commit everything in the old location
2. **Copy your components and pages** from the old Vite structure to this Next.js structure:

```bash
# Copy components
cp -r /Users/chrisschofield/workspace/liberty-music-pr/liberty-dashboard/components/* \
      /Users/chrisschofield/workspace/active/total-audio-platform/apps/liberty-demo/components/

# Copy pages (convert to Next.js App Router format)
# Old: pages/*.tsx → New: app/*/page.tsx
```

3. **Convert Router syntax:**
   - Old (Vite): `import { BrowserRouter, Route } from 'react-router-dom'`
   - New (Next.js): Use `app/` directory structure with `page.tsx` files

4. **Update imports:**
   - Old: `import Button from './components/Button'`
   - New: `import { Button } from '@total-audio/ui'` (shared components)
   - New: `import Button from '@/components/Button'` (local components)

## Integration with Total Audio Apps

### Audio Intel API

```typescript
// Example: Enrich contacts
const response = await fetch(`${process.env.AUDIO_INTEL_API_URL}/enrich`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contacts: [...] })
})
```

### Pitch Generator API

```typescript
// Example: Generate pitch
const response = await fetch(`${process.env.PITCH_GENERATOR_API_URL}/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ artist: '...', contacts: [...] })
})
```

### Campaign Tracker API

```typescript
// Example: Track campaign
const response = await fetch(`${process.env.TRACKER_API_URL}/campaigns`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ campaignData: {...} })
})
```

## Shared Packages Available

This app has access to:

- **@total-audio/ui** - Shared UI components (buttons, forms, layouts)
- **@total-audio/core-db** - Shared database utilities and types
- **@total-audio/testing** - Mobile testing validators

Example usage:

```typescript
import { Button, Card, Input } from '@total-audio/ui';
import { validateAllTouchTargets } from '@total-audio/testing';
```

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (port 3005)

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Quality checks
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript validation

# Testing
pnpm test             # Run all tests
pnpm test:mobile      # Run mobile tests
pnpm test:headed      # Run tests with browser visible
```

## Deployment

### Vercel Setup

The app is configured for Vercel deployment:

1. **Link to Vercel** (one-time setup):

```bash
cd apps/liberty-demo
vercel link
# Follow prompts to link to your Vercel account
```

2. **Configure environment variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `AUDIO_INTEL_API_URL` (if needed)
   - `PITCH_GENERATOR_API_URL` (if needed)
   - `TRACKER_API_URL` (if needed)

3. **Deploy**:

```bash
# From root
pnpm run deploy:liberty-demo

# Or from app directory
vercel --prod
```

### GitHub Actions

The CI/CD pipeline is already configured:

- **CI workflow** (`.github/workflows/ci.yml`) - Runs on every push
  - Lints code
  - Runs type checks
  - Runs tests
  - Builds the app

## Architecture Notes

### Why Next.js instead of Vite?

The Total Audio platform uses Next.js for all apps:

- Server-side rendering for better SEO
- API routes for backend logic
- Shared build configuration
- Consistent deployment pipeline

### Converting from Vite/React Router

**Key differences:**

| Vite/React Router     | Next.js App Router                   |
| --------------------- | ------------------------------------ |
| `src/pages/Home.tsx`  | `app/page.tsx`                       |
| `src/pages/About.tsx` | `app/about/page.tsx`                 |
| `<Link to="/about">`  | `<Link href="/about">`               |
| `useNavigate()`       | `useRouter()` from `next/navigation` |
| Client-side only      | Server + Client components           |

**Example conversion:**

```tsx
// OLD (Vite + React Router)
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
      </Routes>
    </BrowserRouter>
  )
}

// NEW (Next.js App Router)
// app/page.tsx
export default function Home() { ... }

// app/campaigns/page.tsx
export default function Campaigns() { ... }
```

## File Structure

```
apps/liberty-demo/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── campaigns/         # Example sub-route
│       └── page.tsx
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── tests/
│   └── mobile/           # Mobile tests
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json           # Vercel deployment config
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

Optional (for API integration):

- `AUDIO_INTEL_API_URL` - Default: https://intel.totalaudiopromo.com/api
- `PITCH_GENERATOR_API_URL` - Default: https://pitch.totalaudiopromo.com/api
- `TRACKER_API_URL` - Default: https://tracker.totalaudiopromo.com/api

## Live URLs

Once deployed, the app will be available at a Vercel URL like:

- Production: `https://liberty-demo.vercel.app` (or custom domain)
- Preview: Automatic preview URLs for each Git branch

## Support

For questions about:

- **Total Audio platform setup**: Check main README at root
- **Shared components**: See `packages/ui/README.md`
- **Deployment issues**: See `.github/workflows/ci.yml`
- **Integration APIs**: Check respective app documentation (audio-intel, pitch-generator, tracker)
