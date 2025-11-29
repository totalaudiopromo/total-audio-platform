# Audio Intel - API Security Audit

**Date:**2025-10-14  
**Status:**Pre-Deployment Review

---

## PROTECTED ROUTES (Middleware Authentication)

### Page Routes

```typescript
 /demo                    → Requires authentication
 /dashboard               → Requires authentication
```

### API Routes

```typescript
 /api/enrich              → Requires authentication
 /api/usage               → Requires authentication
```

**Middleware:**`middleware.ts` lines 13-32  
**Protection:**Redirects to `/signin` if user not authenticated

---

## SECURITY CONCERNS & RECOMMENDATIONS

### 1. `/api/enrich-claude` - NOT PROTECTED 

**Issue:**

- Route: `app/api/enrich-claude/route.ts`
- **NOT in middleware protected paths**
- Contains rate limiting (1000 req/min) but no auth check
- Could be exploited for free enrichments

**Recommendation:**

```typescript
// Add to middleware.ts line 20
const protectedAPIPaths = [
  '/api/enrich',
  '/api/enrich-claude', // ← Add this
  '/api/usage',
];
```

**Impact:**HIGH - This is your core enrichment API  
**Priority:**Fix before production deployment

---

### 2. `/api/checkout` - Stripe Payment Endpoint

**Current State:** Partially Secure

- Uses Stripe secret key (server-side only)
- No explicit auth check but creates Stripe session with metadata

**Recommendation:**

```typescript
// app/api/checkout/route.ts - Add at top of POST function
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // Add auth check
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... rest of checkout logic
}
```

**Impact:**MEDIUM - Could allow anonymous checkout attempts  
**Priority:**Recommended before production

---

### 3. `/api/enrich` - Protected but Check Usage Limits

**Current State:** Protected by middleware

**Verify:**Check that it enforces usage limits server-side

```typescript
// Should check:
1. User is authenticated  (via middleware)
2. User has enrichments remaining (verify in route.ts)
3. Usage is tracked after successful enrichment
```

**Recommendation:**Review `app/api/enrich/route.ts` for usage limit enforcement

---

### 4. Cron/Webhook Endpoints - Verify Security

**Unprotected Public Endpoints:**

```typescript
 /api/cron/weekly-newsletter        → Should verify Vercel cron secret
 /api/webhook/stripe (if exists)    → Should verify Stripe webhook signature
```

**Recommendation for Cron:**

```typescript
// Add to cron route
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... cron logic
}
```

**Recommendation for Stripe Webhook:**

```typescript
// Verify signature
const sig = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
```

---

### 5. Rate Limiting

**Current Implementation:**

```typescript
 /api/enrich-claude → 1000 req/min per IP + 2000 global
```

**Recommendations:**

- Lower to 10-20 req/min per user in production (currently 1000!)
- Add rate limiting to `/api/checkout`
- Consider Redis for distributed rate limiting in production

---

### 6. Test/Debug Pages -  PROTECTED

**Production Protection:**Lines 36-60 in `middleware.ts`

```typescript
 Redirects test pages to homepage in production:
  - /test*, /debug-*, /notion-*, /pdf-*, /export-demo
  - /progress-dashboard, /newsletter-dashboard, etc.
```

**Status:**SECURE 

---

## PRE-DEPLOYMENT CHECKLIST

### Critical (Must Fix)

- [ ] **Add `/api/enrich-claude` to protected middleware paths**
- [ ] **Add authentication to `/api/checkout`**
- [ ] **Verify usage limit enforcement in `/api/enrich`**
- [ ] **Lower rate limits from 1000/min to 10-20/min per user**

### Important (Recommended)

- [ ] Add Vercel cron secret verification to `/api/cron/*` routes
- [ ] Verify Stripe webhook signature handling
- [ ] Test all protected routes after middleware changes
- [ ] Add logging for failed auth attempts

### Optional (Future Enhancement)

- [ ] Implement Redis-based rate limiting
- [ ] Add request logging/monitoring (Sentry)
- [ ] CORS configuration for API routes
- [ ] API versioning strategy

---

## TESTING COMMANDS

```bash
# Test protected routes redirect
curl -I http://localhost:3000/demo
# Should: 307 redirect to /signin

# Test protected API routes
curl -X POST http://localhost:3000/api/enrich
# Should: 307 redirect or 401 Unauthorized

# Test unprotected route (CURRENT VULNERABILITY)
curl -X POST http://localhost:3000/api/enrich-claude \
  -H "Content-Type: application/json" \
  -d '{"contacts":[{"email":"test@example.com"}]}'
# Currently: Will process request (SHOULD require auth!)
```

---

## IMMEDIATE FIX REQUIRED

**File:**`middleware.ts`  
**Line:**19-22

```typescript
// BEFORE (Current - Insecure)
const protectedAPIPaths = ['/api/enrich', '/api/usage'];

// AFTER (Secure)
const protectedAPIPaths = [
  '/api/enrich',
  '/api/enrich-claude', // ← ADD THIS LINE
  '/api/usage',
  '/api/checkout', // ← ADD THIS LINE
];
```

**This change MUST be made before deploying to production.**

---

## WHAT'S ALREADY SECURE

1.  Supabase RLS (Row Level Security) on database
2.  Environment variables properly configured
3.  API keys server-side only (not exposed to client)
4.  Test pages blocked in production
5.  Middleware session management
6.  Stripe uses secret keys (server-side)
7.  Rate limiting on main enrichment endpoint

---

## References

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Stripe Webhook Security](https://stripe.com/docs/webhooks/signatures)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
