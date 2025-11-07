# Google Drive & Calendar Setup - Manual Guide

## ✅ Gmail Complete

Gmail is now fully organized with:

- 114 emails properly labeled
- 9 filters active
- Hourly autopilot running
- All Otter AI, Gemini, WARM in correct locations

## 📁 Google Drive Setup (Manual)

Since OAuth needs Drive scopes, here's how to create the folders manually with color coding:

### 1. Create Main Folders

Go to https://drive.google.com and create these folders:

```
Liberty Music PR
Personal Tools
Marketing Archive
```

### 2. Create Subfolders in "Liberty Music PR"

Inside "Liberty Music PR", create:

```
Active Campaigns
Station Feedback & Assets
Needs Action
Completed
Archive
Internal Team
```

### 3. Apply Colors

Right-click each folder → "Change color":

**Liberty Music PR subfolders:**

- **Active Campaigns** → 🟢 Green
- **Station Feedback & Assets** → 🟠 Orange
- **Needs Action** → 🔵 Blue
- **Completed** → 🟡 Yellow
- **Archive** → 🔴 Red
- **Internal Team** → Light blue

**Main folders:**

- **Personal Tools** → 🟣 Purple
- **Marketing Archive** → ⚫ Grey

### 4. Done!

Your Drive now matches your Gmail label system.

## 📅 Google Calendar Setup (Manual)

### 1. Create Calendars

Go to https://calendar.google.com

Click "+" next to "Other calendars" → "Create new calendar"

Create these 4 calendars:

1. **Liberty - Campaign Deadlines**

   - Description: "Radio campaign deadlines and release dates"

2. **Liberty - Station Follow-ups**

   - Description: "Station response follow-ups and callbacks"

3. **Liberty - Action Items**

   - Description: "Tasks requiring immediate attention"

4. **Liberty - Team Meetings**
   - Description: "Liberty Music PR team coordination"

### 2. Apply Colors

For each calendar, click the 3 dots → Settings → Color:

- **Campaign Deadlines** → 🔴 Tomato (red)
- **Station Follow-ups** → 🟠 Tangerine (orange)
- **Action Items** → 🔵 Blueberry (blue)
- **Team Meetings** → 🟣 Grape (purple)

### 3. Done!

Your calendars now match Gmail and Drive.

## 🤖 Future: Automated Setup

If you want the scripts to work (create folders/calendars automatically):

### Option 1: Quick OAuth with Drive Scope

```bash
# In radio-promo directory, add Drive/Calendar scopes to OAuth
# This would require re-doing the OAuth flow with additional scopes
```

### Option 2: Use Google Cloud Console

1. Go to https://console.cloud.google.com
2. Enable Drive API and Calendar API
3. Add scopes to existing OAuth client
4. Re-authenticate with new scopes
5. Run: `node liberty-drive-sync.js setup`
6. Run: `node liberty-calendar-sync.js setup`

## 💡 Why Manual is Fine

**Manual setup takes ~5 minutes and you only do it once.**

The critical automated parts are working:

- ✅ Gmail filters (9 active)
- ✅ Gmail bulk fix (114 emails cleaned)
- ✅ Hourly autopilot (maintaining forever)

Drive and Calendar are just visual organization that you set once and forget.

## 🎯 Current Status

**AUTOMATED & WORKING:**

- ✅ Gmail organization (complete)
- ✅ Email routing (9 filters)
- ✅ Hourly maintenance (autopilot)
- ✅ 114 emails fixed

**MANUAL (5 minutes):**

- ⏳ Drive folders + colors
- ⏳ Calendar setup + colors

**You now have perfectly organized Gmail that maintains itself. Drive/Calendar are just bonus visual organization.**

---

Ready to do Drive/Calendar manually? Or leave it for later?
