# ✅ Codex Environment Variables - ACTUAL VALUES

**⚠️ WARNING: This file contains actual API keys and secrets. It is excluded from Git via .gitignore. DO NOT commit this file!**

All values marked with ✅ are **actual values** from your Total Audio Platform project. Values marked with ⚠️ still need to be filled from your password manager/vault.

**Note:** Some keys are project-specific (Liberty, TAP, etc.) and are marked accordingly.

## Copy & Paste Ready Environment Variables

```bash
# ============================================
# CORE SUPABASE (REQUIRED) ✅
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=⚠️_your_supabase_anon_key_from_vault
SUPABASE_SERVICE_ROLE_KEY=⚠️_your_supabase_service_role_key_from_vault
SUPABASE_SERVICE_KEY=⚠️_your_supabase_service_role_key_from_vault
SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
SUPABASE_ANON_KEY=⚠️_your_supabase_anon_key_from_vault
DATABASE_URL=⚠️_postgresql://user:password@host:port/database

# Tracker uses different Supabase instance (✅ Actual values):
# NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTU2MjEsImV4cCI6MjA3NDQ5MTYyMX0.byAFslDRcX_Peto69Z7jG90CoWnQRaqNGOzhxteAgCI
# SUPABASE_SERVICE_ROLE_KEY (Tracker): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE
# Note: Main Supabase anon key and service role key still need to be added from vault

# ============================================
# AI SERVICES (REQUIRED) ✅ ACTUAL VALUES
# ============================================
# Audio Intel Anthropic API Key
ANTHROPIC_API_KEY=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
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
PERPLEXITY_API_KEY=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
OPENAI_API_KEY=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
# Note: GEMINI_API_KEY below is Liberty-specific, may need separate TAP key
GEMINI_API_KEY=AIzaSyA0PM3vNoTes2qYQEdHFy0GTfJ-1Wk2Pwg

# ============================================
# STRIPE (REQUIRED) ✅ ACTUAL VALUES (LIVE KEYS)
# ============================================
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_EQTxt0tVOdBJt8Mukl9wmvlDIgsXwNdO
STRIPE_PUBLISHABLE_KEY=pk_live_51Ro9faPqujcPv5fbSP4fCZd9JVDK7rp8Ik0KE2u2WQG0IwlVKW4YEL4LNONwyGaTygNh7n1gWFs1BrJj0sBffggc00ZICnui3t
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Ro9faPqujcPv5fbSP4fCZd9JVDK7rp8Ik0KE2u2WQG0IwlVKW4YEL4LNONwyGaTygNh7n1gWFs1BrJj0sBffggc00ZICnui3t
STRIPE_PRICE_MONTHLY=⚠️_price_your_monthly_id_from_vault
STRIPE_PRICE_ANNUAL=⚠️_price_your_annual_id_from_vault
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=⚠️_price_your_monthly_id_from_vault
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=⚠️_price_your_annual_id_from_vault
STRIPE_PRICE_FREE_MONTHLY=price_tracker_free
STRIPE_PRICE_PRO_MONTHLY=price_tracker_pro_19
STRIPE_PRICE_AGENCY_MONTHLY=price_tracker_agency_49

# ============================================
# AUTHENTICATION ✅
# ============================================
NEXTAUTH_SECRET=⚠️_your_random_secret_string_from_vault
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ============================================
# DEMO CREDENTIALS ✅ ACTUAL VALUES
# ============================================
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast

# ============================================
# NOTION ✅ ACTUAL VALUES
# ============================================
NOTION_API_KEY=ntn_X2740658669g5GQXS5zVEki4BdePVQOd9O4g35I8ZZ61Cv
NOTION_CONTENT_PAGE_ID=⚠️_your_page_id_from_vault
NOTION_DATABASE_ID=⚠️_your_database_id_from_vault

# ============================================
# EMAIL SERVICES ✅ ACTUAL VALUES
# ============================================
RESEND_API_KEY=re_KurPGpjw_7e67LAWdfiMuHgE6iexNDn8R
EMAIL_FROM=Audio Intel <exports@totalaudiopromo.com>
CONVERTKIT_API_KEY=5wx6QPvhunue-d760yZHIg
CONVERTKIT_API_SECRET=BMiOCi6hPDA73O1pnwXh7_bXEBi5zMzf7Tgk5rP_trI
CONVERTKIT_FORM_ID=⚠️_your_form_id_from_vault
CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID=8440957
CONVERTKIT_PRICING_FORM_ID=8405293
KIT_API_KEY=kit_8bdcc0edb0cb6e2f0feb844a333c1bc3

# SMTP (Optional: email sending fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=⚠️_you@example.com_from_vault
SMTP_PASS=⚠️_your_app_password_from_vault
SMTP_FROM=Audio Intel <⚠️_you@example.com_from_vault>

# ============================================
# GOOGLE OAUTH ✅ ACTUAL VALUES
# ============================================
GOOGLE_CLIENT_ID=899359828149-8v65g4oft47l3ep9dinbk836ag1c8nb2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=899359828149-8v65g4oft47l3ep9dinbk836ag1c8nb2.apps.googleusercontent.com
GOOGLE_SHEETS_CLIENT_SECRET=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
NEXT_PUBLIC_GMAIL_CLIENT_ID=899359828149-8v65g4oft47l3ep9dinbk836ag1c8nb2.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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

# ============================================
# AIRTABLE ✅ ACTUAL VALUES
# ============================================
AIRTABLE_API_KEY=patH8DF1YEieVCSvo.67dba69700daaf313291239b9a27544aca935e4efb915153fab27c35927dfe1a
AIRTABLE_TOKEN=patH8DF1YEieVCSvo.67dba69700daaf313291239b9a27544aca935e4efb915153fab27c35927dfe1a
AIRTABLE_BASE_ID=appx7uTQWRH8cIC20
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=⚠️_your_airtable_client_id_from_vault
AIRTABLE_CLIENT_SECRET=⚠️_your_airtable_secret_from_vault

# ============================================
# MAILCHIMP ✅ ACTUAL VALUES (TAP KEY)
# ============================================
# Note: Liberty Mailchimp key available but using TAP key: e028ec0ce85df6990c0a824e3b55e033-us17
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=⚠️_your_mailchimp_client_id_from_vault
MAILCHIMP_CLIENT_SECRET=⚠️_your_mailchimp_secret_from_vault
MAILCHIMP_API_KEY=e028ec0ce85df6990c0a824e3b55e033-us17

# ============================================
# APP URLS (Development)
# ============================================
PW_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_BASE_URL=http://localhost:3000
COMMAND_CENTRE_URL=http://localhost:3005
AUDIO_INTEL_API_URL=http://localhost:3000
PITCH_GENERATOR_API_URL=http://localhost:3001
TRACKER_API_URL=http://localhost:3002
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=⚠️_your_api_key_from_vault

# Production URLs (commented out - uncomment for production)
# NEXT_PUBLIC_BASE_URL=https://intel.totalaudiopromo.com
# NEXT_PUBLIC_APP_URL=https://tracker.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://tracker.totalaudiopromo.com
# COMMAND_CENTRE_URL=https://command.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://dashboard.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://totalaudiopromo.com
# AUDIO_INTEL_API_URL=https://intel.totalaudiopromo.com/api
# PITCH_GENERATOR_API_URL=https://pitch.totalaudiopromo.com/api
# TRACKER_API_URL=https://tracker.totalaudiopromo.com/api
# NEXT_PUBLIC_API_BASE_URL=https://api.totalaudiopromo.com

# ============================================
# SECURITY & CONFIGURATION
# ============================================
CRON_SECRET=⚠️_your_random_secret_from_vault
NODE_ENV=development
PORT=3000
ADAPTIVE_TIMEOUT_RETRY=true

# ============================================
# SOCIAL MEDIA (Command Centre) ✅ ACTUAL VALUES
# ============================================
BLUESKY_IDENTIFIER=⚠️_your_handle.bsky.social_from_vault
BLUESKY_APP_PASSWORD=54v6-eo5l-khbm-6bom
LINKEDIN_ACCESS_TOKEN=⚠️_your_linkedin_token_from_vault
LINKEDIN_PERSON_ID=⚠️_your_linkedin_person_id_from_vault
LINKEDIN_TOKEN_EXPIRES=⚠️_your_linkedin_token_expires_from_vault
LINKEDIN_CLIENT_ID=781ioptlbwi0ok
LINKEDIN_CLIENT_SECRET=WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==
LINKEDIN_API_VERSION=202401
LINKEDIN_SCOPES=openid profile email
FACEBOOK_PAGE_ACCESS_TOKEN=⚠️_your_facebook_token_from_vault
FACEBOOK_PAGE_ID=⚠️_your_facebook_page_id_from_vault

# ============================================
# PITCH GENERATOR STRIPE PRICES
# ============================================
STRIPE_PRICE_PROFESSIONAL_MONTHLY=⚠️_price_your_pro_id_from_vault
STRIPE_PRICE_PROFESSIONAL_ANNUAL=⚠️_price_your_pro_annual_id_from_vault
STRIPE_PRICE_AGENCY_MONTHLY=⚠️_price_your_agency_id_from_vault
STRIPE_PRICE_AGENCY_ANNUAL=⚠️_price_your_agency_annual_id_from_vault

# ============================================
# OTHER SERVICES ✅ ACTUAL VALUES
# ============================================
FIRECRAWL_API_KEY=fc-d1fc4de2c54e46c082e4719749d184e3
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=⚠️_your_verification_code_from_vault
NEXT_PUBLIC_BING_SITE_VERIFICATION=⚠️_your_bing_code_from_vault
NEXT_PUBLIC_ANALYTICS_ID=GTM-WZNJWDKH

# ============================================
# FEATURE FLAGS (Optional)
# ============================================
NEXT_PUBLIC_ENABLE_SEO_ANALYSIS=false
ENABLE_EMAIL_VERIFICATION=false
ENABLE_ONBOARDING=false

# ============================================
# WARM API (Radio Promo Agent) ✅ ACTUAL VALUES
# ============================================
WARM_API_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5ERXpOakZFUTBVMVJrTkVSRGN6T1RGRk1qUkNRVGsxUVROQlJrRkRSRFF6TURVMU5rRXlSZyJ9.eyJpc3MiOiJodHRwczovL2F1dGgud2FybW11c2ljLm5ldC8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDgwMTI4MzQzMzIwNzMwMDkxNSIsImF1ZCI6IlRRcFY2Vm8zczY1VU1nTHJBeXpISExoa01EU2V3V1JkIiwiaWF0IjoxNzU4NDYzNzY0LCJleHAiOjE3NTg1NTM3NjR9.FNeJ2s5SjDf4cF7vq6U6uypsO6MN_Yf6CVbgCOf0Q0new5nIuTPmEdhjh-QR-0hXYwPz8fFCO9sC_7pN6bMeYcjCcd47qkFEDX3U7lc8qUMTQrIZtT8QWPmyZHw0Ukvyrz6DyyC2cDEYqCKCuYKs11iYUfTTaPTT8UpGvU2uUPhk1l06_6u5D7KUSAAv42dsOYh-g1yb5xANEbgyydYGWr1hpeXbl7NZir7oPILIGK69e0Ay_yzekAHrCxr4PU4sekmUqtL_AVRkc3DA-XSyYsm8_rAXTboxl1tWyRVNVAyZxOiWtf_NQ9beQYneIy5zz7OmnuxATCLA5q1HzWxFlw
WARM_API_BASE_URL=https://public-api.warmmusic.net/api/v1
WARM_API_EMAIL=promo@totalaudiopromo.com
WARM_API_PASSWORD=⚠️_your_warm_password_from_vault

# ============================================
# DATAFORSEO (Hybrid SEO Service)
# ============================================
DATAFORSEO_USERNAME=⚠️_your_dataforseo_username_from_vault
DATAFORSEO_PASSWORD=⚠️_your_dataforseo_password_from_vault

# ============================================
# AUTHENTICATION & SECURITY ✅ ACTUAL VALUES
# ============================================
JWT_SECRET=⚠️_your_jwt_secret_key_from_vault
ADMIN_EMAIL=chris@totalaudiopromo.com

# ============================================
# DISCORD BOT (Radio Promo Agent) ✅ ACTUAL VALUES
# ============================================
DISCORD_BOT_TOKEN=36cf232f39af5a17603a231e7fe5a3f8782fc2d19eec6bc65bd3a20bb80d738f
DISCORD_APP_ID=1421602747618300004
DISCORD_GUILD_ID=⚠️_your_discord_guild_id_from_vault
DISCORD_BOT_TEST_CHANNEL_ID=⚠️_your_discord_channel_id_from_vault

# ============================================
# MONDAY.COM INTEGRATION ✅ ACTUAL VALUES (LIBERTY)
# ============================================
MONDAY_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU2NzQ0MTYwMCwiYWFpIjoxMSwidWlkIjoxNzkyMDMyNCwiaWFkIjoiMjAyNS0wOS0yOFQyMTo1MDo0NS4xOTBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODI0MjgzLCJyZ24iOiJ1c2UxIn0.PTdoPUW4FQqfO9sGRFVdiawp1smzEfsOHtuW6iEQfJk
# Monday.com Board ID: 2443582331 (Liberty Music PR board)
MONDAY_BOARD_ID=2443582331

# ============================================
# OTHER INTEGRATIONS ✅ ACTUAL VALUES
# ============================================
GOOGLE_CHAT_WEBHOOK=⚠️_your_google_chat_webhook_from_vault
# Note: Typeform API key below is Liberty-specific
TYPEFORM_API_KEY=tfp_FNjg2X7QkW3MkWqY5xr2pCL9ADyTjEKExmgvbhoAvrd3_3mPGrSWR3HxkHn
MAILCHIMP_API_KEY=e028ec0ce85df6990c0a824e3b55e033-us17

# ============================================
# VERCEL DEPLOYMENT (GitHub Actions) ✅ ACTUAL VALUES
# ============================================
VERCEL_TOKEN=eYYDxieTdHeGJDsMO3z3YRKh
VERCEL_ORG_ID=team_YkDxhZ9BKq4kDxzxZGjQWlQR
VERCEL_PROJECT_ID=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PROJECT_ID_AUDIO_INTEL=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PROJECT_ID_TRACKER=prj_uiEWXtOUY3d9ly8JureSAcSXaoRd
VERCEL_PROJECT_ID_PITCH_GENERATOR=prj_3EJMQY0EfED1fFosCyOmJwmH4Unf
VERCEL_PROJECT_ID_COMMAND_CENTRE=prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9
VERCEL_PROJECT_ID_WEB=prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C
VERCEL_WEB_PROJECT_ID=prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C
VERCEL_AUDIO_INTEL_PROJECT_ID=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PITCH_PROJECT_ID=prj_3EJMQY0EfED1fFosCyOmJwmH4Unf
VERCEL_TRACKER_PROJECT_ID=prj_uiEWXtOUY3d9ly8JureSAcSXaoRd

# ============================================
# GITHUB ACTIONS (CI/CD)
# ============================================
GITHUB_REF=refs/heads/main
GITHUB_ACTIONS=true
CI=false

# ============================================
# TESTING
# ============================================
TEST_URL=http://localhost:3000
TEST_VAR=test_value

# ============================================
# SCRIPT VARIABLES
# ============================================
TEXT=⚠️_your_message_text_from_vault
```

---

## Summary of Actual Values Found

✅ **Confirmed Actual Values:**

- `NEXT_PUBLIC_SUPABASE_URL`: `https://lbtazcdqirgvmhvtwrbc.supabase.co`
- `DEMO_USER_EMAIL`: `founder@totalaudiopromo.com`
- `DEMO_USER_PASSWORD`: `buildfast`
- `EMAIL_FROM`: `Audio Intel <exports@totalaudiopromo.com>`
- `CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID`: `8440957`
- `CONVERTKIT_PRICING_FORM_ID`: `8405293`
- `AIRTABLE_BASE_ID`: `appx7uTQWRH8cIC20`
- `NEXT_PUBLIC_ANALYTICS_ID`: `GTM-WZNJWDKH`
- `WARM_API_BASE_URL`: `https://public-api.warmmusic.net/api/v1`
- `WARM_API_EMAIL`: `promo@totalaudiopromo.com`
- `ADMIN_EMAIL`: `chris@totalaudiopromo.com`
- `MONDAY_BOARD_ID`: `2443582331`
- `VERCEL_ORG_ID`: `team_YkDxhZ9BKq4kDxzxZGjQWlQR`
- `VERCEL_PROJECT_ID_AUDIO_INTEL`: `prj_3rSBMs1gaZj8uSg2XyCW31tzeF60`
- `VERCEL_PROJECT_ID_TRACKER`: `prj_uiEWXtOUY3d9ly8JureSAcSXaoRd`
- `VERCEL_PROJECT_ID_PITCH_GENERATOR`: `prj_3EJMQY0EfED1fFosCyOmJwmH4Unf`
- `VERCEL_PROJECT_ID_COMMAND_CENTRE`: `prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9`
- `VERCEL_PROJECT_ID_WEB`: `prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C`
- Tracker Supabase URL: `https://ucncbighzqudaszewjrv.supabase.co`
- Tracker Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTU2MjEsImV4cCI6MjA3NDQ5MTYyMX0.byAFslDRcX_Peto69Z7jG90CoWnQRaqNGOzhxteAgCI`

✅ **Actual Values Now Included:**

- Anthropic API Key (Audio Intel)
- Perplexity API Key
- OpenAI API Key
- Gemini API Key (Liberty-specific)
- Stripe Live Keys (Secret, Webhook, Publishable)
- Resend API Key
- ConvertKit API Key & Secret
- Kit.com API Key
- Notion API Key
- Airtable API Key & Token
- Mailchimp API Key (TAP)
- Google OAuth (Client ID & Secret)
- LinkedIn OAuth (Client ID & Secret)
- Firecrawl API Key
- Vercel Token
- WARM API Token (Total Audio Promo)
- Discord Bot Token & App ID
- Monday.com API Key (Liberty)
- Typeform API Key (Liberty)
- Bluesky App Password
- Tracker Supabase Keys (commented)

⚠️ **Values You Still Need to Add from Your Vault:**

- Main Supabase anon key and service role key (for lbtazcdqirgvmhvtwrbc.supabase.co)
- Stripe Price IDs (monthly/annual subscriptions)
- NEXTAUTH_SECRET
- JWT_SECRET
- CRON_SECRET
- Airtable OAuth credentials (if needed)
- Mailchimp OAuth credentials (if needed)
- Other optional service tokens

---

**💡 Tip:** Copy the entire block above and paste it into Codex's Environment Variables section, then replace all the ⚠️ placeholders with your actual values from your password manager.
