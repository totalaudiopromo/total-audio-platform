# ConvertKit Setup (10 Minutes)

## Step 1: Create Account (if needed)

Go to: convertkit.com/pricing
- Free tier: Up to 1,000 subscribers
- Perfect for starting out

## Step 2: Import Contacts

1. Click "Subscribers" in left menu
2. Click "Import subscribers"
3. Upload `contacts-template.csv` (filled with your contacts)
4. Map fields:
   - first_name → First Name
   - email → Email
   - company → Custom field "Company"
5. Click "Import"

## Step 3: Create Email Sequence

1. Click "Sequences" → "New sequence"
2. Name it: "Radio Promoter Outreach"

### Email 1 (Day 0):
- Subject: `Save 15+ hours/week on contact research`
- Body: Copy from READY-TO-SEND-EMAILS.md Email 1
- Use `{{first_name}}` for personalization
- Send: Immediately

### Email 2 (Day 3):
- Subject: `Quick follow-up: contact research automation`
- Body: Copy from READY-TO-SEND-EMAILS.md Email 2
- Use `{{first_name}}`
- Wait: 3 days

### Email 3 (Day 7):
- Subject: `Last note about Audio Intel`
- Body: Copy from READY-TO-SEND-EMAILS.md Email 3
- Use `{{first_name}}`
- Wait: 4 days (from Email 2)

## Step 4: Add Automation Rule

Sequences → Settings → "Only send to subscribers who haven't opened previous emails"

This stops bugging people who already clicked.

## Step 5: Subscribe Contacts

1. Go to your imported subscribers
2. Select all
3. Click "Add to sequence"
4. Choose "Radio Promoter Outreach"
5. Click "Subscribe"

DONE! Emails send automatically.

## Alternative: Use Mailchimp

If you prefer Mailchimp:
1. Create audience
2. Import CSV
3. Create automation with same timing
4. Activate

Same result, different tool.

## What You Get

After setup:
- Email 1 sends immediately to all contacts
- Email 2 auto-sends 3 days later (only to non-openers)
- Email 3 auto-sends 7 days after initial (only to non-openers)
- You get notified of replies
- Signups tracked automatically

Set it and forget it.
