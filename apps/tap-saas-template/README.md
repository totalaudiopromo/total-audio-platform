# TAP SaaS Template

Core concept: reuse the Audio Intel architecture to ship micro-tools fast—now with the Postcraft styling system and OAuth guard baked in.

## Includes

- Postcraft-inspired Tailwind setup matching `intel.totalaudiopromo.com`
- Global marketing hero, feature grid, CTA blocks, and footer in the shared layout
- Stripe checkout route with safe dev fallback and success screen
- Protected profile + settings areas enforced by middleware with an `/unauthorized` fallback
- Credentials + Google provider stubs ready for OAuth
- Next.js App Router + TypeScript + Tailwind hooks ready

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

## New Tool Checklist

1. `node ../../scripts/clone-tap-template.js new-app-name` (or duplicate manually without the `.next` / `node_modules` folders)
2. Update marketing copy in `app/page.tsx` and CTA links
3. Rename product references and update pricing copy in `app/pricing/page.tsx`
4. Add your core feature modules inside the protected area (new routes under `/profile` or additional guarded routes)
5. Configure Stripe products/prices and OAuth provider keys, then deploy

## Automation helpers

- `scripts/bootstrap-tap-template.sh` — bootstraps dependencies and ensures `.env.local` exists (pass a custom path if the template lives elsewhere)
- `node scripts/clone-tap-template.js <app-name>` — duplicate the template, scrub build artifacts, and rename metadata/package fields

## Styling system

- `tailwind.config.ts` mirrors the Audio Intel palette with Postcraft gradients & glassmorphism helpers
- `app/globals.css` defines the background gradients, glass panel class, CTA buttons, and typography
- Shared navigation/footer live in `components/SiteHeader.tsx` and `components/SiteFooter.tsx`

## Auth notes

- NextAuth credentials provider keeps local dev frictionless—swap to your real provider before launch
- The Google provider loads automatically when `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` are present (see `AUTH_SETUP.md` for details)
- Extend types in `types/next-auth.d.ts` if you add more user metadata
- See `AUTH_SETUP.md` for a production hardening checklist

## Stripe checkout

- `app/api/checkout/route.ts` handles price lookup via env vars
- When Stripe keys are missing the handler redirects straight to `/success` so you can demo the UX immediately

## What to strip when templating from Intel

- Audio analysis logic, file handling, Intel dashboards, audio DB tables
- Any agent-specific configuration you don’t need for the tool you are cloning

## Notes

- Email/notifications: add Resend, Nodemailer, or provider of choice
- Auth provider: extend `app/api/auth/[...nextauth]/route.ts` if you need more providers or RBAC
- Tailwind plugins: add `@tailwindcss/forms` or `tailwindcss-animate` as your feature set expands
