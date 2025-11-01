# Business Separation - Liberty vs Total Audio

## 🎯 TWO DISTINCT BUSINESSES

### Liberty Music PR

- **Type**: Radio promotion agency (client services)
- **Google Workspace**: `@libertymusicpr.com`
- **Purpose**: Client campaigns, station relationships, promotion work
- **Data Source**: Google Chat channels with campaign workflows, team communication
- **Use Case**: Train agents on how Liberty operates (for automation/assistance)

### Total Audio Promo

- **Type**: SaaS platform (Audio Intel product)
- **Google Workspace**: `@totalaudiopromo.com` / `promo@totalaudiopromo.com`
- **Purpose**: Customer acquisition, product development, marketing
- **Data Source**: Gmail campaigns, customer interactions
- **Use Case**: Customer acquisition content, product positioning

## 🔧 CURRENT CONFUSION

**Problem**: Mixed credentials between both businesses

- Gmail MCP: Using `promo@totalaudiopromo.com` ✅
- Calendar/Chat MCPs: Configured for Total Audio but need **Liberty access**

## ✅ CORRECT SETUP NEEDED

### For Liberty Music PR Agent Training:

```
Email: jodie@libertymusicpr.com (or sam@libertymusicpr.com)
Google Chat: Liberty workspace channels
Purpose: Extract campaign workflows, station interactions, team processes
Access: Read-only for agent training
```

### For Total Audio Promo (Current):

```
Email: promo@totalaudiopromo.com
Gmail: Customer acquisition emails
Purpose: Content creation, customer research
Access: Already configured ✅
```

## 🔑 CREDENTIALS NEEDED

**Liberty Google Workspace:**

- Which Liberty email should the agent use? (`jodie@` or `sam@` or different?)
- OAuth for Liberty workspace Chat access
- Read-only permissions for training data extraction

**Total Audio (Already Have):**

- Gmail: `promo@totalaudiopromo.com` ✅
- WARM API: Token for play data ⏳ (expired, need refresh)

## 📋 NEXT ACTIONS

1. **Clarify which Liberty email** the agent should use
2. **Get Liberty OAuth credentials** (separate from Total Audio)
3. **Configure Liberty Google Chat MCP** with correct workspace
4. **Keep Total Audio Gmail separate** (already working)

---

**Question for Chris:**

- Which Liberty email should the agent use for Google Chat access?
- Do you have admin access to create OAuth app for Liberty workspace?
- Or should we use service account for Liberty data access?
