# Demo Credentials - All Tools (Shared Authentication)

**Date**: October 2025
**For**: Dan Liberty Meeting Demo

---

## 🔐 SINGLE SIGN-ON ACROSS ALL TOOLS

All three tools use the **same Supabase authentication database**, which means **one account works everywhere**.

### Your Demo Account (Recommended)

**Email**: `chrisschofield@libertymusicpr.com`
**Password**: `2Sn00zyD0g$`

**Why this account**:

- ✅ Uses your actual Liberty email (authentic for demo)
- ✅ Works across all three tools (Audio Intel, Tracker, Pitch Generator)
- ✅ Professional context - "This is my work email, I use these tools daily"
- ✅ Easy to remember for tomorrow's demo

---

## 📱 WHERE TO SIGN IN

### Audio Intel (http://localhost:3000)

- **Sign In URL**: http://localhost:3000/signin
- **Dashboard After Login**: http://localhost:3000/dashboard
- **Features**: Contact enrichment, CSV upload, export

### Tracker (http://localhost:3001)

- **Sign In URL**: http://localhost:3001 (login form on homepage)
- **Dashboard After Login**: http://localhost:3001/dashboard
- **Features**: Campaign tracking, pitch logging, client reports

### Pitch Generator (http://localhost:3002)

- **Sign In URL**: http://localhost:3002 (check for auth flow)
- **Dashboard After Login**: http://localhost:3002/dashboard (or main tool page)
- **Features**: AI pitch writing, tone adjustment

---

## 🧪 TESTING YOUR CREDENTIALS (Do This Tonight)

### Test 1: Audio Intel Login

1. Go to http://localhost:3000/signin
2. Enter: `chrisschofield@libertymusicpr.com`
3. Password: `2Sn00zyD0g$`
4. Click "Sign In"
5. **Expected**: Redirect to http://localhost:3000/dashboard
6. **If it fails**: Account needs to be created (see below)

### Test 2: Tracker Login

1. Go to http://localhost:3001
2. Find login form (should be on homepage)
3. Enter same credentials
4. Click "Sign in"
5. **Expected**: Redirect to http://localhost:3001/dashboard
6. **If it fails**: Same account should work (shared Supabase)

### Test 3: Pitch Generator Login

1. Go to http://localhost:3002
2. Find sign in page
3. Enter same credentials
4. Click sign in
5. **Expected**: Access to pitch generation tool
6. **If it fails**: Check auth setup

---

## 🔧 IF ACCOUNT DOESN'T EXIST - CREATE IT NOW

### Option 1: Sign Up via Audio Intel (Easiest)

1. Go to http://localhost:3000/signup
2. **Email**: `chrisschofield@libertymusicpr.com`
3. **Password**: `Liberty2025!Demo`
4. Click "Sign Up"
5. **Check email** for verification link (if required)
6. Click verification link
7. **Done** - This account now works across all three tools

### Option 2: Sign Up via Tracker

1. Go to http://localhost:3001 (look for "Sign up" link)
2. Enter same credentials
3. Complete signup
4. Verify email if needed

### Option 3: Quick Supabase Dashboard Creation

If you have access to Supabase dashboard:

1. Go to https://ucncbighzqudaszewjrv.supabase.co
2. Navigate to Authentication → Users
3. Click "Add User"
4. Email: `chrisschofield@libertymusicpr.com`
5. Password: `Liberty2025!Demo`
6. Auto-confirm email: YES
7. Save

---

## 🎭 ALTERNATIVE DEMO ACCOUNTS (Backup)

### Option A: Founder Account

**Email**: `founder@totalaudiopromo.com`
**Password**: `buildfast`
**Note**: This is configured in Pitch Generator env vars (see apps/pitch-generator/.env.local line 9-10)

### Option B: Simple Demo Account

**Email**: `demo@totalaudiopromo.com`
**Password**: `TotalAudio2025`
**Note**: Generic demo account, less authentic than Liberty email

### Option C: Personal Email Backup

**Email**: `chris@totalaudiopromo.com`
**Password**: `Liberty2025!Demo`
**Note**: If you want to keep Liberty email separate

---

## ✅ PRE-DEMO CHECKLIST (Tomorrow Morning)

Before the meeting with Dan:

- [ ] Test login on all three tools with `chrisschofield@libertymusicpr.com`
- [ ] Confirm you can access dashboards on all three apps
- [ ] Have password written down somewhere safe (in case you forget mid-demo)
- [ ] Browser is NOT saving wrong credentials (clear saved passwords if needed)
- [ ] All three tools are running (localhost:3000, 3001, 3002)

---

## 🚨 TROUBLESHOOTING

### Problem: "Invalid login credentials"

**Solution**: Account doesn't exist yet. Go to `/signup` and create it with your Liberty email.

### Problem: "Email not confirmed"

**Solution**: Check `chrisschofield@libertymusicpr.com` inbox for verification email from Supabase. Click the link.

### Problem: Password doesn't work

**Solution**: Use "Forgot Password" link or reset via Supabase dashboard.

### Problem: Different apps show different accounts

**Solution**: This shouldn't happen - they share same database. Clear browser cookies and try again.

### Problem: Account works on one tool but not others

**Solution**: All three apps share the same Supabase database. If login works on one, it MUST work on all. Check:

- Are you typing the exact same email/password?
- Clear browser cache/cookies
- Try incognito mode

---

## 🎯 DEMO TALKING POINTS

When you log in during the demo:

> "Right, so I'm logging in with my actual Liberty email - `chrisschofield@libertymusicpr.com`.
> This account works across all three tools because they share the same authentication system.
> That means once you're logged in, you can seamlessly move between contact enrichment,
> campaign tracking, and pitch writing without re-authenticating."

**Why this matters for Dan**:

- Shows professional integration across tools
- Demonstrates you've built a unified ecosystem, not separate projects
- Liberty email = authentic use case ("I actually use this daily")

---

## 📊 ACCOUNT DATA FOR DEMO

Once logged in with your Liberty email, you can demonstrate:

### In Audio Intel:

- Upload real Liberty client contacts (e.g., Royal Blood campaign contacts)
- Show enrichment with your actual work data
- Export results that look like real Liberty workflow

### In Tracker:

- Create campaigns for actual Liberty clients (Royal Blood, Architects, etc.)
- Log pitches to real radio contacts you work with
- Generate client reports that look like Liberty's actual output

### In Pitch Generator:

- Use real artists you promote at Liberty
- Target real outlets (BBC Radio 1, Kerrang, etc.)
- Show pitches you'd actually send in your day job

**This authenticity is POWERFUL in the demo** - you're not showing a mock-up, you're showing tools you actually built to solve your real daily problems at Liberty.

---

## 🔐 SECURITY NOTE

**Password**: `2Sn00zyD0g$`
**Where to store it**: Write it in your notebook or phone notes for tomorrow.
**DON'T**: Email it to yourself or store in plain text docs that sync to cloud.
**After demo**: You can change the password to something more secure.

---

## ✅ FINAL CHECK (Tonight Before Bed)

Run through this:

1. [ ] Created account with `chrisschofield@libertymusicpr.com` on at least one tool
2. [ ] Verified email (if required)
3. [ ] Successfully logged into Audio Intel dashboard
4. [ ] Successfully logged into Tracker dashboard
5. [ ] Successfully logged into Pitch Generator (or confirmed auth flow)
6. [ ] Password is saved somewhere you can access tomorrow
7. [ ] Comfortable with the login flow (takes <10 seconds)

**If ALL boxes checked**: You're ready for tomorrow. Sleep well!

**If ANY box unchecked**: Fix it now or ping me for help.

---

**Tomorrow, walk in confident knowing your actual Liberty email works seamlessly across all three tools. That's not just a demo - that's a real, integrated system you've built. 🚀**
