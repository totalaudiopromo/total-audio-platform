# TAP SaaS Template

Core concept: reuse the Audio Intel architecture to ship micro-tools fast.

## Includes

- Auth-ready shell (add provider of choice)
- Stripe checkout route with safe dev fallback
- Dashboard placeholders: home, profile, settings
- Next.js + TypeScript + Tailwind hooks ready

## Quick start

1. Copy `.env.local.example` → `.env.local` and set keys
2. `npm install`
3. `npm run dev`

Required env (when enabling payments):

- `STRIPE_SECRET_KEY=sk_test_...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...`
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_...`
- `STRIPE_PRICE_AGENCY_MONTHLY=price_...`
- `STRIPE_PRICE_AGENCY_ANNUAL=price_...`
- `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

## New Tool Checklist

1. Clone this template
2. Rename branding and product copy
3. Add your core feature (new routes, components)
4. Configure Stripe products/prices
5. Deploy (Vercel or your choice)

## What to strip when templating from Intel

- Audio analysis logic, file handling, Intel dashboards, audio DB tables

## Notes

- Email/notifications: add Resend, Nodemailer, or provider of choice
- Auth: add NextAuth or custom token/session as needed
