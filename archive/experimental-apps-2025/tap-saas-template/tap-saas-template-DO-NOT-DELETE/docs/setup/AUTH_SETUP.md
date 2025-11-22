# Authentication Quickstart

The template ships with NextAuth.js prewired so every new tool has protected areas ready to customise.

## Demo credentials

- Email: `founder@totalaudiopromo.com`
- Password: `buildfast`

These values live in `.env.local.example` (`DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`). Change them or remove the credentials provider before sharing a public preview.

## OAuth providers

Google OAuth is enabled automatically when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present. Update `.env.local` and rerun the dev server—no code changes required. Add additional providers by extending `app/api/auth/[...nextauth]/route.ts`.

## Guarded routes

- `/profile` and `/settings` are protected by `middleware.ts`. Unauthenticated visitors are redirected to `/unauthorized`, which links to the sign-in flow.
- The middleware reads `NEXTAUTH_SECRET`; make sure it is set in every environment (local and production).

## Customising the session

Augment the session object in `types/next-auth.d.ts` and extend the callbacks in `app/api/auth/[...nextauth]/route.ts` when you need extra claims (roles, plan tiers, etc.).

## Production checklist

1. Rotate `NEXTAUTH_SECRET` to a unique value per deployment.
2. Replace the demo credentials provider with your preferred auth strategy (Google, GitHub, email magic links, etc.).
3. Populate the OAuth provider callback URLs for every host (local, staging, production).
4. Update the copy in `/auth/signin` if the demo account is removed.
