#  DEPLOY MOBILE FIXES TO PRODUCTION

Your mobile sidebar fixes are ready but not yet live. Here's how to deploy them:

##  First: Fix Vercel Git Author Access

Vercel is blocking auto-deploys because the commits are authored by `chris@totalaudiopromo.com`, which is not a user on the project team.

1. **Invite the email to Vercel**  
   Vercel dashboard → Team → Members → “Invite Member” → enter `chris@totalaudiopromo.com`.  
   Once the invite is accepted, the next push to `main` will deploy automatically.

2. **Alternative: change the commit author**

   ```bash
   git config user.email "YOUR_VERIFIED_VERCEL_EMAIL"
   git commit --amend --reset-author   # or make a fresh commit
   git push --force-with-lease origin main
   ```

   Use this only if you prefer to keep the team membership unchanged.

3. **Confirm the webhook delivery**  
   GitHub → Repo → Settings → Webhooks → Vercel hook → “Recent Deliveries” — look for a `200` response on the latest push. Re-deliver if needed.

##  Changes Ready to Deploy (Commit: 43282db)

### Mobile Sidebar Fixes:

-  Fixed z-index: overlay at z-40, sidebar at z-50
-  Dark overlay (no more light grey blocking screen!)
-  Proper stacking order (overlay → sidebar)
-  Full height sidebar on mobile (h-screen)
-  44px touch targets on all nav items
-  Active touch states for feedback

### Dashboard Mobile Optimizations:

-  Responsive grids (1→2→3/4 columns)
-  10-second API timeout with error handling
-  Skeleton loading states
-  Error recovery with retry button

##  OPTION 1: Manual Deploy via Vercel Dashboard (EASIEST)

1. **Go to**: https://vercel.com/chris-projects-6ffe0e29/command-centre
2. **Click**: "Deployments" tab
3. **Click**: "Redeploy" on the latest deployment (after fixing author access)
4. **Wait**: ~1-2 minutes for build
5. **Test**: https://command.totalaudiopromo.com on mobile

##  OPTION 2: Setup Git Remote & Auto-Deploy

```bash
# 1. Create GitHub repo (if you haven't already)
# Go to github.com and create a new repo called "command-centre"

# 2. Add remote
git remote add origin https://github.com/YOUR_USERNAME/command-centre.git

# 3. Push to main
git push -u origin main

# 4. Connect to Vercel
# Go to Vercel dashboard → Settings → Git → Connect your GitHub repo
```

Once connected, Vercel will auto-deploy on every push!

##  OPTION 3: Re-authenticate Vercel CLI

```bash
# Logout and re-login with team permissions
vercel logout
vercel login
vercel --prod
```

##  After Deployment: Test on Mobile

1. **Open**: https://command.totalaudiopromo.com on mobile
2. **Hard refresh**:
   - iPhone: Hold Shift + tap Reload, or close/reopen tab
   - Android: Settings → Clear cache, or close/reopen tab
3. **Test**: Tap burger menu → Should show dark overlay with white sidebar
4. **Verify**: All nav items clickable, tap overlay to close

---

**Current Status**: Changes committed locally but NOT deployed
**Production URL**: https://command.totalaudiopromo.com
**Files Changed**:

- `app/components/AppShell.tsx` (sidebar z-index fix)
- `app/components/TotalAudioDashboard.tsx` (responsive dashboard)
