# Beta User Setup Guide - Jeremy Garrett-Cox (Streamer)

## Overview

This guide provides step-by-step instructions to set up beta access for Jeremy Garrett-Cox from Streamer band across all three Total Audio Promo applications.

---

## 📊 Current Authentication System Analysis

### Architecture
- **Auth Type**: Custom JWT-based authentication
- **Database**: PostgreSQL with Prisma ORM
- **Backend**: Express API (`apps/api`)
- **Apps**:
  - Audio Intel (intel.totalaudiopromo.com) - Contact enrichment
  - Campaign Tracker (tracker.totalaudiopromo.com) - Campaign management
  - Pitch Generator (pitch.totalaudiopromo.com) - AI pitch writing

### User Model Structure
```typescript
User {
  id: string
  email: string (unique)
  name: string
  passwordHash: string
  role: ARTIST | AGENCY | ADMIN
  subscription: Subscription (optional)
  artists: Artist[] (linked artist profiles)
}

Subscription {
  tier: ARTIST | AGENCY | WHITE_LABEL
  status: ACTIVE | CANCELLED | EXPIRED
  monthlyPrice: Decimal
  setupFee: Decimal
  currentPeriodEnd: DateTime (beta expiry date)
}
```

### Authentication Flow
1. User logs in at any app with email/password
2. Backend API validates credentials against PostgreSQL
3. JWT token issued with 24-hour expiry
4. Token includes: userId, email, role, agencyId
5. Token valid across all three apps (single sign-on)
6. Apps validate token on each request
7. Subscription status checked at login

---

## 🚀 Setup Methods

You have **3 options** to set up Jeremy's account. Choose based on your current environment:

### Option 1: TypeScript Script (Recommended)

**Prerequisites:**
- PostgreSQL database running
- Prisma client generated
- Node.js & npm installed

**Steps:**

```bash
# 1. Install dependencies if needed
cd apps/api
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run the setup script
cd ../../
npx ts-node scripts/setup-beta-user.ts
```

The script will:
- ✅ Create user account for info@streamer.co.uk
- ✅ Create artist profile for "Streamer" band
- ✅ Set up 60-day beta subscription (£0/month)
- ✅ Generate temporary password: `Streamer2024!BetaAccess`
- ✅ Display all account details

**Output:**
```
✅ Beta user created successfully!

📊 User Details:
   Email: info@streamer.co.uk
   Name: Jeremy Garrett-Cox
   Role: ARTIST
   Beta Expires: [60 days from now]

🎸 Artist Profile:
   Band Name: Streamer
   Genre: Rock

💳 Subscription:
   Tier: ARTIST
   Status: ACTIVE
   Monthly Price: £0
   Expires: [60 days from now]

🔐 Temporary Password: Streamer2024!BetaAccess
```

---

### Option 2: SQL Script (If TypeScript Issues)

**Prerequisites:**
- PostgreSQL database access
- psql command-line tool

**Steps:**

```bash
# 1. Generate password hash first
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Streamer2024!BetaAccess', 10).then(hash => console.log(hash));"

# 2. Copy the hash output

# 3. Edit the SQL script
nano scripts/setup-beta-user.sql
# Replace '$2a$10$YourHashedPasswordHere' with your generated hash

# 4. Run the SQL script
psql -d total_audio_promo -f scripts/setup-beta-user.sql
```

---

### Option 3: Manual Database Entry

**If you prefer GUI tools (pgAdmin, TablePlus, etc.):**

1. **Create User Record:**
```sql
INSERT INTO users (id, email, name, "passwordHash", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'info@streamer.co.uk',
  'Jeremy Garrett-Cox',
  '[BCRYPT_HASH_HERE]',
  'ARTIST',
  NOW(),
  NOW()
);
```

2. **Create Artist Profile:**
```sql
INSERT INTO artists (id, name, email, "userId", genre, "websiteUrl", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Streamer',
  'info@streamer.co.uk',
  u.id,
  'Rock',
  'https://streamer.co.uk',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'info@streamer.co.uk';
```

3. **Create Beta Subscription:**
```sql
INSERT INTO subscriptions (id, "userId", tier, status, "monthlyPrice", "setupFee", "currentPeriodEnd", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  u.id,
  'ARTIST',
  'ACTIVE',
  0.00,
  0.00,
  NOW() + INTERVAL '60 days',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'info@streamer.co.uk';
```

---

## 📧 Send Welcome Email

After creating the account, send the welcome email:

### Using Resend API

```bash
# Set your Resend API key
export RESEND_API_KEY="your-resend-api-key"

# Run the email script
npx ts-node scripts/send-welcome-email.ts info@streamer.co.uk
```

### Manual Email (If Script Fails)

**To:** info@streamer.co.uk
**From:** chris@totalaudiopromo.com
**Subject:** 🎵 Welcome to Total Audio Promo Beta Access!

**Body:** See `scripts/send-welcome-email.ts` for the full HTML template

**Key Information to Include:**
- Login credentials:
  - Email: info@streamer.co.uk
  - Password: Streamer2024!BetaAccess
- Access URLs:
  - Audio Intel: https://intel.totalaudiopromo.com
  - Command Centre: https://command.totalaudiopromo.com
- Beta period: 60 days
- Support: chris@totalaudiopromo.com

---

## 🔐 Login Credentials Summary

| Field | Value |
|-------|-------|
| **Email** | info@streamer.co.uk |
| **Temporary Password** | Streamer2024!BetaAccess |
| **Role** | ARTIST |
| **Band Name** | Streamer |
| **Beta Period** | 60 days |
| **Monthly Cost** | £0 (Free during beta) |
| **Must Change Password** | ✅ Yes, on first login |

---

## 🌐 App Access Configuration

### Audio Intel (intel.totalaudiopromo.com)
- **Status:** ✅ DEPLOYED & READY
- **Feature Access:**
  - ✅ Unlimited contact enrichment during beta
  - ✅ CSV/Excel export functionality
  - ✅ AI-powered contact intelligence
  - ✅ Batch processing
  - ✅ Multi-platform search (Reddit, Instagram, Spotify, etc.)
  - ✅ Email validation

### Campaign Tracker (tracker.totalaudiopromo.com)
- **Status:** ⏳ TO BE DEPLOYED
- **Feature Access:**
  - ✅ Campaign creation & management
  - ✅ Contact tracking
  - ✅ Real-time analytics
  - ✅ Progress monitoring
  - ✅ ROI tracking
  - ✅ Export & reporting

### Pitch Generator (pitch.totalaudiopromo.com)
- **Status:** ⏳ TO BE DEPLOYED
- **Feature Access:**
  - ✅ AI-powered pitch generation
  - ✅ Custom voice profiles
  - ✅ Template library
  - ✅ Batch pitch creation
  - ✅ Contact personalization
  - ✅ Style customization

**Note:** All apps share the same authentication. Jeremy logs in once at any app and can access all three seamlessly via single sign-on (SSO).

---

## 📊 Beta User Tracking

### Automatic Tracking (To Be Configured in Tracker App)

Once the Campaign Tracker is deployed, it will have beta tracking endpoints:
- `GET /api/beta-tracker` - View all beta users
- `POST /api/beta-tracker` - Log user activity

### What Gets Tracked:
- ✅ Login/logout events
- ✅ Features used
- ✅ Contacts enriched
- ✅ Pitches generated
- ✅ Campaigns created
- ✅ Exports generated
- ✅ Time spent in apps
- ✅ Last seen timestamp

### Viewing Jeremy's Usage

```bash
# Option 1: View in Campaign Tracker dashboard (once deployed)
# Navigate to: https://tracker.totalaudiopromo.com/admin/beta-users

# Option 2: Query API directly
curl https://tracker.totalaudiopromo.com/api/beta-tracker
```

---

## 🔔 Automated Notifications

### Email Triggers (To Implement)

1. **Welcome Email** ✅ (Send immediately after setup)
   - Login credentials
   - Getting started guide
   - Quick start tips

2. **Day 7 - No Login Alert** (If Jeremy hasn't logged in)
   - Check-in email
   - Offer help/demo
   - Troubleshooting tips

3. **Day 30 - Feedback Request**
   - How's it going?
   - What features are most useful?
   - What's missing?

4. **Day 53 - Beta Expiry Warning** (7 days before expiry)
   - Beta ending soon
   - Conversion offer
   - Upgrade options

5. **Day 60 - Beta Expired**
   - Thank you for testing
   - Upgrade to paid plan
   - Special beta tester pricing

### ConvertKit Integration

```bash
# Add Jeremy to ConvertKit with beta-user tag
curl -X POST https://api.convertkit.com/v3/forms/[FORM_ID]/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "[YOUR_API_KEY]",
    "email": "info@streamer.co.uk",
    "first_name": "Jeremy",
    "fields": {
      "band_name": "Streamer",
      "beta_start_date": "[TODAY]",
      "beta_end_date": "[TODAY + 60 DAYS]"
    },
    "tags": ["beta-user", "artist", "streamer-band"]
  }'
```

---

## 🧪 Testing Jeremy's Access

### Checklist

1. **Database Verification:**
```sql
SELECT
  u.email,
  u.name,
  u.role,
  a.name AS band_name,
  s.tier,
  s.status,
  s."currentPeriodEnd" AS beta_expires
FROM users u
LEFT JOIN artists a ON a."userId" = u.id
LEFT JOIN subscriptions s ON s."userId" = u.id
WHERE u.email = 'info@streamer.co.uk';
```

2. **Login Test:**
```bash
# Test login API
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "info@streamer.co.uk",
    "password": "Streamer2024!BetaAccess"
  }'
```

Expected response:
```json
{
  "success": true,
  "token": "[JWT_TOKEN]",
  "user": {
    "id": "[USER_ID]",
    "email": "info@streamer.co.uk",
    "name": "Jeremy Garrett-Cox",
    "role": "ARTIST",
    "subscription": {
      "tier": "ARTIST",
      "status": "ACTIVE",
      "expiresAt": "[60_DAYS_FROM_NOW]"
    },
    "artists": [
      {
        "id": "[ARTIST_ID]",
        "name": "Streamer",
        "genre": "Rock"
      }
    ]
  }
}
```

3. **Access Test:**
- [ ] Can log in to Audio Intel
- [ ] Can log in to Command Centre
- [ ] Can enrich contacts
- [ ] Can export data
- [ ] Can view analytics

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials" on login

**Solution:**
```bash
# Verify user exists
psql -d total_audio_promo -c "SELECT email, name FROM users WHERE email = 'info@streamer.co.uk';"

# Reset password if needed
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Streamer2024!BetaAccess', 10).then(hash => console.log(hash));"
# Then update in database
```

### Issue: "Subscription expired" error

**Solution:**
```sql
-- Check subscription status
SELECT status, "currentPeriodEnd" FROM subscriptions WHERE "userId" IN (
  SELECT id FROM users WHERE email = 'info@streamer.co.uk'
);

-- Extend beta period if needed
UPDATE subscriptions
SET "currentPeriodEnd" = NOW() + INTERVAL '60 days',
    status = 'ACTIVE'
WHERE "userId" IN (SELECT id FROM users WHERE email = 'info@streamer.co.uk');
```

### Issue: Database connection errors

**Solution:**
```bash
# Check DATABASE_URL environment variable
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Regenerate Prisma client
cd apps/api
npx prisma generate
```

---

## 📝 Next Steps After Setup

### Immediate (Today):
1. ✅ Run setup script to create Jeremy's account
2. ✅ Send welcome email with login credentials
3. ✅ Add to ConvertKit with "beta-user" tag
4. ✅ Send Slack/Discord notification to team

### Week 1:
1. Monitor his first login
2. Check which features he uses most
3. Follow up if no activity after 7 days
4. Offer demo/onboarding call

### Week 4:
1. Request feedback via email
2. Schedule feedback call
3. Ask about workflow integration
4. Gather feature requests

### Week 8 (Days 53-60):
1. Send beta expiry warning
2. Offer conversion discount
3. Prepare upgrade path
4. Thank for participation

---

## 💰 Conversion Strategy

### Beta User Pricing (Special Offer)

**Artist Plan:**
- Regular: £45/month + £200 setup
- **Beta Tester Discount:** £35/month + £0 setup (first year)
- Savings: £320 in first year

**Why Jeremy Should Convert:**
- He's already familiar with the tools
- His workflows are established
- Real campaigns are being tracked
- Time-saving benefits proven

---

## 📞 Support & Questions

**Primary Contact:**
- Chris Schofield
- Email: chris@totalaudiopromo.com
- Response time: Within 2 hours

**Technical Issues:**
- Check this guide first
- Review troubleshooting section
- Contact Chris with specific error messages

**Feedback & Feature Requests:**
- Direct email to Chris
- Discord/Slack channel (if available)
- In-app feedback button

---

## 🎯 Success Metrics

Track these KPIs for Jeremy's beta test:

### Engagement Metrics:
- [ ] Days until first login
- [ ] Number of logins per week
- [ ] Total time spent in apps
- [ ] Features used most frequently

### Usage Metrics:
- [ ] Contacts enriched
- [ ] Exports generated
- [ ] Pitches created
- [ ] Campaigns tracked

### Feedback Metrics:
- [ ] Response to feedback requests
- [ ] Feature requests submitted
- [ ] Bug reports filed
- [ ] Overall satisfaction rating

### Conversion Metrics:
- [ ] Engages with expiry warning
- [ ] Requests pricing info
- [ ] Converts to paid plan
- [ ] Refers other artists

---

## 🔄 Template for Future Beta Users

This setup process can be replicated for additional beta users:

1. **Copy the TypeScript script**
2. **Update user data:**
```typescript
const NEW_BETA_USER: BetaUserData = {
  name: '[Full Name]',
  email: '[email@domain.com]',
  password: '[SecurePassword123!]',
  role: UserRole.ARTIST, // or AGENCY
  betaExpiryDays: 60,
  bandName: '[Band/Company Name]',
  artistProfile: {
    genre: '[Genre]',
    websiteUrl: '[URL]'
  }
};
```
3. **Run setup script**
4. **Send welcome email**
5. **Add to tracking systems**

---

## ✅ Setup Completion Checklist

- [ ] Database user created (info@streamer.co.uk)
- [ ] Artist profile created (Streamer)
- [ ] Beta subscription active (60 days, £0/month)
- [ ] Welcome email sent
- [ ] ConvertKit tag added
- [ ] Team notified
- [ ] Login tested successfully
- [ ] All app access verified
- [ ] Tracking configured
- [ ] Support contact shared

---

**Last Updated:** November 7, 2025
**Setup Guide Version:** 1.0
**For Questions:** chris@totalaudiopromo.com

---

## Quick Reference

**Login URLs:**
- Audio Intel: https://intel.totalaudiopromo.com
- Campaign Tracker: https://tracker.totalaudiopromo.com (once deployed)
- Pitch Generator: https://pitch.totalaudiopromo.com (once deployed)

**Email:** info@streamer.co.uk
**Password:** Streamer2024!BetaAccess (must change on first login)
**Beta Expires:** 60 days from setup date
**Support:** chris@totalaudiopromo.com
