# TAP SaaS Template

## ⚠️ THIS IS A TEMPLATE - DO NOT MODIFY DIRECTLY

This is your clean, reusable starting point for all TAP mini-tools. **Duplicate this directory for each new tool** - never modify the template directly.

👉 **Read first:** [`TEMPLATE_USAGE.md`](./TEMPLATE_USAGE.md) - Complete duplication workflow  
🎨 **Design standards:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) - Postcraft aesthetic guide

---

## Core Concept

Reuse this architecture to ship micro-tools fast—Postcraft styling system, OAuth, and Stripe checkout baked in.

## What's Included

- Clean Postcraft design system (bold borders, offset shadows, no gradients)
- Global marketing pages (hero, pricing, CTA blocks)
- Stripe checkout with safe dev fallback
- NextAuth with credentials + Google OAuth ready
- Protected routes via middleware
- Next.js App Router + TypeScript + Tailwind
- UK spelling throughout

## Quick start

1. From the repo root: `bash scripts/bootstrap-tap-template.sh apps/tap-saas-template`
2. Update `.env.local` with the correct secrets for your deployment
3. `npm run dev`

### Required env when enabling payments

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_...
STRIPE_PRICE_AGENCY_MONTHLY=price_...
STRIPE_PRICE_AGENCY_ANNUAL=price_...
```

> The example env file ships with production keys so the template can render real flows out of the box. Swap them for test-mode credentials when you clone a new tool.

### OAuth & demo auth

```
 NEXTAUTH_SECRET=your-secret
 NEXTAUTH_URL=http://localhost:3000
 DEMO_USER_EMAIL=founder@totalaudiopromo.com
 DEMO_USER_PASSWORD=buildfast
 GOOGLE_CLIENT_ID=...
 GOOGLE_CLIENT_SECRET=...
```

- Visit `/auth/signin` to use the demo credentials or trigger Google OAuth once keys are set
- `/profile` and `/settings` are guarded via `middleware.ts`

## Creating a New Tool

### Quick Method

```bash
cd apps/
cp -r tap-saas-template your-new-tool
cd your-new-tool
# Update package.json, branding, colours
```

### Complete Checklist

See [`TEMPLATE_USAGE.md`](./TEMPLATE_USAGE.md) for the full step-by-step guide, including:

- How to duplicate without overwriting the template
- What files to customise
- Brand colour updates
- Database schema setup
- Deployment strategy

## Automation helpers

- `scripts/bootstrap-tap-template.sh` — bootstraps dependencies and ensures `.env.local` exists (pass a custom path if the template lives elsewhere)
- `node scripts/clone-tap-template.js <app-name>` — duplicate the template, scrub build artifacts, and rename metadata/package fields

## Design System

- **Clean Postcraft aesthetic:** Bold borders, offset shadows, solid colours (no gradients!)
- `app/globals.css` defines `.glass-panel`, `.cta-button`, `.subtle-button`, `.badge-postcraft`
- `tailwind.config.ts` has brand colours for each tool
- See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for complete component reference
- Shared navigation/footer in `components/SiteHeader.tsx` and `components/SiteFooter.tsx`

## Auth notes

- NextAuth credentials provider keeps local dev frictionless—swap to your real provider before launch
- The Google provider loads automatically when `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` are present (see `AUTH_SETUP.md` for details)
- Extend types in `types/next-auth.d.ts` if you add more user metadata
- See `AUTH_SETUP.md` for a production hardening checklist

## Stripe checkout

- `app/api/checkout/route.ts` handles price lookup via env vars
- When Stripe keys are missing the handler redirects straight to `/success` so you can demo the UX immediately

## Documentation

### Core Documentation (Root Level)

- **[TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md)** - How to duplicate and customise this template
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Complete Postcraft aesthetic guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Development setup guide

### Additional Documentation (`/docs/`)

- **[docs/README.md](./docs/README.md)** - Complete documentation index
- **Setup Guides:** Auth setup, configuration, integrations
- **Reference:** Technical specs, feature docs
- **Status Reports:** Historical completion notes (archive)

**Browse all docs:** [`/docs/`](./docs/)

## Tool-Specific Customisation

When you duplicate this template, remove/replace:

- Pitch Generator specific routes (`app/pitch/`)
- Pitch-specific API routes (`app/api/pitch/`, `app/api/pitches/`)
- Pitch database tables (keep auth tables)
- Tool name references throughout
- Update brand colour from blue to your tool's colour

## Notes

- Email/notifications: add Resend, Nodemailer, or provider of choice
- Auth provider: extend `app/api/auth/[...nextauth]/route.ts` if you need more providers or RBAC
- Tailwind plugins: add `@tailwindcss/forms` or `tailwindcss-animate` as your feature set expands
