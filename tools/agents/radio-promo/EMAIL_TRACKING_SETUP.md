# 📧 Email Tracking Setup Guide

## Simple Email Open & Click Tracking (No Mailchimp Required!)

Right, so I've built you a simple email tracking system that works with **any** email service - Gmail, Outlook, Mailchimp, whatever you want to use. No need to commit to Mailchimp or pay for expensive tracking services.

## 🚀 **How It Works**

### **1. Tracking Pixels (Email Opens)**

- Adds invisible 1x1 pixel to your emails
- When recipient opens email, pixel loads and tracks the open
- Works with any email client (Gmail, Outlook, Apple Mail, etc.)

### **2. Link Tracking (Email Clicks)**

- Converts all links in your email to tracking links
- When clicked, tracks the click and redirects to original URL
- Tracks which links get clicked most

### **3. Analytics Dashboard**

- Real-time open and click rates
- Contact engagement scoring
- Campaign performance tracking
- Automated recommendations

## 🛠️ **Setup (5 Minutes)**

### **Step 1: Deploy Tracking Server**

**Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy tracking server
cd tools/agents/radio-promo
vercel --prod
```

**Option B: Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy tracking server
cd tools/agents/radio-promo
netlify deploy --prod
```

**Option C: Any Hosting Service**

- Upload `tracking-server.js` to your hosting
- Make sure it can run Node.js
- Set up your domain

### **Step 2: Update Environment Variables**

Add to your `.env` file:

```bash
# Email Tracking
TRACKING_BASE_URL=https://your-domain.com/track
```

### **Step 3: Test the System**

```bash
cd tools/agents/radio-promo
node test-email-tracking.js
```

## 📧 **How to Use with Different Email Systems**

### **Gmail (Manual)**

1. Prepare email with tracking:

```javascript
const tracker = new UniversalEmailTracker();
const trackedEmail = tracker.prepareEmailForTracking(
  emailContent,
  emailId,
  contactId,
  campaignId
);
```

2. Copy the tracked content
3. Paste into Gmail (make sure to send as HTML)
4. Send normally

### **Gmail (API)**

```javascript
// Use Gmail API with tracked content
const message = {
  raw: Buffer.from(trackedEmail.content).toString('base64')
};
gmail.users.messages.send({ userId: 'me', resource: { raw: message } });
```

### **Outlook (Manual)**

1. Prepare email with tracking (same as Gmail)
2. Copy tracked content
3. Paste into Outlook (send as HTML)
4. Send normally

### **Mailchimp (API)**

```javascript
// Use Mailchimp API with tracked content
const campaign = {
  type: 'regular',
  settings: {
    subject_line: 'Your Subject',
    from_name: 'Chris Schofield',
    reply_to: 'chrisschofield@libertymusicpr.com'
  },
  content: {
    html: trackedEmail.content
  }
};
```

### **Any Other Email System**

- Just use the tracked content in whatever system you prefer
- Tracking works automatically once deployed

## 📊 **What You Get**

### **Real-time Analytics**

- **Open rates** - Who's opening your emails
- **Click rates** - Who's clicking your links
- **Click-through rates** - Engagement quality
- **Timeline** - When people are engaging

### **Contact Engagement Scoring**

- **0-100 score** for each contact
- **Engagement history** across all campaigns
- **Last engagement** tracking
- **Campaign performance** per contact

### **Automated Recommendations**

- **Subject line** suggestions based on open rates
- **Content** improvements based on click rates
- **Targeting** advice based on engagement
- **Success** patterns to replicate

### **Data Export**

- **CSV export** of all tracking data
- **Campaign reports** for clients
- **Contact lists** with engagement scores
- **Performance metrics** for analysis

## 🎯 **Example Workflow**

### **1. Prepare Campaign Email**

```javascript
const tracker = new UniversalEmailTracker();

// Your email content
const emailContent = `
  <h2>New House Pop: Senior Dunce - Bestial</h2>
  <p>Hi Sarah,</p>
  <p>I have a new house pop track that would be perfect for BBC Radio 1...</p>
  <p>Check out our <a href="https://libertymusicpr.com">website</a> for more info.</p>
`;

// Add tracking
const trackedEmail = tracker.prepareEmailForTracking(
  emailContent,
  'email-123',
  'sarah-johnson',
  'senior-dunce-campaign'
);
```

### **2. Send Email**

- Copy `trackedEmail.content`
- Paste into your email system
- Send as HTML

### **3. Track Performance**

```javascript
// Get campaign stats
const stats = tracker.getCampaignPerformance('senior-dunce-campaign');
console.log(`Open Rate: ${stats.openRate}%`);
console.log(`Click Rate: ${stats.clickRate}%`);

// Get contact engagement
const engagement = tracker.getContactEngagement('sarah-johnson');
console.log(`Engagement Score: ${engagement.engagementScore}/100`);
```

### **4. Optimize Future Campaigns**

- Use high-performing subject lines
- Focus on contacts with high engagement scores
- Improve content based on click rates
- Follow recommendations for better results

## 💰 **Cost Comparison**

| Service | Monthly Cost | Features |
|---------|-------------|----------|
| **Mailchimp** | £10-50+ | Basic tracking, limited contacts |
| **Constant Contact** | £15-45+ | Email marketing, basic analytics |
| **Our System** | **£0** | Full tracking, unlimited contacts, custom analytics |

## 🚀 **Advanced Features**

### **A/B Testing**

- Test different subject lines
- Compare email content
- Track which performs better

### **Engagement Scoring**

- Score contacts 0-100 based on engagement
- Focus on high-value contacts
- Identify VIP contacts automatically

### **Automated Follow-ups**

- Trigger follow-ups based on engagement
- Different approaches for different engagement levels
- Smart timing based on open patterns

### **Real-time Alerts**

- Get notified when emails are opened
- Track high-value contact engagement
- Monitor campaign performance

## 🎉 **Ready to Use!**

Your email tracking system is ready to go! It will:

- **Track every email** you send automatically
- **Show you what's working** with real-time analytics
- **Help you improve** with automated recommendations
- **Work with any email system** - no vendor lock-in
- **Cost nothing** to run (just hosting costs)

**Bottom line**: You now have professional email tracking that works with any email system, costs nothing to run, and gives you better insights than most paid services!

Want to test it? Just run the test script and see it in action! 🎯
