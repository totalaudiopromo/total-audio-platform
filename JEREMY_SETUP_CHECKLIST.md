# Jeremy's Beta Setup - Complete Checklist

## What's Already Done

1. **Scripts Created**
   - `scripts/setup-beta-user.ts` - Creates account in Prisma database (for API backend)
   - `scripts/setup-jeremy-supabase.ts` - Creates account in Supabase (for Audio Intel)
   - `scripts/send-welcome-email.ts` - Sends welcome email via Resend
   - `scripts/add-jeremy-to-convertkit.ts` - Adds to ConvertKit with tags **DONE**

2. **ConvertKit Integration**
   - Jeremy added to ConvertKit 
   - Tags applied: `beta-user`, `artist`, `streamer-band` 

3. **Documentation**
   - `BETA_USER_SETUP_GUIDE.md` - Comprehensive guide
   - `JEREMY_BETA_SETUP_QUICKSTART.md` - Quick reference
   - `JEREMY_SETUP_CHECKLIST.md` - This file

4. **Code Updates**
   - `apps/api/src/routes/auth.ts` - Updated to use real database auth

## What Still Needs to Be Done

### 1. Supabase Account Creation 

**Setup Script:**

```bash
# Requires SUPABASE_SERVICE_ROLE_KEY (already configured)
npx tsx scripts/setup-jeremy-supabase.ts
```

**Status:** Complete - Jeremy's account created in Supabase

### 2. Welcome Email

```bash
# Requires RESEND_API_KEY
export RESEND_API_KEY="your-key"
npx tsx scripts/send-welcome-email.ts info@streamer.co.uk
```

**Status:** Waiting (you said don't send yet)

### 3. Verify Access

Once accounts are created, test:

**Audio Intel:**

- Visit: https://intel.totalaudiopromo.com/signin
- Login with: `info@streamer.co.uk` / `Streamer2024!BetaAccess`
- Verify beta access (500 enrichments limit)

**API Backend:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info@streamer.co.uk","password":"Streamer2024!BetaAccess"}'
```

## Required Environment Variables

### Supabase (Already Configured ):

```bash
NEXT_PUBLIC_SUPABASE_URL="https://ucncbighzqudaszewjrv.supabase.co" # In all apps
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." # In all apps
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # In root .env.local 
```

### For Welcome Email:

```bash
RESEND_API_KEY="re_..." # In .env.local
```

### Already Configured:

```bash
CONVERTKIT_API_KEY="5wx6QPvhunue-d760yZHIg" 
CONVERTKIT_API_SECRET="BMiOCi6hPDA73O1pnwXh7_bXEBi5zMzf7Tgk5rP_trI" 
```

## Next Steps

1. **Supabase Setup Complete**
   - Jeremy's account created in Supabase
   - Beta access configured (500 enrichments)

2. **Test Access**
   - Test login: `npx tsx scripts/test-jeremy-login.ts`
   - Monitor usage: `npx tsx scripts/monitor-jeremy-usage.ts`
   - Verify access: `npx tsx scripts/verify-jeremy-access.ts`

3. **Send Welcome Email** (when ready)
   - Run: `npx tsx scripts/send-welcome-email.ts info@streamer.co.uk`

## Account Summary

| System              | Email               | Password                | Status     |
| ------------------- | ------------------- | ----------------------- | ---------- |
| ConvertKit          | info@streamer.co.uk | N/A                     | Added   |
| Supabase (All Apps) | info@streamer.co.uk | Streamer2024!BetaAccess | Created |

## Quick Links

- **Audio Intel:** https://intel.totalaudiopromo.com
- **ConvertKit Dashboard:** https://app.convertkit.com/subscribers
- **Supabase Dashboard:** https://supabase.com/dashboard (check your project)

---

**Last Updated:** 2025-11-15
**Status:** ConvertKit | Supabase | Email (ready to send)
