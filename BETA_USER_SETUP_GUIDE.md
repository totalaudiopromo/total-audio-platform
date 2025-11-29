# Beta User Setup Guide

Complete guide for setting up beta user access to Total Audio Promo platform.

## Overview

This guide covers the complete setup process for granting beta access to users, including:

- Database account creation
- Subscription configuration
- Welcome email delivery
- Single sign-on (SSO) setup across all apps

## Beta User Configuration

### Jeremy's Access Details

| Field           | Value                   |
| --------------- | ----------------------- |
| **Email**      | info@streamer.co.uk     |
| **Password**   | Streamer2024!BetaAccess |
| **Name**       | Streamer                |
| **Role**       | ARTIST                  |
| **Beta Period**| 60 days                 |
| **Cost**       | £0/month                |
| **SSO**        | Enabled across all apps |

### Available Apps

| App                  | URL                         | Status         | Features                                  |
| -------------------- | --------------------------- | -------------- | ----------------------------------------- |
| **Audio Intel**     | intel.totalaudiopromo.com   | LIVE NOW    | Contact enrichment, CSV export, AI search |
| **Campaign Tracker**| tracker.totalaudiopromo.com | Coming soon | Campaign management, analytics            |
| **Pitch Generator** | pitch.totalaudiopromo.com   | Coming soon | AI pitch writing, templates               |

## Setup Process

### Prerequisites

1. **Supabase Access**Already Configured
   - Supabase project: `ucncbighzqudaszewjrv.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_URL` configured in all apps
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured in all apps
   - `SUPABASE_SERVICE_ROLE_KEY` configured in root `.env.local`

2. **Email Service**
   - Resend API account
   - `RESEND_API_KEY` environment variable set

**Note:**Platform uses Supabase (NOT Prisma). All database operations use Supabase directly.

### Step 1: Create Beta User Account

Run the Supabase setup script to create Jeremy's account:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
npx tsx scripts/setup-jeremy-supabase.ts
```

**What this does:**

- Creates user account in Supabase Auth with email `info@streamer.co.uk`
- Sets password: `Streamer2024!BetaAccess`
- Creates user profile in Supabase `users` table
- Configures beta access (500 enrichments limit)
- Handles existing users gracefully

**Note:**This uses Supabase directly - no Prisma or DATABASE_URL needed.

**Expected Output:**

```
Setting up beta user account...

Hashing password...
Creating user: info@streamer.co.uk...
User created: clxxx...

 Creating beta subscription...
Subscription created:
   Tier: ARTIST
   Monthly Price: £0
   Status: ACTIVE
   Period End: 2025-XX-XXTXX:XX:XX.XXXZ

Beta user setup complete!

Account Details:
   Email: info@streamer.co.uk
   Password: Streamer2024!BetaAccess
   Role: ARTIST
   Beta Period: 60 days
   Cost: £0/month

 IMPORTANT: User must change password on first login!

Setup complete!
```

### Step 2: Send Welcome Email

Send the welcome email with login credentials:

```bash
export RESEND_API_KEY="your-resend-api-key"
npx ts-node scripts/send-welcome-email.ts info@streamer.co.uk
```

**Or set in `.env.local`:**

```bash
RESEND_API_KEY=re_your_key_here
npx ts-node scripts/send-welcome-email.ts info@streamer.co.uk
```

**What this does:**

- Sends professional welcome email via Resend
- Includes login credentials
- Lists all available apps with status
- Provides beta access details
- Includes security reminder to change password

**Email includes:**

- Login credentials (email + password)
- Links to all three apps
- Beta access details (60 days, £0/month)
- Security reminder
- Support contact information

### Step 3: Add to ConvertKit (Optional)

For email marketing and beta user tracking:

1. Log into ConvertKit
2. Add contact: `info@streamer.co.uk`
3. Apply tags:
   - `beta-user`
   - `artist`
   - `streamer-band`

## Authentication Flow

### Database Authentication

The authentication system has been updated to use real database authentication:

**Before (Mock):**

- Hardcoded demo user
- Plain password comparison
- No database integration

**After (Real):**

- Prisma database queries
- Bcrypt password hashing/verification
- User and subscription data included in responses
- Proper error handling

### Login Endpoint

```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "info@streamer.co.uk",
  "password": "Streamer2024!BetaAccess"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "info@streamer.co.uk",
    "name": "Streamer",
    "role": "ARTIST",
    "subscription": {
      "tier": "ARTIST",
      "status": "ACTIVE",
      "monthlyPrice": "0",
      "currentPeriodEnd": "2025-XX-XXTXX:XX:XX.XXXZ"
    }
  }
}
```

### Single Sign-On (SSO)

Jeremy's credentials work across all three apps:

- **Audio Intel**- Available now
- **Campaign Tracker**- Coming soon (same credentials)
- **Pitch Generator**- Coming soon (same credentials)

All apps authenticate against the same database using JWT tokens.

## Files Created

### Scripts

1. **`scripts/setup-beta-user.ts`**
   - TypeScript script for creating beta users
   - Handles user creation and subscription setup
   - Idempotent (safe to run multiple times)

2. **`scripts/send-welcome-email.ts`**
   - Sends welcome email via Resend API
   - Professional HTML email template
   - Includes all app links and beta details

3. **`scripts/setup-beta-user.sql`**(Alternative)
   - SQL script for manual database setup
   - Use if TypeScript script unavailable

### Documentation

1. **`BETA_USER_SETUP_GUIDE.md`**(This file)
   - Comprehensive setup guide
   - Step-by-step instructions
   - Troubleshooting section

2. **`JEREMY_BETA_SETUP_QUICKSTART.md`**
   - Quick reference for Jeremy's setup
   - Essential commands only
   - Fast setup checklist

### Code Updates

1. **`apps/api/src/routes/auth.ts`**
   - Updated to use real database authentication
   - Removed mock user code
   - Added subscription data to responses
   - Proper error handling

## Troubleshooting

### User Already Exists

If you see "User already exists" message:

- Script will check for existing subscription
- Creates subscription if missing
- Safe to re-run script

### Supabase Connection Error

**Error:**`Supabase URL not found` or connection issues

**Solution:**

1. Check `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` or app-specific `.env.local`
2. Verify Supabase project is active at https://app.supabase.com
3. Check `SUPABASE_SERVICE_ROLE_KEY` is set for admin operations

### Email Not Sending

**Error:**`RESEND_API_KEY not set` or email fails

**Solution:**

1. Verify `RESEND_API_KEY` in environment
2. Check Resend dashboard for API key status
3. Verify email domain is verified in Resend
4. Check Resend API limits/quota

### Password Hash Error

**Error:**`bcrypt` related errors

**Solution:**

```bash
cd apps/api
npm install bcryptjs @types/bcryptjs
```

### Supabase Client Issues

**Error:**`Supabase client not initialized`

**Solution:**

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Check Supabase project is active
3. For admin operations, ensure `SUPABASE_SERVICE_ROLE_KEY` is configured

## Security Considerations

1. **Password Security**
   - Passwords are hashed using bcrypt (10 rounds)
   - Never log passwords in production
   - User must change password on first login

2. **JWT Tokens**
   - Tokens expire after 24 hours
   - Use strong `JWT_SECRET` in production
   - Store secrets in environment variables

3. **Database Access**
   - Use connection pooling
   - Limit database user permissions
   - Enable SSL for production connections

4. **Email Security**
   - Never include passwords in email logs
   - Use secure email service (Resend)
   - Verify email domain ownership

## Subscription Management

### Beta Subscription Details

- **Tier:**ARTIST
- **Status:**ACTIVE
- **Monthly Price:**£0.00
- **Setup Fee:**£0.00
- **Period End:**60 days from creation

### Extending Beta Period

To extend beta access:

```typescript
// Update subscription period end date
await prisma.subscription.update({
  where: { userId: 'user_id' },
  data: {
    currentPeriodEnd: new Date('2025-XX-XX'),
  },
});
```

### Converting to Paid Subscription

When beta ends, convert to paid:

```typescript
await prisma.subscription.update({
  where: { userId: 'user_id' },
  data: {
    tier: 'ARTIST',
    monthlyPrice: 19.99, // £19.99/month
    status: 'ACTIVE',
    currentPeriodEnd: new Date('2025-XX-XX'), // 30 days from now
  },
});
```

## Verification Checklist

After setup, verify:

- [ ] User account created in database
- [ ] Password hashed correctly
- [ ] Subscription created with £0/month
- [ ] Subscription period end is 60 days from now
- [ ] Welcome email sent successfully
- [ ] User can log in to Audio Intel
- [ ] JWT token generated correctly
- [ ] Subscription data included in login response
- [ ] User added to ConvertKit (if applicable)

## Next Steps

1. **Test Login**
   - Log in to Audio Intel with beta credentials
   - Verify subscription data displays correctly
   - Test contact enrichment features

2. **Monitor Usage**
   - Track beta user activity
   - Collect feedback
   - Monitor subscription period end date

3. **Prepare for Launch**
   - Set up Campaign Tracker authentication
   - Set up Pitch Generator authentication
   - Plan beta-to-paid conversion flow

## Support

If you encounter issues:

1. Check error logs in console
2. Verify environment variables
3. Test database connection
4. Check Resend API status
5. Review Prisma schema migrations

## Notes

- Beta users get full access to all features
- No credit card required during beta
- Subscription automatically expires after 60 days
- User can upgrade to paid plan anytime
- SSO works across all apps once deployed

---

**Last Updated:**2025-01-XX
**Version:**1.0.0
