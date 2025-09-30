# NEWSJACKER 3000 - COMPLETE SETUP GUIDE

Hey friend!

You're about to set up the exact workflow I use to wake up to personalized newsjacking angles every morning.

### Step 1

Download the Workflow file below

[Newsjacker 3000 content automation.json](NEWSJACKER%203000%20-%20COMPLETE%20SETUP%20GUIDE%202740a35b21ed80248b08d88e53694a91/Newsjacker_3000_content_automation.json)

### Step 2

 🚨Important, I’ve added a second video at the bottom of this doc how to customize please watch it! 🚨

**🎬 COMPLETE VIDEO WALKTHROUGH (WATCH THIS FIRST!)**

[https://www.loom.com/share/7bb93f814c3c45d28e1172e896e2507f?sid=16515d90-d68c-4bdd-bccc-a86fc99fdeb2](https://www.loom.com/share/7bb93f814c3c45d28e1172e896e2507f?sid=16515d90-d68c-4bdd-bccc-a86fc99fdeb2)

**This 18-minute video shows every single click, setting, and connection. Follow along as you set up your system.**

**Key timestamps:**

- 0:00 - Introduction & overview
- 0:40 - n8n account setup process
- 1:43 - Importing the workflow (copy-paste method)
- 4:33 - Setting up timing/schedule
- 4:57 - NewsAPI setup & API key
- 6:15 - Getting Twitter data with TwExport
- 10:18 - Customizing the AI Agent prompt
- 12:57 - Anthropic API setup & billing
- 14:46 - Gmail connection setup
- 15:43 - Optional Discord setup
- 16:37 - Testing the complete workflow
- 17:32 - Activating daily automation

**WHAT YOU'RE BUILDING**

An automated system that:

- ✅ Finds trending news stories every morning at 9 AM
- ✅ Analyzes them through YOUR unique voice and expertise
- ✅ Delivers personalized angles to your inbox
- ✅ Optionally posts to Discord for team collaboration
- ✅ Costs ~$3/month to run (NewsAPI + Anthropic credits)

**Time to set up:** 15-20 minutes

**Technical skill needed:** Copy-paste (seriously, that's it)

### STEP 3

**JOIN THE COMMUNITY IF YOU HAVE ANY QUESTIONS**

[**🔗 JOIN NEWSJACKER 3000 COMMUNITY**](https://t.me/+ZokWAKWxChJhYmIy)

### STEP 4 (WRITTEN MANUAL, I RECOMMEND WATCHING THE VIDEO)

# 📚 STEP-BY-STEP SETUP INSTRUCTIONS

---

## STEP 1: SET UP N8N ACCOUNT (FREE)

1. Go to [**n8n.cloud**](https://n8n.cloud/)
2. Click **"Start for free"**
3. Fill out the signup form (choose any name, enter email, choose workspace name)
4. Click **"14 day trial"**
5. Click **"Marketing"** in the questionnaire
6. Skip the team invitation step
7. Click **"Start automatically"**

**✅ Success check:** You should see the n8n workspace with a blank canvas

---

## STEP 2: IMPORT THE WORKFLOW

1. Open the **newsjacker-3000-workflow.json** file with any text editor
2. Press **Ctrl+A** (or Cmd+A on Mac) to select all
3. Press **Ctrl+C** (or Cmd+C on Mac) to copy
4. In n8n, click **"Start from scratch"**
5. Click anywhere on the canvas
6. Press **Ctrl+V** (or Cmd+V on Mac) to paste
7. 

**✅ Success check:** You should see the full workflow with sticky notes

**💡 Note:** Red rectangles are normal - we'll fix them in the next steps

---

## STEP 3: SET YOUR SCHEDULE

1. **Double-click** the **"Schedule Trigger"** node
2. Look for **"Trigger at hour"** setting
3. Default is **9** (9 AM UTC time)
4. To change: Click the time field and enter your preferred hour (0-23 format)
5. Click outside the node to save

**⚠️ Time Zone:** 9 AM UTC = 4 AM EST / 1 AM PST / 10 AM CET

---

## STEP 4: GET NEWS API KEY (FREE)

1. Go to [**newsapi.org**](https://newsapi.org/)
2. Click **"Get API Key"**
3. Sign up (choose **"I'm an individual"**)
4. Copy your API key

**Connect to n8n:**

5. **Double-click** the **"news api"** node
6. Click **"Header Auth"** dropdown
7. Click **"+ Create New"**
8. Name: Type exactly **`X-Api-Key`**
9. Value: Paste your API key
10. Click **"Create"**

**✅ Success check:** Red rectangle disappears from news api node

---

## STEP 5: SET UP ANTHROPIC

1. Go to [**console.anthropic.com**](https://console.anthropic.com/)
2. Create account if needed
3. Click **"API Keys"** → **"Create Key"**
4. Name it **"n8n Newsjacker"**
5. **Copy the key immediately**
6. Click **"Billing"** → **"Add credits"**
7. Add **$5-10**

**Connect to n8n:**

8. **Double-click** the **"Anthropic Chat Model"** node
9. Click **"Credential to connect with"** → **"+ Create New"**
10. Paste your API key
11. Click **"Create"**

**✅ Success check:** Shows "Connection tested"

---

## STEP 6: GET YOUR TWITTER DATA (RECOMMENDED)

1. Install [**TwExport Chrome Extension**](https://chromewebstore.google.com/detail/twexport-export-tweets-fr/nahaggbplpekgcbbnemjlpnnmpmhnfkh)
2. Go to your Twitter profile
3. Click TwExport icon → Set to **149** exports → **"Posts"** → **"Start"**
4. Download CSV when complete

**Clean the data:**

5. Upload CSV to Claude/ChatGPT
6. Ask: *"Extract only tweet text, numbered 1, 2, 3, etc."*
7. Copy the cleaned list
8. Save in a Google Doc for Step 7

---

## STEP 7: CUSTOMIZE FOR YOUR NICHE

1. **Double-click** the **"AI Agent"** node
2. Find: `[PLACEHOLDER: Insert your main expertise areas]`
3. Replace with your niche (e.g., "AI automation, solopreneurship")
4. Find: `[PLACEHOLDER: Insert 3-5 unique angles/perspectives]`
5. Replace with your positioning (e.g., "- European founder perspective - Direct, no-BS style")
6. Click **"Options"**
7. In **"System Message"**, find: `ENTER YOUR TWEET CONTENT HERE`
8. Replace with your tweet data from Step 6
9. Click **"Save"**

---

## STEP 8: CONNECT GMAIL (FREE)

1. **Double-click** the **"Send a message"** node
2. Click **"Credential to connect with"** → **"+ Create New"**
3. Click **"Sign in with Google"**
4. Choose your Gmail account → **"Allow"**
5. **Important:** Enter YOUR email address in the **"To"** field
6. Click **"Save"**

**✅ Success check:** Gmail credential connected and email address set

---

## STEP 9: OPTIONAL - CONNECT DISCORD

1. In Discord: Channel settings → **"Integrations"** → **"Webhooks"** → **"New Webhook"**
2. Name it **"Newsjacker Bot"**
3. Copy webhook URL
4. In n8n: **Double-click** **"Discord"** node
5. Click **"Credential for Discord Webhook"** → **"+ Create New"**
6. Paste webhook URL → **"Create"**
7. Click **"Save"**

---

## STEP 10: TEST YOUR SETUP

1. Click **"Save"** (top right)
2. Click **"Execute Workflow"** (play button)
3. Watch nodes turn green (AI Agent takes 2-4 minutes)
4. Check your email for the newsjacking report

**✅ Success check:** All nodes green + email received

---

## STEP 11: ACTIVATE DAILY AUTOMATION

1. Click the **"Active"** toggle switch (top right)
2. Should show green/blue when active

**✅ Success check:** Workflow shows "Active" status

**Done!** You'll now receive daily newsjacking reports automatically.

BONUS

## STEP 12: CUSTOMIZE YOUR OUTPUT

[https://www.loom.com/share/5305ab85def9426fb6756915420d8040?sid=6a4b7b0e-8ce9-449a-b642-6b06ada15963](https://www.loom.com/share/5305ab85def9426fb6756915420d8040?sid=6a4b7b0e-8ce9-449a-b642-6b06ada15963)

# How to Get Better News (Stop Getting Trump Stories!)

**Problem:** Your newsjacker is pulling too much US political news and Trump stories.

**Solution:** Change 2 simple settings to get news that matches your niche.

---

## 📍 Where to Make Changes

1. **Open your n8n workflow** (Newsjacker 3000)
2. **Click on the "news api" node**
3. **Look for the "Query Parameters" section**

---

## 🛠️ Step 1: Fix the Page Size

**Find the parameter:** `pagesize`

**Change the name to:** `pageSize` (capital S)

**Keep the value:** `15`

---

## 🌍 Step 2: Change Your Country

**Find the parameter:** `country`

**Current value:** `us` (this gives you lots of Trump news)

**Change to one of these:**

- `gb` ← United Kingdom (English, less US politics)
- `de` ← Germany
- `ca` ← Canada (English, less Trump focus)
- `au` ← Australia
- `fr` ← France
- `nl` ← Netherlands

**Or:**

- **Delete this parameter entirely** ← Gets you global/world news from all countries
- Keep `us` if you specifically want US news

**Pro tip:** Deleting the country parameter completely gives you the most diverse, international news coverage!

---

## 📂 Step 3: Add a Category Filter

**Click "Add Parameter"**

**Name:** `category`

**Value:** Pick one:

- `business` ← Perfect for startups/entrepreneurs
- `technology` ← Great for AI/automation content
- `science` ← Tech innovation stories
- `health` ← Wellness/longevity content
- `entertainment` ← Pop culture stories
- `sports` ← Sports news
- `general` ← Mixed content

---

## ✅ Recommended Setups

### **For European Startup Content:**

```
country: gb
category: business
pageSize: 15

```

### **For Global Tech/AI News:**

```
country: us
category: technology
pageSize: 15

```

### **For International Business:**

```
country: ca
category: business
pageSize: 15

```

### **For General Non-Political News:**

```
country: au
category: general
pageSize: 15

```

---

## 🧪 How to Test

1. **Make your changes**
2. **Click "Test step"** at the bottom
3. **Check the output** - you should see more relevant stories
4. **Adjust if needed** and test again

---

## ⚠️ Important Notes

- **Keep the `from` parameter** - this ensures you only get news from the last 24 hours
- **You can mix country + category** - this works perfectly
- **Start simple** - just change the country first, then add category
- **Test after each change** to see what works best for your niche

---

## 💡 Quick Wins

**Getting too much Trump news?** → Change country from `us` to `gb`

**Want startup content?** → Add category: `business`

**Want tech content?** → Add category: `technology`

**Want less political news?** → Use any country except `us`

---

**Result:** You'll get fresh, relevant news from the last 24 hours that actually fits your content niche!