# Unified Auth - Quick Start Guide

## 🚀 30-Second Overview

**What**: Single sign-on across all Total Audio apps
**Why**: Better UX = Higher conversion + Easy bundle pricing
**Time**: 2-3 hours to implement

---

## ⚡ Quick Start (30 minutes)

### 1. Set up Supabase (10 mins)

```bash
# → Go to supabase.com
# → Create project: "Total Audio Platform"
# → Go to SQL Editor
# → Run: supabase/migrations/20251013000001_unified_auth_setup.sql
# → Get credentials from Settings → API
```

### 2. Update Environment Variables (5 mins)

Add to ALL apps' `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Test Authentication (15 mins)

```bash
npm run dev:audio-intel
# → Go to /signup
# → Create account
# → Check email and confirm
# → Sign in at /signin
# → Access /dashboard
```

---

## 💻 Code Snippets

### Use Auth

```typescript
import { useAuth } from '@total-audio/auth'

const { user, profile, signOut } = useAuth()
```

### Check Access

```typescript
import { usePermissions } from '@total-audio/auth'

const { checkAccess } = usePermissions()
const hasAccess = checkAccess('tracker')
```

### Server Auth

```typescript
import { getCurrentUser } from '@total-audio/auth/server'

const user = await getCurrentUser()
```

---

## 🎯 Subscription Tiers

| Tier    | Apps                                          |
|---------|-----------------------------------------------|
| Free    | Audio Intel (10/mo)                           |
| Pro     | Audio Intel (unlimited)                       |
| Agency  | Audio Intel + Teams                           |
| Bundle  | ALL apps (Audio Intel, Tracker, Pitch, etc.)  |

---

## 📚 Full Documentation

| Guide | Purpose |
|-------|---------|
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete step-by-step |
| [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) | Database setup |
| [packages/auth/README.md](./packages/auth/README.md) | API reference |
| [examples/auth-components/](./examples/auth-components/) | UI components |

---

## 🐛 Quick Fixes

| Issue | Fix |
|-------|-----|
| Can't sign in | Check credentials in `.env.local` |
| Profile not created | See SUPABASE_SETUP_GUIDE.md |
| No cross-app auth | Use SAME credentials in all apps |

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Migration ran successfully
- [ ] Credentials added to all apps
- [ ] Sign-up tested
- [ ] Sign-in tested
- [ ] Cross-app auth works

---

**Next**: Open [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for full instructions!

**Last Updated**: October 13, 2025
