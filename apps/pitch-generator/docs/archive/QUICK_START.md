# Pitch Generator - Quick Start Guide

## 🚀 Getting Started Locally

### 1. Start the Dev Server

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/pitch-generator
npm run dev
```

Server will start at: **http://localhost:3001**

### 2. Sign In

- **Email**: `founder@totalaudiopromo.com`
- **Password**: `buildfast`

### 3. Test the Core Flow

**Step 1: Add a Contact**

1. Go to "Contacts"
2. Click "Add Contact"
3. Fill in details (name, email, outlet, role, genre tags)
4. Save

**Step 2: Generate a Pitch**

1. Go to "Generate Pitch"
2. Select your contact
3. Fill in track details:
   - Artist: sadact
   - Track: maybe i
   - Genre: electronic
   - Key Hook: "Sounds like it was made in Central London during the UK garage boom of 1999"
   - Link: https://open.spotify.com/track/57kM0Yr2bvCEnU416hxtFS
4. Select tone (Casual/Professional/Enthusiastic)
5. Click "Generate Pitch"
6. Wait ~5 seconds
7. Review the generated pitch

**Step 3: Review & Edit**

1. Click "Review & Edit"
2. Make any changes
3. Select your preferred subject line
4. Copy to clipboard
5. Paste into your email client

## 🎯 Test Stripe Checkout

1. Go to "Pricing" (http://localhost:3001/pricing)
2. Select PRO (£14/month)
3. Click "Proceed to checkout"
4. Use test card: **4242 4242 4242 4242**
5. Any future expiry date
6. Any 3-digit CVC
7. Complete checkout
8. Verify redirect to success page

## 📊 Current Pricing

- **FREE**: £0 - 5 pitches/month
- **PRO**: £14/month - Unlimited pitches
- **AGENCY**: £49/month - Unlimited + team features

## 🔧 Stripe Test Products

Already created in your Stripe account:

**PRO Monthly**: `price_1SFBeuPqujcPv5fbccMC5Aln` (£14)
**PRO Annual**: `price_1SFBfIPqujcPv5fbGbGathQe` (£140)
**AGENCY Monthly**: `price_1SFBgIPqujcPv5fb3WZ7dAeP` (£49)
**AGENCY Annual**: `price_1SFBh9PqujcPv5fbM5skKld6` (£490)

## 📝 Testing Checklist

Follow [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for comprehensive testing.

## 🚀 Deploy to Production

Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step deployment to Vercel.

## 🐛 Troubleshooting

**Issue**: "Failed to generate pitch"

- Check Anthropic API key is valid
- Check server logs for errors
- Verify contact exists in database

**Issue**: "Contact not found"

- Verify you're signed in
- Check contact belongs to your user account
- Clear browser cache and try again

**Issue**: Stripe checkout fails

- Verify Stripe keys are correct in `.env.local`
- Check price IDs match Stripe dashboard
- Ensure using test card (4242 4242 4242 4242)

## 📚 Documentation

- **[V1_DEPLOYMENT_SUMMARY.md](V1_DEPLOYMENT_SUMMARY.md)**- Complete v1 overview
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**- Production deployment guide
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)**- Comprehensive testing
- **[STRIPE_SETUP.md](STRIPE_SETUP.md)**- Stripe configuration

## 🎉 Ready for V1!

All systems operational. Follow the testing checklist, then deploy to Vercel when ready.

**Questions?**Check the deployment guide or server logs.
