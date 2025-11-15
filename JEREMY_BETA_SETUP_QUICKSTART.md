# Jeremy's Beta Setup - Quick Start

Quick reference for setting up Jeremy's beta access to Total Audio Promo.

## 🚀 Quick Setup (3 Steps)

### 1. Create Account

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
cd apps/api && npm install && npx prisma generate && cd ../..
npx ts-node scripts/setup-beta-user.ts
```

### 2. Send Welcome Email

```bash
export RESEND_API_KEY="your-resend-api-key"
npx ts-node scripts/send-welcome-email.ts info@streamer.co.uk
```

### 3. Add to ConvertKit (Optional)

- Email: `info@streamer.co.uk`
- Tags: `beta-user`, `artist`, `streamer-band`

## 📋 Account Details

| Field       | Value                   |
| ----------- | ----------------------- |
| Email       | info@streamer.co.uk     |
| Password    | Streamer2024!BetaAccess |
| Role        | ARTIST                  |
| Beta Period | 60 days                 |
| Cost        | £0/month                |

## 🔗 App URLs

- **Audio Intel:** https://intel.totalaudiopromo.com ✅ LIVE
- **Campaign Tracker:** https://tracker.totalaudiopromo.com ⏳ Coming soon
- **Pitch Generator:** https://pitch.totalaudiopromo.com ⏳ Coming soon

## ✅ Verification

After setup, verify login works:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info@streamer.co.uk","password":"Streamer2024!BetaAccess"}'
```

Should return JWT token and user data with subscription info.

## 🔧 Troubleshooting

**User exists?** Script handles it - safe to re-run.

**Email fails?** Check `RESEND_API_KEY` is set.

**Database error?** Verify `DATABASE_URL` in `.env.local`.

---

**Full Guide:** See `BETA_USER_SETUP_GUIDE.md` for detailed instructions.
