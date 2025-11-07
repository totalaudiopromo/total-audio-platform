# Stripe Pricing Setup for Pitch Generator

## Products to Create in Stripe Dashboard

### 1. Pitch Generator - PRO

- **Product Name**: Pitch Generator PRO
- **Description**: Unlimited AI-powered pitch generation for solo artists and radio promoters
- **Pricing**: £14/month recurring
- **Features to list**:
  - Unlimited pitch generation
  - 3 subject line variations per pitch
  - Voice profile customisation
  - Contact database integration
  - Priority support

### 2. Pitch Generator - AGENCY

- **Product Name**: Pitch Generator AGENCY
- **Description**: Unlimited pitch generation with team features for PR agencies
- **Pricing**: £49/month recurring
- **Features to list**:
  - Everything in PRO
  - Team collaboration (coming soon)
  - Bulk pitch generation
  - Advanced analytics (coming soon)
  - White-label options (coming soon)
  - Dedicated support

### 3. Free Tier (No Stripe Product Required)

- **5 pitches/month** - Managed in app database
- No payment required
- Great for testing and demos

## Steps to Create in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"
3. For **PRO tier**:
   - Name: "Pitch Generator PRO"
   - Description: "Unlimited AI-powered pitch generation"
   - Pricing: Recurring, Monthly, £14.00 GBP
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_`)

4. For **AGENCY tier**:
   - Name: "Pitch Generator AGENCY"
   - Description: "Unlimited pitch generation with team features"
   - Pricing: Recurring, Monthly, £49.00 GBP
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_`)

5. Update `.env.local` with the new Price IDs:
   ```env
   STRIPE_PRICE_PRO_MONTHLY="price_xxxxxxxxxxxxx"
   STRIPE_PRICE_AGENCY_MONTHLY="price_xxxxxxxxxxxxx"
   ```

## Your Current Stripe Keys

From your `.env.local`, you have:

- Test API Key: `sk_test_51Ro9faPqujcPv5fbChB8QmyJJJ4TMVhdBem30918ZZLubN84sFfv2zOvBoqbHjpcsYLJHil1teOvm5WlZpwmuM0600V54zUndm`

You need to also add:

- Your actual Secret Key (for production)
- Your Publishable Key
- Webhook Secret (for payment confirmations)

These can be found at:

- https://dashboard.stripe.com/test/apikeys (for test mode)
- https://dashboard.stripe.com/apikeys (for live mode)
