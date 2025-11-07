# Quick Start: Set Up Jeremy's Beta Access

## TL;DR - Fastest Setup Path

### Step 1: Run the Setup Script (2 minutes)

```bash
# From project root
cd apps/api
npm install
npx prisma generate
cd ../../
npx ts-node scripts/setup-beta-user.ts
```

### Step 2: Send Welcome Email (1 minute)

```bash
# Set your Resend API key
export RESEND_API_KEY="your-resend-api-key"

# Send email
npx ts-node scripts/send-welcome-email.ts info@streamer.co.uk
```

### Step 3: Add to ConvertKit (1 minute)

Add Jeremy to your ConvertKit list with tag: `beta-user`

---

## What You Get

**Jeremy's Account:**
- Email: info@streamer.co.uk
- Password: Streamer2024!BetaAccess (temporary - must change on first login)
- Band: Streamer
- Role: ARTIST
- Beta Period: 60 days
- Cost: £0/month

**Access:**
- Audio Intel: https://intel.totalaudiopromo.com
- Command Centre: https://command.totalaudiopromo.com
- Pitch Generator: [URL TBD]

**Features:**
- ✅ Unlimited contact enrichment
- ✅ Unlimited pitch generation
- ✅ CSV/Excel exports
- ✅ Campaign tracking
- ✅ Real-time analytics

---

## Alternative: SQL Setup (If TypeScript Has Issues)

```bash
# 1. Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Streamer2024!BetaAccess', 10).then(hash => console.log(hash));"

# 2. Edit SQL script with the hash
nano scripts/setup-beta-user.sql

# 3. Run SQL script
psql -d total_audio_promo -f scripts/setup-beta-user.sql
```

---

## Test Jeremy's Access

```bash
# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "info@streamer.co.uk",
    "password": "Streamer2024!BetaAccess"
  }'
```

Should return:
```json
{
  "success": true,
  "token": "[JWT_TOKEN]",
  "user": {
    "email": "info@streamer.co.uk",
    "name": "Jeremy Garrett-Cox",
    "role": "ARTIST"
  }
}
```

---

## Tracking Jeremy's Usage

View in Command Centre:
```
https://command.totalaudiopromo.com/beta-tracking
```

Or query API:
```bash
curl https://command.totalaudiopromo.com/api/beta-tracker
```

---

## Files Created

1. `scripts/setup-beta-user.ts` - TypeScript setup script
2. `scripts/setup-beta-user.sql` - SQL alternative script
3. `scripts/send-welcome-email.ts` - Email sender
4. `BETA_USER_SETUP_GUIDE.md` - Comprehensive guide
5. `apps/api/src/routes/auth.ts` - Updated auth routes (UPDATED)

---

## Next Steps

1. ✅ Run setup script
2. ✅ Send welcome email
3. ✅ Add to ConvertKit
4. ✅ Monitor first login
5. ✅ Follow up after 7 days if no activity
6. ✅ Request feedback after 30 days
7. ✅ Conversion offer 7 days before expiry

---

## Support

Questions? chris@totalaudiopromo.com

Full documentation: See `BETA_USER_SETUP_GUIDE.md`

---

**Ready to send Jeremy access today!**
