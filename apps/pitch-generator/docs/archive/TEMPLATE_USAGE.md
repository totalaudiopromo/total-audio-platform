# TAP SaaS Template - Usage Guide

## ⚠️ IMPORTANT: This is a Template Directory

**DO NOT modify this directory directly when building new tools.**

This `tap-saas-template` directory is your clean, reusable starting point for all TAP mini-tools. Keep it pristine so you can duplicate it for each new tool you build.

---

## Creating a New Tool

### Step 1: Duplicate the Template

From your monorepo root (`total-audio-platform/`):

```bash
cd apps/
cp -r tap-saas-template your-new-tool-name
cd your-new-tool-name
```

**Examples:**

```bash
# Creating Audio Intel
cp -r tap-saas-template audio-intel

# Creating Playlist Pulse
cp -r tap-saas-template playlist-pulse

# Creating Release Radar
cp -r tap-saas-template release-radar
```

---

### Step 2: Customise the New Tool

Once you've duplicated the template, update these files:

#### 1. `package.json`

```json
{
  "name": "audio-intel", // Change from "tap-saas-template"
  "version": "0.1.0"
  // ... rest of config
}
```

#### 2. `app/layout.tsx` - Update metadata

```tsx
export const metadata: Metadata = {
  title: 'Audio Intel - AI-Powered Music Contact Research',
  description: 'Find the right music journalists, bloggers, and radio contacts in seconds.',
};
```

#### 3. Update Brand Colour Throughout

Replace all instances of `bg-blue-500` / `text-blue-500` / `border-blue-500` with your tool's signature colour:

- **Audio Intel:** `bg-blue-500` (Electric Blue) - Keep as is!
- **Playlist Pulse:** `bg-green-500` (Neon Green)
- **Release Radar:** `bg-amber-500` (Orange/Amber)
- **Trend Track:** `bg-purple-500` (Purple/Magenta)
- **Content Clone:** `bg-pink-500` (Hot Pink)
- **Success Predict:** `bg-yellow-500` (Gold/Yellow)

#### 4. Update Tool Names

Search and replace throughout:

- "Pitch Generator" → "Your Tool Name"
- Update navigation links in `components/SiteHeader.tsx`
- Update badge text from `<span className="badge-postcraft">Pitch Generator</span>`

#### 5. Database Schema

- Update `supabase/schema.sql` with tool-specific tables
- Keep the naming convention: `{tool_prefix}_tablename`
  - Example: `intel_contacts`, `pulse_playlists`, `radar_releases`

---

### Step 3: Environment Setup

Each tool gets its own environment variables:

```bash
# Copy the example env file
cp .env.example .env.local

# Update with tool-specific credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-key
# ... etc
```

---

### Step 4: Deploy Separately

Each tool should be deployed as its own app:

```bash
# Vercel example
vercel --prod

# Or configure in vercel.json
{
  "name": "audio-intel-tap",
  "framework": "nextjs"
}
```

**Benefits of separate deployments:**

- Independent scaling per tool
- Tool-specific domains (audiointel.tap.com, playlistpulse.tap.com)
- Isolated databases and auth
- Easier to manage pricing tiers per tool
- Can sunset individual tools without affecting others

---

## Template Maintenance

### When to Update the Template

Only update `tap-saas-template` when you discover:

- Better design patterns
- Bug fixes that apply to ALL tools
- Improved component structures
- Design system enhancements

### After Updating the Template

If you improve the template, consider backporting changes to existing tools:

```bash
# Review changes
git diff tap-saas-template/

# Manually apply relevant changes to each tool
# (Automated merge is risky due to tool-specific customisations)
```

---

## File Structure Reference

### What to Keep the Same Across Tools

- `globals.css` - Design system (Postcraft aesthetic)
- `tailwind.config.ts` - Core configuration
- `DESIGN_SYSTEM.md` - Aesthetic standards
- Component patterns (`.glass-panel`, `.cta-button`, etc.)
- Auth setup (`middleware.ts`, `app/api/auth/`)

### What to Customise Per Tool

- Tool-specific routes (`app/[tool-routes]/`)
- Brand colour (blue → your tool colour)
- Database schema (`supabase/schema.sql`)
- API routes (`app/api/[tool-apis]/`)
- Tool-specific components
- Metadata and SEO content

---

## Monorepo Structure

Your final structure should look like:

```
total-audio-platform/
├── apps/
│   ├── tap-saas-template/      ← Keep pristine, never deploy
│   ├── pitch-generator/        ← Deployed to pitch.tap.com
│   ├── audio-intel/            ← Deployed to intel.tap.com
│   ├── playlist-pulse/         ← Deployed to pulse.tap.com
│   └── release-radar/          ← Deployed to radar.tap.com
├── packages/
│   └── shared-ui/              (Optional: Shared components)
└── package.json                (Monorepo root)
```

---

## Quick Start Checklist

Starting a new tool? Use this checklist:

- [ ] `cd apps/ && cp -r tap-saas-template new-tool-name`
- [ ] Update `package.json` name field
- [ ] Update `app/layout.tsx` metadata
- [ ] Search/replace "Pitch Generator" → "New Tool Name"
- [ ] Update brand colour throughout (blue → tool colour)
- [ ] Update `supabase/schema.sql` with tool tables
- [ ] Configure `.env.local` with credentials
- [ ] Update `components/SiteHeader.tsx` navigation
- [ ] Test locally: `npm run dev`
- [ ] Deploy to Vercel/hosting platform
- [ ] Set up tool-specific domain

---

## Questions?

Refer to `DESIGN_SYSTEM.md` for aesthetic standards and component patterns.

**Remember:** This template is your friend. Keep it clean, duplicate freely, and build brilliant tools. 🎵
