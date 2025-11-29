# QUICK DATABASE SETUP (5 MINUTES)

**Problem**: "Database server not running at localhost:5432"
**Solution**: Use Vercel Postgres (serverless, no maintenance)

---

## OPTION 1: VERCEL POSTGRES VIA WEB (EASIEST - 3 MINUTES)

### Step 1: Go to Vercel Dashboard

```
https://vercel.com/chris-projects-6ffe0e29/audio-intel
```

### Step 2: Add Postgres Storage

1. Click **Storage**tab in your Audio Intel project
2. Click **Create Database**
3. Select **Postgres**
4. Name it: `total-audio-db`
5. Region: **Washington, D.C., USA (East)**(closest to you)
6. Click **Create**

### Step 3: Connect to Project

1. After creation, click **Connect Project**
2. Select: `audio-intel`
3. Environment: **Development, Preview, Production**(all three)
4. Click **Connect**

### Step 4: Pull Environment Variables Locally

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
vercel env pull .env.local
```

You'll see:

```
 Created .env.local file (.env.local)
```

### Step 5: Update Database Schema

```bash
cd ../api
npx prisma db push
npx prisma generate
```

### Step 6: Test It Works

```bash
cd ../audio-intel
npm run dev
```

**DONE!**No more "database server not running" errors.

---

## OPTION 2: SUPABASE (ALTERNATIVE - 5 MINUTES)

### Step 1: Create Supabase Account

```
https://supabase.com/dashboard
```

### Step 2: Create New Project

1. Click **New Project**
2. Name: `total-audio-promo`
3. Database Password: `AudioIntel2025!` (save this)
4. Region: **East US (North Virginia)**
5. Click **Create new project**(takes 2 minutes)

### Step 3: Get Connection String

1. Go to **Settings**→ **Database**
2. Scroll to **Connection string**
3. Select **URI**mode
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

### Step 4: Update .env.local

```bash
# Edit apps/audio-intel/.env.local
# Replace DATABASE_URL line with your Supabase connection string

DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### Step 5: Push Database Schema

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/api
npx prisma db push
npx prisma generate
```

### Step 6: Test It Works

```bash
cd ../audio-intel
npm run dev
```

**DONE!**Database is live and accessible everywhere.

---

## WHICH ONE SHOULD YOU USE?

| Feature         | Vercel Postgres           | Supabase                 |
| --------------- | ------------------------- | ------------------------ |
| **Setup Time** | 3 minutes                 | 5 minutes                |
| **Integration**| Native with Vercel        | Manual connection string |
| **Dashboard**  | Basic                     | Feature-rich UI          |
| **Free Tier**  | 256MB, 10k rows           | 500MB, unlimited rows    |
| **Backups**    | Automatic                 | Automatic                |
| **Best For**   | Quick setup, Vercel users | Better UI, more features |

**My Recommendation**: **Vercel Postgres**(Option 1)

- You're already using Vercel
- 3-minute setup via dashboard
- Native integration (env vars automatically added)
- Perfect for your scale

---

## WHAT YOU GET

### Before

 Must start local PostgreSQL server every time
 "Database server not running" errors
 Only works on one machine
 Manual backups

### After

Works everywhere (home, Postman office, travelling)
Zero maintenance
Automatic backups
Production-ready
FREE at your scale

---

## TROUBLESHOOTING

### After Setup: "Prisma Client not found"

```bash
cd apps/api
npx prisma generate
```

### "Can't connect to database"

```bash
# Check .env.local has DATABASE_URL
cat apps/audio-intel/.env.local | grep DATABASE_URL

# Should show something like:
# POSTGRES_URL="postgres://default:..."
```

### Vercel env pull not working

```bash
# Make sure you're in the audio-intel directory
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel

# Try again
vercel env pull .env.local
```

### Want to see your database

**Vercel**: `vercel.com/chris-projects-6ffe0e29/stores`
**Supabase**: `supabase.com/dashboard` → Your project → Table Editor

---

## VERIFICATION CHECKLIST

After setup, run these commands:

```bash
# 1. Check .env.local has DATABASE_URL
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
cat .env.local | grep -i database

# 2. Generate Prisma client
cd ../api
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Start dev server
cd ../audio-intel
npm run dev
```

You should see:

```
 Ready in 2.3s
 Local: http://localhost:3000
```

No more database errors!

---

## BONUS: ADD TO AGENT OS

Once working, add database health check to Agent OS:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents
node unified-launcher.js health
```

Will show:

```
Database: Connected (Vercel Postgres)
TDD System: Operational
Total Agents: 14
```

---

## PRO TIP: CREATE STARTUP SCRIPT

Save this as `~/start-dev.sh`:

```bash
#!/bin/bash

cd /Users/chrisschofield/workspace/active/total-audio-platform

# Check Agent OS health
echo " Checking system health..."
node tools/agents/unified-launcher.js health

# Check database connection
echo ""
echo " Checking database..."
cd apps/api
npx prisma db pull --preview-feature >/dev/null 2>&1 && echo "Database: Connected" || echo " Database: Not connected"

# Start Audio Intel
echo ""
echo "Starting Audio Intel..."
cd ../audio-intel
npm run dev
```

Then:

```bash
chmod +x ~/start-dev.sh
bash ~/start-dev.sh
```

---

## BOTTOM LINE

**Option 1 (Vercel)**: 3 minutes via web dashboard
**Option 2 (Supabase)**: 5 minutes with connection string

Both are:

- FREE at your scale
- Zero maintenance
- Work everywhere
- Production-ready

**Pick one and you'll never see "database server not running" again.**

Go to: https://vercel.com/chris-projects-6ffe0e29/audio-intel → Storage → Create Database
