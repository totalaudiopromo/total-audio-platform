# Tracker - Quick Deploy Reference

## 🚀 Deploy in 15 Minutes

### 1. Enable Testing (2 mins)

```
https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/auth/providers
→ Email → Toggle OFF "Confirm email"
```

### 2. Copy Stripe Keys (1 min)

```bash
# From audio-intel/.env.local to tracker/.env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Test Locally (5 mins)

```
http://localhost:3001/login
Email: test@tracker.com
Password: password123

1. Create campaign (with genre + reach)
2. Verify intelligence shows
3. Test edit/delete
```

### 4. Deploy (5 mins)

```bash
git add .
git commit -m "feat: Tracker MVP ready"
git push origin main

# Vercel:
vercel.com/new
→ Import total-audio-platform
→ Root: apps/tracker
→ Domain: tracker.totalaudiopromo.com
→ Add env vars (Supabase + Stripe)
→ Deploy
```

### 5. Configure Webhook (2 mins)

```
Stripe → Webhooks
→ https://tracker.totalaudiopromo.com/api/stripe/webhook
→ Events: checkout.session.completed, customer.subscription.*
→ Copy webhook secret to Vercel
→ Redeploy
```

## ✅ What's Ready

- Intel-style design
- Fixed campaign schema (genre, target_reach, actual_reach)
- UK music industry benchmarks
- Intelligence engine
- Pattern recognition
- Integrations section

## 💰 Pricing

- Free: 3 campaigns
- Pro: £19/month unlimited + intelligence

## 🎯 Value

"Your BBC Radio 1 campaign performed 50% above industry average"

---

**Ship it!** 🎵
