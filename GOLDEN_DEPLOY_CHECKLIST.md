# Golden Deploy Environment Variables Checklist

## WHAT I JUST FIXED

**Critical Issue**: The promote step in `.github/workflows/golden-deploy.yml` was **ONLY passing 1 of 5 required Vercel project IDs**.

**Fix Applied** (commit dfd4a63):

- Added `VERCEL_PROJECT_ID_TRACKER`
- Added `VERCEL_PROJECT_ID_PITCH_GENERATOR`
- Added `VERCEL_PROJECT_ID_COMMAND_CENTRE`
- Added `VERCEL_PROJECT_ID_WEB`

This is why the promotion step was failing - `golden-promote.ts` needs all 5 project IDs but was only receiving audio-intel's!

---

## EXACT STEPS YOU NEED TO COMPLETE NOW

### Step 1: Verify GitHub Secrets (Repository Settings → Secrets and Variables → Actions)

Go to: https://github.com/totalaudiopromo/total-audio-platform/settings/secrets/actions

**Check these 12 secrets exist:**

#### Build Secrets (GitHub Actions needs these)

```text
 NEXT_PUBLIC_SUPABASE_URL
 NEXT_PUBLIC_SUPABASE_ANON_KEY
 SUPABASE_SERVICE_ROLE_KEY
```

#### Vercel Promotion Secrets (golden-promote.ts needs these)

```text
 VERCEL_TOKEN
 VERCEL_ORG_ID
 VERCEL_PROJECT_ID                    # audio-intel
 VERCEL_PROJECT_ID_TRACKER            # tracker
 VERCEL_PROJECT_ID_PITCH_GENERATOR    # pitch-generator
 VERCEL_PROJECT_ID_COMMAND_CENTRE     # command-centre
 VERCEL_PROJECT_ID_WEB                # web
```

#### Notification Secrets (optional)

```text
 TELEGRAM_BOT_TOKEN
 TELEGRAM_CHAT_ID
```

**Values for the VERCEL*PROJECT_ID*\* secrets:**

```bash
VERCEL_PROJECT_ID=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PROJECT_ID_TRACKER=prj_uiEWXtOUY3d9ly8JureSAcSXaoRd
VERCEL_PROJECT_ID_PITCH_GENERATOR=prj_3EJMQY0EfED1fFosCyOmJwmH4Unf
VERCEL_PROJECT_ID_COMMAND_CENTRE=prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9
VERCEL_PROJECT_ID_WEB=prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C
```

---

### Step 2: Verify Vercel Environment Variables (EACH PROJECT SEPARATELY)

**CRITICAL**: You must set these in **EACH of the 5 Vercel projects**, not just audio-intel!

#### For ALL 5 Projects (audio-intel, tracker, pitch-generator, command-centre, web)

Go to each project's settings:

- https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings/environment-variables
- https://vercel.com/chris-projects-6ffe0e29/tracker/settings/environment-variables
- https://vercel.com/chris-projects-6ffe0e29/pitch-generator/settings/environment-variables
- https://vercel.com/chris-projects-6ffe0e29/command-centre/settings/environment-variables
- https://vercel.com/chris-projects-6ffe0e29/web/settings/environment-variables

**Add these 3 core variables to EACH project:**

```text
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://lbtazcdqirgvmhvtwrbc.supabase.co
Environments:  Production   Preview   Development
```

```text
Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [your-anon-key]
Environments:  Production   Preview   Development
```

```text
Variable Name: SUPABASE_SERVICE_ROLE_KEY
Value: [your-service-role-key]
Environments:  Production   Preview   Development
```

**IMPORTANT**: Check **ALL THREE** environment boxes (Production, Preview, Development) for each variable!

---

### Step 3: App-Specific Vercel Variables

#### audio-intel (prj_3rSBMs1gaZj8uSg2XyCW31tzeF60)

**Additional variables needed** (beyond the 3 Supabase vars above):

```
STRIPE_SECRET_KEY=[your-stripe-secret]
STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]
STRIPE_WEBHOOK_SECRET=[your-webhook-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]
ANTHROPIC_API_KEY=[your-anthropic-key]
NEXTAUTH_URL=https://intel.totalaudiopromo.com
NEXTAUTH_SECRET=[your-nextauth-secret]
NEXT_PUBLIC_BASE_URL=https://intel.totalaudiopromo.com
NODE_ENV=production
```

#### tracker (prj_uiEWXtOUY3d9ly8JureSAcSXaoRd)

**Additional variables needed:**

```
ANTHROPIC_API_KEY=[your-anthropic-key]
NEXT_PUBLIC_APP_URL=https://tracker.totalaudiopromo.com
NEXT_PUBLIC_BASE_URL=https://tracker.totalaudiopromo.com
```

**Optional** (if using integrations):

```
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=[your-google-client-id]
GOOGLE_SHEETS_CLIENT_SECRET=[your-google-secret]
```

#### pitch-generator (prj_3EJMQY0EfED1fFosCyOmJwmH4Unf)

**Additional variables needed:**

```
ANTHROPIC_API_KEY=[your-anthropic-key]
NEXTAUTH_SECRET=[your-nextauth-secret]
NEXTAUTH_URL=https://pitch.totalaudiopromo.com
NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com
STRIPE_SECRET_KEY=[your-stripe-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-pub-key]
```

#### command-centre (prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9)

**Additional variables needed:**

```
COMMAND_CENTRE_URL=https://command.totalaudiopromo.com
AUDIO_INTEL_API_URL=https://intel.totalaudiopromo.com
```

**Optional** (social media features):

```
BLUESKY_IDENTIFIER=[your-handle].bsky.social
BLUESKY_APP_PASSWORD=[your-app-password]
```

#### web (prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C)

**Additional variables needed:**

```
NEXT_PUBLIC_BASE_URL=https://totalaudiopromo.com
```

---

## QUICK VERIFICATION CHECKLIST

### GitHub Secrets 

- [ ] All 12 secrets present in repository settings
- [ ] VERCEL*PROJECT_ID*\* values match the project IDs above
- [ ] SUPABASE_SERVICE_ROLE_KEY is set (you just added this)

### Vercel: audio-intel 

- [ ] NEXT_PUBLIC_SUPABASE_URL (Production + Preview + Development)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Production + Preview + Development)
- [ ] SUPABASE_SERVICE_ROLE_KEY (Production + Preview + Development)
- [ ] STRIPE_SECRET_KEY
- [ ] ANTHROPIC_API_KEY
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET

### Vercel: tracker 

- [ ] NEXT_PUBLIC_SUPABASE_URL (Production + Preview + Development)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Production + Preview + Development)
- [ ] SUPABASE_SERVICE_ROLE_KEY (Production + Preview + Development)
- [ ] ANTHROPIC_API_KEY
- [ ] NEXT_PUBLIC_APP_URL

### Vercel: pitch-generator 

- [ ] NEXT_PUBLIC_SUPABASE_URL (Production + Preview + Development)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Production + Preview + Development)
- [ ] SUPABASE_SERVICE_ROLE_KEY (Production + Preview + Development)
- [ ] ANTHROPIC_API_KEY
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL

### Vercel: command-centre 

- [ ] NEXT_PUBLIC_SUPABASE_URL (Production + Preview + Development)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Production + Preview + Development)
- [ ] SUPABASE_SERVICE_ROLE_KEY (Production + Preview + Development)
- [ ] COMMAND_CENTRE_URL

### Vercel: web 

- [ ] NEXT_PUBLIC_SUPABASE_URL (Production + Preview + Development)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Production + Preview + Development)
- [ ] SUPABASE_SERVICE_ROLE_KEY (Production + Preview + Development)
- [ ] NEXT_PUBLIC_BASE_URL

---

## READY TO DEPLOY?

Once you've verified all the above, we can trigger v2.5.4-golden deployment:

```bash
git tag v2.5.4-golden
git push origin v2.5.4-golden
```

This will be attempt **#34** - with:

- All 5 VERCEL*PROJECT_ID*\* vars in workflow (JUST FIXED)
- All Supabase env vars in GitHub Secrets
- All Supabase env vars in each Vercel project (you're adding now)
- Package name mappings for web → total-audio-promo-frontend
- All 5 apps in build matrix

---

##  REFERENCE DOCUMENTS

- **EXACT_ENV_VARS_NEEDED.md** - Complete environment variable reference
- **reports/golden/final/verification-summary.md** - Infrastructure verification report
- **GOLDEN_DEPLOY_FINAL_FIX.md** - Root cause analysis from 32 failed attempts

---

##  COMMON ISSUES

### Issue: "Missing VERCEL_PROJECT_ID for tracker"

**Solution**: Add `VERCEL_PROJECT_ID_TRACKER` secret to GitHub repository secrets

### Issue: "Database query failed" in golden-check

**Solution**: Ensure SUPABASE_SERVICE_ROLE_KEY is set in **Vercel project settings** (not just GitHub Secrets)

### Issue: "Cannot read environment variable NEXT_PUBLIC_SUPABASE_URL"

**Solution**: Check you've ticked **all 3 environment boxes** in Vercel (Production, Preview, Development)

### Issue: Promotion step says "No preview deployment found"

**Solution**: This is expected on first run - the workflow creates preview deployments automatically

---

**Last Updated**: 2025-11-06 (Attempt #34 preparation)
**Status**: Workflow fixed, awaiting environment variable verification
**Next Step**: Complete Vercel env var checklist above, then deploy v2.5.4-golden
