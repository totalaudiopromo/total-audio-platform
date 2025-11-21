# Airtable ↔ Mailchimp Sync Analysis

## Source of "Unsubscribed" Status

**CONFIRMED**: The "Unsubscribed" status is coming **directly from your Airtable database**, not from Mailchimp.

### Evidence from Data Structure

Looking at the contact records in `KYARA_AIRTABLE_CONTACTS.json`, I can see the Airtable field structure:

```javascript
"allFields": {
  "Email": "wandagm@3wk.com",
  "Status": "Unsubscribed",  // ← THIS is the Airtable field
  // ... other fields
}
```

The "Status" field in Airtable contains values like:

- **"Opted-In"** (10 contacts)
- **"Unsubscribed"** (11 contacts)
- **Empty/No status** (2 contacts: isthisrob@yahoo.com, bob.huggins@goqradio.com)

## Contact Breakdown (21 Total)

###  Good Contacts (10 opted-in)

1. uniqueexpansionradio@gmail.com - Opted-In (Doris from Unique Expansion Radio)
2. hal@centralcoastradio.org - Opted-In (Hal Abrams, Central Coast Radio)
3. michelle.choudhry@bbc.co.uk - Opted-In (Michelle, BBC Radio 6 Music - Marc Riley show) **HIGH VALUE**
4. voicecontent@yahoo.com - Opted-In (Jodie/Paul)
5. jkhjksdhfmnm@gmail.com - Opted-In (Test contact? Looks like gibberish data)
6. Hello@djdebgrant.com - Opted-In (Deb Grant, New Music Fix Daily) **HIGH VALUE**
7. paul.mansell@marlowfm.co.uk - Opted-In (Paul Mansell, Marlow FM)
8. radioshoes@gmail.com - Opted-In (Chris Evans, Cannock Chase Radio FM)
9. isthisrob@yahoo.com - No status (Allovertheplace Radio)
10. bob.huggins@goqradio.com - No status (Bob Huggins, GoQ Radio)

###  Unsubscribed Contacts (11 contacts)

1. wandagm@3wk.com - Unsubscribed (3WK)
2. leezalondon@gmail.com - Unsubscribed (The Independent, USA)
3. cybermensrevenge@hotmail.com - Unsubscribed (Sheffield Live)
4. scrshell@gmail.com - Unsubscribed (Scrshell)
5. radio.devon@bbc.co.uk - Unsubscribed (BBC Radio Devon) **POTENTIALLY HIGH VALUE**
6. sam.davies@audioalways.com - Unsubscribed (Sam Davies, Chris Hawkins producer) **HIGH VALUE**
7. paperlion@outlook.com - Unsubscribed (Toby)
8. mrtilleysmusicplaylist@gmail.com - Unsubscribed (The Music Recommendations Show)
9. simon.westlake@digitalgunfire.com - Unsubscribed (Simon Westlake)
10. jeffreyrubin@shaw.ca - Unsubscribed (Jeff, Canada)
11. nimoysucks@gmail.com - Unsubscribed (Ryan)

## Mailchimp Tag Analysis

Looking at the "MC TAGS" field in Airtable, these contacts have been tagged in Mailchimp before:

**High-Value Tags:**

- **BBC Radio 6 Music Contacts** (michelle.choudhry@bbc.co.uk, Hello@djdebgrant.com, sam.davies@audioalways.com)
- **Indie Alliance** (Multiple contacts)
- **Catalina Cara Contacts** (leezalondon@gmail.com, cybermensrevenge@hotmail.com, etc.)
- **3DAYWKEND Contacts** (Multiple pop/indie contacts)

## Two Mailchimp Accounts Problem

You mentioned:

> "I have two Mailchimp accounts: one for Liberty music PR and one for Total Audio Promo"

**Current Situation:**

- This Airtable base was meant for **Total Audio Promo**
- But you're mostly using it for **Liberty Music PR** contacts
- The unsubscribed contacts likely unsubscribed from one account but not the other
- **Risk**: Adding these contacts to a different Mailchimp account could violate their unsubscribe preference

## Mailchimp Limit Concerns

You asked about "not hitting the limits" - here's the breakdown:

**Current Mailchimp Limits (based on plan):**

- **Free Plan**: 500 contacts, 1,000 sends/month
- **Essentials Plan**: Starting at £9.23/month for 500 contacts
- **Standard Plan**: Starting at £13.85/month for 500 contacts

**Your Current Stats:**

- Added 21 KYARA contacts to Total Audio Promo Mailchimp
- Result: 11 new + 10 updated = 21 total contacts in that audience
- **Safe**: Well below any plan limits

**Liberty Mailchimp Account:**

- Unknown current contact count
- If you want to sync Airtable → Liberty Mailchimp, we need to check current count first

## Recommended Action Plan

### Option 1: Keep Separate (Recommended)

**For Total Audio Promo Mailchimp:**

- Use for Audio Intel product marketing
- Sync contacts who opted in via Mailchimp landing page
- Keep KYARA campaign contacts here

**For Liberty Music PR Mailchimp:**

- Keep your existing radio contacts
- Don't sync from Airtable unless you verify opt-in source
- Protect your valuable BBC/6 Music relationships

### Option 2: Consolidate to Liberty (Risky)

- Verify unsubscribe status in both Mailchimp accounts
- Only add contacts who are NOT unsubscribed in Liberty account
- Risk: Could violate GDPR if contacts unsubscribed from Liberty but not from Total Audio Promo

### Option 3: Clean Airtable First (Best Long-term)

1. Create a script to check Mailchimp unsubscribe status via API
2. Update Airtable "Status" field based on actual Mailchimp status
3. Add a new field: "Mailchimp Account" (Liberty/Total Audio Promo/Both)
4. Only sync contacts who are verified opted-in to the target account

## Next Steps

**Would you like me to:**

1. **Check Liberty Mailchimp contact count** to see if we're close to limits?
2. **Create a script to sync unsubscribe status** from Mailchimp → Airtable for accuracy?
3. **Filter Airtable contacts by opt-in source** (e.g., only add "Mailchimp Landing Page" to Total Audio Promo)?
4. **Create separate Airtable views** for Liberty vs Total Audio Promo contacts?
5. **Investigate why BBC contacts are marked unsubscribed** (they might be valuable enough to manually verify)?

## Important Notes

**GDPR Compliance:**

- If a contact unsubscribed from Liberty Music PR, they must stay unsubscribed
- You can't re-add them to Total Audio Promo without explicit new consent
- Mailchimp will automatically suppress unsubscribed emails across all audiences in the same account

**High-Value Unsubscribed Contacts to Investigate:**

- **radio.devon@bbc.co.uk** - BBC Radio Devon
- **sam.davies@audioalways.com** - Producer for Chris Hawkins (BBC 6 Music)
- **cybermensrevenge@hotmail.com** - Sheffield Live

These might be worth manually checking - they could be data errors or accidental unsubscribes.

---

**Summary**: The "Unsubscribed" status is stored in Airtable's "Status" field, not pulled from Mailchimp. We need to decide which Mailchimp account to use as the single source of truth and sync accordingly.
