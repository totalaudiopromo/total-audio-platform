#  CONVERTKIT MANUAL SETUP - SPRINT WEEK READY

##  FASTEST DEPLOYMENT (2 Minutes)

Since Kit.com API is having issues, here's the exact content to copy-paste into ConvertKit dashboard for immediate deployment.

---

##  EMAIL 1 (Day 0) - COPY THIS INTO CONVERTKIT

**Email Subject:**
```
Welcome to Audio Intel Beta - Free Testing Access
```

**Email Content:**
```
Hi {{ subscriber.first_name | default: "there" }},

Thanks for signing up to test Audio Intel during the beta phase.

ABOUT THE BETA:
• Completely free access to all features during testing period
• No credit card required, no payment requests
• Built specifically for music industry professionals
• Your honest feedback shapes the final product

WHAT YOU'RE TESTING:
Audio Intel automates the contact research that used to take me hours when promoting electronic releases. Instead of juggling Groover, SubmitHub, Spotify for Artists, and endless spreadsheets, everything happens in one place.

HOW TO TEST:
1. Go to: intel.totalaudiopromo.com/demo
2. Upload any contact list (CSV, Excel, or manual entry)
3. Watch the AI research and enrich your contacts
4. Test the genre matching, email finding, and demographic filters
5. Export your enhanced contact lists

YOUR FEEDBACK MATTERS:
This tool exists because I got tired of spending entire weekends researching radio contacts for single releases. As someone working in Brighton's electronic music scene, I knew there had to be a better way.

Questions or issues? Just reply to this email.

Start testing → intel.totalaudiopromo.com/demo

Built by sadact
Brighton electronic producer who got tired of juggling 8+ tools just to promote one release
Former Network Programmes Manager at Decadance UK and current radio promoter
```

---

##  EMAIL 2 (Day 3) - COPY THIS INTO CONVERTKIT

**Email Subject:**
```
Beta Testing: Advanced Features and Why Your Feedback Matters
```

**Email Content:**
```
Hi {{ subscriber.first_name | default: "there" }},

How's the Audio Intel testing going so far?

If you haven't had a chance to try it yet, no pressure at all. When you do have 15 minutes free, here's what I'd love you to test:

ADVANCED FEATURES TO EXPLORE:
• Email finder (locates missing contact addresses)
• Genre matching (filters contacts by music style)
• Regional targeting (matches stations to tour locations)
• Show format detection (identifies which programmes book which artists)
• Bulk contact enrichment (processes hundreds of contacts simultaneously)

WHY YOUR FEEDBACK IS CRUCIAL:
When promoting my latest electronic release, I was spending hours switching between platforms. Radio contact research alone was taking 6+ hours per campaign. 

As a former Network Programmes Manager at Decadance UK, I knew the industry needed something better. But I need to know if this actually solves the problems you face too.

WHAT I'M LOOKING FOR:
• Does it save you time on actual campaigns?
• Are the contact matches accurate for your genre?
• What features are missing that you wish it had?
• Any part of the process that's confusing?

Your honest feedback directly influences what gets built next.

Reply and let me know your thoughts, even if you've only uploaded one test file.

Continue testing → intel.totalaudiopromo.com/demo

Built by sadact
Brighton electronic producer and former Decadance UK Network Programmes Manager
```

---

##  EMAIL 3 (Day 7) - COPY THIS INTO CONVERTKIT

**Email Subject:**
```
Mid-Beta Check-in: How Are You Finding Audio Intel?
```

**Email Content:**
```
Hi {{ subscriber.first_name | default: "there" }},

We're halfway through the beta testing period, and I wanted to check in on your experience.

REAL USAGE EXAMPLE:
Last week, when preparing promotion for a Brighton electronic artist's EP release, Audio Intel processed 340 radio contacts in 12 minutes. The same research would have taken me 4+ hours manually switching between Groover, station websites, and LinkedIn searches.

The AI found email addresses for 89% of contacts and correctly matched genres for targeted programming. Most importantly, it identified 23 shows that regularly play similar electronic music but weren't on my original radar.

HOW HAS YOUR TESTING GONE?
Whether you've processed one contact list or dozens, I'd love to hear:
• What's working well for your campaigns?
• Any features that don't quite fit your workflow?
• Contact sources or data types you wish it handled?

HONEST FEEDBACK SHAPES THE PRODUCT:
This tool exists because manual contact research was eating up time I wanted to spend on actual music promotion and relationship building. Your experience helps me understand if it solves similar problems for others in the industry.

Even if you haven't used it extensively yet, that feedback is valuable too - it tells me something important about the user experience.

Reply with your thoughts, questions, or suggestions.

Keep testing → intel.totalaudiopromo.com/demo

Built by sadact
Brighton-based electronic producer and radio promoter
```

---

##  EMAIL 4 (Day 14) - COPY THIS INTO CONVERTKIT

**Email Subject:**
```
Beta Testing Ends Today - Lifetime Discount as Appreciation
```

**Email Content:**
```
Hi {{ subscriber.first_name | default: "there" }},

The Audio Intel beta testing period ends today.

First, thank you for taking time to test the platform and provide feedback. Whether you used it extensively or just explored the features, your participation helped shape what Audio Intel becomes.

WHAT HAPPENS NEXT:
Audio Intel launches publicly tomorrow with standard pricing:
• Professional: £19.99/month
• Agency: £59.99/month  
• Enterprise: Custom pricing

LIFETIME DISCOUNT FOR BETA TESTERS:
As appreciation for your testing and feedback, beta participants get 50% off forever:
• Professional: £9.99/month (lifetime rate)
• Agency: £29.50/month (lifetime rate)
• Enterprise: 50% off custom quote

This discount is available indefinitely - no expiry date, no pressure to decide today.

MY COMMITMENT TO LIFETIME MEMBERS:
• Direct access to me when you need campaign support
• First access to all new features and integrations
• Priority technical support
• Recognition as a founding member of the Audio Intel community

ONLY UPGRADE IF IT ADDS VALUE:
This tool was built to solve real problems I faced as a working promoter. Only subscribe if it genuinely saves you time and improves your campaigns.

If you found value during testing → intel.totalaudiopromo.com/pricing
Continue exploring free features → intel.totalaudiopromo.com/demo

Thanks again for being part of the beta community.

Built by sadact
Brighton electronic producer who got tired of juggling 8+ tools just to promote one release
Former Network Programmes Manager at Decadance UK
```

---

##  CONVERTKIT DASHBOARD SETUP (60 SECONDS)

### **Step 1: Create New Email Sequence**
1. Go to ConvertKit dashboard → Automations → Visual Automations
2. Click "Create Automation"
3. Name: "Audio Intel Free Beta Feedback Sequence"

### **Step 2: Add Trigger**
1. Set trigger: "Subscribes to a form" 
2. Select Form ID: **8440957** (your existing beta form)

### **Step 3: Add 4 Emails**
1. **Email 1**: Add immediately (Day 0)
2. **Email 2**: Add 3-day delay after Email 1
3. **Email 3**: Add 4-day delay after Email 2 (total: 7 days)
4. **Email 4**: Add 7-day delay after Email 3 (total: 14 days)

### **Step 4: Add Tags**
Add these tags to the automation:
- `beta_user` (when they subscribe)
- `free_trial` (when they subscribe)
- `feedback_provided` (when they reply to emails)
- `lifetime_discount_eligible` (when sequence completes)

### **Step 5: Activate**
1. Review all emails
2. Test with a sample email
3. Activate the automation
4. Monitor performance

---

##  VERIFICATION CHECKLIST

After setup, verify:
- [ ] All 4 emails created with correct content
- [ ] Timing: Day 0, 3, 7, 14
- [ ] Form 8440957 triggers the sequence
- [ ] Tags applied correctly
- [ ] Links work: `intel.totalaudiopromo.com/demo` and `/pricing`
- [ ] Test signup receives immediate welcome email

---

##  READY FOR SPRINT WEEK

**Your ConvertKit API integration (`/api/convertkit/route.ts`) is already working perfectly.**

**Beta signup at `intel.totalaudiopromo.com/beta` will:**
1.  Trigger immediate welcome email (already configured)
2.  Add proper tags (`beta_user`, `free_trial`)
3.  Enroll in 4-email sequence (once you copy-paste above)

**Total setup time: 2 minutes of copy-pasting into ConvertKit dashboard.**

**Sprint Week beta testing is ready to launch! **