# Vercel Environment Variables for Bundle Pricing

Add these environment variables to your Vercel deployments:

## Audio Intel (intel.totalaudiopromo.com)

```
STRIPE_PRICE_BUNDLE_MONTHLY=price_1SFz9bPqujcPv5fbx4qYJvm9
STRIPE_PRICE_BUNDLE_ANNUAL=price_1SFz9cPqujcPv5fbk266qGeh
NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_MONTHLY=price_1SFz9bPqujcPv5fbx4qYJvm9
NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_ANNUAL=price_1SFz9cPqujcPv5fbk266qGeh
```

## Pitch Generator (pitch.totalaudiopromo.com)

```
STRIPE_PRICE_BUNDLE_MONTHLY=price_1SFz9bPqujcPv5fbx4qYJvm9
STRIPE_PRICE_BUNDLE_ANNUAL=price_1SFz9cPqujcPv5fbk266qGeh
NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_MONTHLY=price_1SFz9bPqujcPv5fbx4qYJvm9
NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_ANNUAL=price_1SFz9cPqujcPv5fbk266qGeh
```

## Bundle Details

- **Product Name**: Total Audio Bundle
- **Product ID**: prod_TCNvZcVcl7W7p2
- **Monthly Price**: £29.00/month (price_1SFz9bPqujcPv5fbx4qYJvm9)
- **Annual Price**: £290.00/year (price_1SFz9cPqujcPv5fbk266qGeh) - 2 months free
- **Includes**: Audio Intel + Pitch Generator
- **Savings**: £5/month vs buying separately (£19 + £15 = £34)

## How to Add to Vercel

1. Go to your Vercel dashboard
2. Select the project (Audio Intel or Pitch Generator)
3. Go to Settings → Environment Variables
4. Add each variable for Production, Preview, and Development environments
5. Redeploy to apply changes

## Testing Locally

These variables are already added to both `.env.local` files in the repository, so bundle pricing works locally immediately.
