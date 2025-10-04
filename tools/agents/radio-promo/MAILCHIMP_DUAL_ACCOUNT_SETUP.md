# Mailchimp Dual Account Setup - Complete Guide

## 🎯 Current Situation

You have **two separate Mailchimp accounts**:

1. **Liberty Music PR**: `chrisschofield@libertymusicpr.com`
   - 498 contacts
   - List ID: `137bcedead`
   - API Key: `83f53d36bd6667b4c56015e8a0d1ed66-us13`

2. **Total Audio Promo**: Currently `radiopromo@totalaudiotransfer.com` (need to change to `promo@totalaudiopromo.com`)
   - 339 contacts
   - List ID: `2c81175fba`
   - API Key: `e028ec0ce85df6990c0a824e3b55e033-us17`

## ⚠️ Critical Issue: TAP Account Ownership

**Problem**: Account is owned by `radiopromo@totalaudiotransfer.com` but you want it owned by `promo@totalaudiopromo.com`

**Solution**: Contact Mailchimp support and ask them to transfer ownership

### Support Request Template:
```
Hi Mailchimp Support,

I need to transfer account ownership for my Total Audio Promo account.

Current owner: radiopromo@totalaudiotransfer.com
New owner: promo@totalaudiopromo.com

The new email is already added as a user on the account. Can you please
complete this ownership transfer?

Thank you!
```

**Support Contact**:
- Chat: Bottom right corner when logged in to mailchimp.com
- Or: mailchimp.com/help/contact-us

---

## 📊 Airtable Integration

### Required Airtable Field

Add this field to your KYARA Airtable base:

**Field Name**: `Mailchimp Account`
**Field Type**: Single select
**Options**:
- Liberty
- TAP
- Both
- None

### What This Tracks

- **Liberty**: Contact only exists in Liberty Music PR Mailchimp
- **TAP**: Contact only exists in Total Audio Promo Mailchimp
- **Both**: Contact exists in BOTH Mailchimp accounts
- **None**: Contact not in either Mailchimp account

---

## 🔄 Running the Sync

Once the Airtable field is created, run:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo
node sync-both-mailchimp-accounts.js
```

This will:
1. Fetch all members from Liberty Mailchimp (498 contacts)
2. Fetch all members from TAP Mailchimp (339 contacts)
3. Check each Airtable contact against both accounts
4. Update Airtable with:
   - Which account(s) they're in
   - Their subscription status (subscribed/unsubscribed/cleaned)

---

## 📝 Environment Variables (.env)

Already configured in `/tools/agents/radio-promo/.env`:

```bash
# Liberty Mailchimp (chrisschofield@libertymusicpr.com)
LIBERTY_MAILCHIMP_API_KEY=83f53d36bd6667b4c56015e8a0d1ed66-us13
LIBERTY_MAILCHIMP_SERVER=us13
LIBERTY_MAILCHIMP_LIST_ID=137bcedead

# TAP Mailchimp (promo@totalaudiopromo.com - currently radiopromo@totalaudiotransfer.com)
TAP_MAILCHIMP_API_KEY=e028ec0ce85df6990c0a824e3b55e033-us17
TAP_MAILCHIMP_SERVER=us17
TAP_MAILCHIMP_LIST_ID=2c81175fba
```

---

## ✅ Action Checklist

- [ ] Contact Mailchimp support to transfer TAP account ownership
- [ ] Verify new owner email: promo@totalaudiopromo.com
- [ ] Remove old user: radiopromo@totalaudiotransfer.com
- [ ] Add "Mailchimp Account" field to Airtable (Single select: Liberty/TAP/Both/None)
- [ ] Run sync script: `node sync-both-mailchimp-accounts.js`
- [ ] Verify Airtable contacts now show which Mailchimp account they belong to

---

## 🎯 Expected Results

After sync completes:
- **516 total contacts** in Airtable
- Each contact will show:
  - Which Mailchimp account (Liberty/TAP/Both/None)
  - Subscription status (subscribed/unsubscribed/cleaned)
- You can now filter/segment by Mailchimp account
- You'll know exactly which contacts are where

---

## 🚀 Future Use

Use this to:
1. **Identify duplicates** (contacts in Both accounts)
2. **Target campaigns** by Mailchimp account
3. **Clean up** contacts that are in Neither account
4. **Maintain separation** between Liberty and TAP contact lists
