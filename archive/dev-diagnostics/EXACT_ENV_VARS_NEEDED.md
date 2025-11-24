# EXACT Environment Variables Required for Golden Deployment

## Critical Issue: Missing Environment Variables in Promote Step

**Problem**: The promote step in `golden-deploy.yml` is MISSING the other 4 Vercel project IDs!

Current state (WRONG):

```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }} # ❌ ONLY audio-intel!
  TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
  TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

Required state (CORRECT):

```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  VERCEL_PROJECT_ID_TRACKER: ${{ secrets.VERCEL_PROJECT_ID_TRACKER }}
  VERCEL_PROJECT_ID_PITCH_GENERATOR: ${{ secrets.VERCEL_PROJECT_ID_PITCH_GENERATOR }}
  VERCEL_PROJECT_ID_COMMAND_CENTRE: ${{ secrets.VERCEL_PROJECT_ID_COMMAND_CENTRE }}
  VERCEL_PROJECT_ID_WEB: ${{ secrets.VERCEL_PROJECT_ID_WEB }}
  TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
  TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

---

## GitHub Secrets (Repository Settings → Secrets and Variables → Actions)

### Build-Time Secrets (Used by GitHub Actions)

These are needed for the **BUILD** step in GitHub Actions:

```
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

### Promotion Secrets (Used by Promotion Script)

These are needed for the **PROMOTE** step to push to Vercel production:

```
VERCEL_TOKEN=[your-vercel-token]
VERCEL_ORG_ID=team_YkDxhZ9BKq4kDxzxZGjQWlQR

# Project IDs for each app
VERCEL_PROJECT_ID=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60              # audio-intel
VERCEL_PROJECT_ID_TRACKER=prj_uiEWXtOUY3d9ly8JureSAcSXaoRd       # tracker
VERCEL_PROJECT_ID_PITCH_GENERATOR=prj_3EJMQY0EfED1fFosCyOmJwmH4Unf  # pitch-generator
VERCEL_PROJECT_ID_COMMAND_CENTRE=prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9   # command-centre
VERCEL_PROJECT_ID_WEB=prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C              # web
```

### Notification Secrets (Optional)

```
TELEGRAM_BOT_TOKEN=[your-bot-token]
TELEGRAM_CHAT_ID=[your-chat-id]
```

---

## Vercel Environment Variables (Per Project Settings → Environment Variables)

### For Each Vercel Project: audio-intel, tracker, pitch-generator, command-centre, web

**IMPORTANT**: Set these variables in EACH individual Vercel project, not just one!

#### Core Supabase (REQUIRED FOR ALL APPS)

```
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

**Environments**: Production, Preview, Development (check all 3)

---

### App-Specific Variables

#### 1. audio-intel (prj_3rSBMs1gaZj8uSg2XyCW31tzeF60)

```
# Supabase (already listed above - REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Stripe (payment processing)
STRIPE_SECRET_KEY=[your-stripe-secret]
STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]
STRIPE_WEBHOOK_SECRET=[your-webhook-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]

# Anthropic (contact enrichment)
ANTHROPIC_API_KEY=[your-anthropic-key]

# Auth
NEXTAUTH_URL=https://intel.totalaudiopromo.com
NEXTAUTH_SECRET=[your-nextauth-secret]

# App
NEXT_PUBLIC_BASE_URL=https://intel.totalaudiopromo.com
NODE_ENV=production

# Optional
CRON_SECRET=[random-secret]
BLUESKY_IDENTIFIER=[your-handle].bsky.social
BLUESKY_APP_PASSWORD=[your-app-password]
```

#### 2. tracker (prj_uiEWXtOUY3d9ly8JureSAcSXaoRd)

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Stripe (optional for tracker)
STRIPE_SECRET_KEY=[your-stripe-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]

# Anthropic (AI features)
ANTHROPIC_API_KEY=[your-anthropic-key]

# App URLs
NEXT_PUBLIC_APP_URL=https://tracker.totalaudiopromo.com
NEXT_PUBLIC_BASE_URL=https://tracker.totalaudiopromo.com

# Google OAuth (for Sheets/Gmail integrations)
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=[your-google-client-id]
GOOGLE_SHEETS_CLIENT_SECRET=[your-google-secret]
NEXT_PUBLIC_GMAIL_CLIENT_ID=[your-google-client-id]
GMAIL_CLIENT_SECRET=[your-google-secret]

# Airtable OAuth
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=[your-airtable-client-id]
AIRTABLE_CLIENT_SECRET=[your-airtable-secret]

# Mailchimp OAuth
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=[your-mailchimp-client-id]
MAILCHIMP_CLIENT_SECRET=[your-mailchimp-secret]

# Cron
CRON_SECRET=[random-secret]
```

#### 3. pitch-generator (prj_3EJMQY0EfED1fFosCyOmJwmH4Unf)

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Auth
NEXTAUTH_SECRET=[your-nextauth-secret]
NEXTAUTH_URL=https://pitch.totalaudiopromo.com

# App
NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com

# Anthropic (REQUIRED for pitch generation)
ANTHROPIC_API_KEY=[your-anthropic-key]

# Stripe (billing)
STRIPE_SECRET_KEY=[your-stripe-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]
STRIPE_PRICE_PROFESSIONAL_MONTHLY=[price-id]
STRIPE_PRICE_PROFESSIONAL_ANNUAL=[price-id]
STRIPE_PRICE_AGENCY_MONTHLY=[price-id]
STRIPE_PRICE_AGENCY_ANNUAL=[price-id]

# Google OAuth
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-secret]

# Demo credentials (optional)
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast
```

#### 4. command-centre (prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9)

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Social Media APIs
BLUESKY_IDENTIFIER=[your-handle].bsky.social
BLUESKY_APP_PASSWORD=[your-app-password]
LINKEDIN_ACCESS_TOKEN=[your-linkedin-token]
FACEBOOK_PAGE_ACCESS_TOKEN=[your-facebook-token]
FACEBOOK_PAGE_ID=[your-page-id]

# App URLs
COMMAND_CENTRE_URL=https://command.totalaudiopromo.com
AUDIO_INTEL_API_URL=https://intel.totalaudiopromo.com
```

#### 5. web (prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C)

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# App URL
NEXT_PUBLIC_BASE_URL=https://totalaudiopromo.com
```

---

## Quick Checklist

### GitHub Secrets ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] VERCEL_TOKEN
- [ ] VERCEL_ORG_ID
- [ ] VERCEL_PROJECT_ID (audio-intel)
- [ ] VERCEL_PROJECT_ID_TRACKER
- [ ] VERCEL_PROJECT_ID_PITCH_GENERATOR
- [ ] VERCEL_PROJECT_ID_COMMAND_CENTRE
- [ ] VERCEL_PROJECT_ID_WEB
- [ ] TELEGRAM_BOT_TOKEN (optional)
- [ ] TELEGRAM_CHAT_ID (optional)

### Vercel: audio-intel ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL (all 3 environments)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (all 3 environments)
- [ ] SUPABASE_SERVICE_ROLE_KEY (all 3 environments)
- [ ] STRIPE_SECRET_KEY
- [ ] ANTHROPIC_API_KEY
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXT_PUBLIC_BASE_URL

### Vercel: tracker ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL (all 3 environments)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (all 3 environments)
- [ ] SUPABASE_SERVICE_ROLE_KEY (all 3 environments)
- [ ] ANTHROPIC_API_KEY
- [ ] NEXT_PUBLIC_APP_URL
- [ ] Google OAuth vars (if using integrations)

### Vercel: pitch-generator ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL (all 3 environments)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (all 3 environments)
- [ ] SUPABASE_SERVICE_ROLE_KEY (all 3 environments)
- [ ] ANTHROPIC_API_KEY
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] NEXT_PUBLIC_BASE_URL

### Vercel: command-centre ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL (all 3 environments)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (all 3 environments)
- [ ] SUPABASE_SERVICE_ROLE_KEY (all 3 environments)
- [ ] Social media API tokens (BlueSky, LinkedIn, etc.)

### Vercel: web ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL (all 3 environments)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (all 3 environments)
- [ ] SUPABASE_SERVICE_ROLE_KEY (all 3 environments)
- [ ] NEXT_PUBLIC_BASE_URL

---

## Common Mistakes to Avoid

1. ❌ **Only setting env vars in audio-intel Vercel project**
   - ✅ Set Supabase vars in ALL 5 Vercel projects

2. ❌ **Only checking "Production" environment in Vercel**
   - ✅ Check Production, Preview, AND Development for all Supabase vars

3. ❌ **Missing VERCEL*PROJECT_ID*\* secrets in GitHub**
   - ✅ Add all 5 project IDs to GitHub Secrets

4. ❌ **Forgetting to update golden-deploy.yml promote step**
   - ✅ Pass all 5 VERCEL*PROJECT_ID*\* vars to promotion script

---

## Next Steps

1. **Fix golden-deploy.yml** - Add missing VERCEL*PROJECT_ID*\* vars to promote step
2. **Verify GitHub Secrets** - Check all 12 secrets are present
3. **Verify Vercel Projects** - Each of 5 projects has Supabase vars in all 3 environments
4. **Deploy** - Create new v2.5.4-golden tag to test
