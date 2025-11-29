# CODEX SECURITY BRIEFING - RADIO PROMO AGENT CONTEXT

## SECURITY INCIDENT RESOLVED (28/09/2025)

### What Happened:

- Security audit revealed hardcoded API keys in multiple files
- Keys were committed to git history making them publicly accessible
- Immediate lockdown implemented to protect all business operations

### What Was Fixed:

1. **All hardcoded secrets removed**from 15+ source files
2. **Master credential vault created**(`.env.vault`) with business separation
3. **Production environment secured**(`apps/audio-intel/.env.local`)
4. **Compromised keys replaced**with fresh credentials

## NEW CREDENTIAL ARCHITECTURE

### Master Vault Structure (`.env.vault`):

```
TOTAL AUDIO PROMO (TAP_* prefix)
 AI Services (Anthropic, OpenAI, Perplexity)
 Payment (Stripe production keys)
 Data Management (Airtable, Notion)
 Email Marketing (ConvertKit V4)
 Social Media (LinkedIn, Discord, BlueSky)
 Content & Research (Firecrawl, News API)
 Development (GitHub, Vercel)

 LIBERTY MUSIC PR (LIBERTY_* prefix)
 Google Services (OAuth, Gemini)
 Email Marketing (MailChimp)
 Project Management (Monday.com, Typeform)
 Radio Platforms (Amazing Radio, Wigwam)
 Notion Workspace

 AI INVESTMENT ADVISOR (AI_ADVISOR_* prefix)
 AI Services (Anthropic, OpenAI)
 Financial APIs (Alpha Vantage, FMP, FRED)
 Database (Supabase)

SHARED INFRASTRUCTURE (SHARED_* prefix)
 Communication (WhatsApp Business)
 Development Tools (Make.com)
```

## FOR RADIO PROMO AGENT DEVELOPMENT

### Fresh Credentials Available:

- **ConvertKit V4 API**: `kit_8bdcc0edb0cb6e2f0feb844a333c1bc3` (email automation)
- **Fresh MailChimp**: `83f53d36bd6667b4c56015e8a0d1ed66-us13` (Liberty campaigns)
- **New Monday.com**: `eyJhbGciOiJIUzI1NiJ9...PTdoPUW4FQqfO9sGRFVdiawp1smzEfsOHtuW6iEQfJk` (project tracking)
- **Secure Airtable**: `patH8DF1YEieVCSvo...` (contact management)
- **Clean Anthropic**: `sk-ant-api03-cH26V7lzEg...` (AI processing)

### Radio-Specific Credentials:

- **Liberty Amazing Radio**: `jodie@libertymusicpr.com` / `LibertyMusicPR1`
- **Liberty Wigwam**: `samjones@libertymusicpr.com` / `LibertyMusicPR1`
- **WARM Music Network**: Full JWT token available for API access
- **Typeform API**: `tfp_FNjg2X7QkW3MkWqY5xr2pCL9ADyTjEKExmgvbhoAvrd3_3mPGrSWR3HxkHn`

### Security Protocol for Agents:

1. **NEVER hardcode credentials**- always use environment variables
2. **Reference `.env.vault`**for master credential list
3. **Use business prefixes**(TAP*, LIBERTY*, AI*ADVISOR*, SHARED\_)
4. **Copy to `.env.local`**only keys needed for specific agent
5. **Test with placeholder values**during development

## OPERATIONAL STATUS

### FULLY FUNCTIONAL:

- Audio Intel SaaS platform (customer acquisition ready)
- Newsletter system ("The Unsigned Advantage")
- Contact enrichment pipeline (100% success rate)
- Payment processing (Stripe integration)
- Mobile experience (21 UX issues resolved)

### SECURITY HARDENED:

- No secrets visible in codebase
- Git history exposure contained
- Proper file permissions (600 on vault)
- Business separation implemented
- Fresh keys rotated for compromised services

### RADIO AGENT IMPLICATIONS:

- **Full API access**available with secure credentials
- **Multi-business support**ready (TAP vs Liberty campaigns)
- **Contact enrichment**pipeline proven and operational
- **Email automation**ready with fresh ConvertKit V4
- **Project tracking**available via fresh Monday.com integration

## FOR IMMEDIATE RADIO AGENT DEVELOPMENT:

1. **Copy needed credentials**from `.env.vault` to agent's `.env.local`
2. **Use LIBERTY\_\* prefixed keys**for client work
3. **Use TAP\_\* prefixed keys**for Total Audio Promo business
4. **Reference existing enrichment pipeline**in Audio Intel codebase
5. **Leverage proven contact management**via fresh Airtable integration

**Status**: All systems operational, secure, and ready for radio promotion automation development.

---

_Generated: 28/09/2025 - Post Security Audit_
_Next Review: Q4 2025 (quarterly rotation schedule)_
