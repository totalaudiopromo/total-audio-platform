# Command Centre Security Setup

##  Password Protection Implemented

Your Command Centre is now protected with password authentication. No one can access it without the correct password.

## What Was Added

1. **Middleware** (`middleware.ts`) - Blocks all unauthenticated access
2. **Login Page** (`app/auth/login/page.tsx`) - Secure login interface
3. **Authentication API** (`app/api/auth/login/route.ts`) - Password verification
4. **Logout API** (`app/api/auth/logout/route.ts`) - Sign out functionality

## Setting Up Vercel Environment Variables

You need to add these environment variables to Vercel **manually**:

### Step 1: Open Vercel Dashboard

```bash
open "https://vercel.com/chris-projects-6ffe0e29/command-centre/settings/environment-variables"
```

### Step 2: Add These Variables

**Variable 1:**

- **Name:** `COMMAND_CENTRE_PASSWORD`
- **Value:** Choose a strong password (e.g., `MySecurePassword2025!`)
- **Environment:** Production

**Variable 2:**

- **Name:** `COMMAND_CENTRE_AUTH_TOKEN`
- **Value:** `wN3ByvLds9ANqQAZ56VEA8PHORbVy8XuS5wNmcM/GX0=`
- **Environment:** Production

### Step 3: Deploy

```bash
cd apps/command-centre
vercel --prod
```

## Local Testing

The `.env.local` file has been created with a temporary password:

- **Password:** `CommandCentre2025!SecureAccess`

** IMPORTANT:** Change this password in both `.env.local` and Vercel before deploying!

## How It Works

1. When anyone visits your Command Centre, they're redirected to `/auth/login`
2. They must enter the correct password
3. On successful login, a secure cookie is set for 30 days
4. The middleware checks this cookie on every request
5. Invalid/missing cookie = redirect to login

## Security Features

-  HTTP-only cookies (can't be accessed by JavaScript)
-  Secure cookies in production (HTTPS only)
-  30-day session timeout
-  No password recovery (by design - maximum security)
-  Server-side password verification
-  All routes protected except login and static assets

## Quick Commands

**Test locally:**

```bash
cd apps/command-centre
npm run dev
# Visit http://localhost:3000 - should redirect to login
```

**Deploy to production:**

```bash
cd apps/command-centre
vercel --prod
```

**Change password:**

1. Update in Vercel dashboard (see URL above)
2. Redeploy with `vercel --prod`

## Emergency: Disable Protection

If you need to temporarily disable protection:

1. Comment out the middleware by renaming:

   ```bash
   mv apps/command-centre/middleware.ts apps/command-centre/middleware.ts.disabled
   ```

2. Redeploy:
   ```bash
   vercel --prod
   ```

** WARNING:** Only do this temporarily! Your personal data will be exposed.

## Password Best Practices

 Use a mix of uppercase, lowercase, numbers, and symbols
 Make it at least 16 characters
 Don't use common words or patterns
 Store it securely (password manager recommended)
 Don't share it with anyone

Example strong password: `Cmd!Centre#2025$Secure@Access`
