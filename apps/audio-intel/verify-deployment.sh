#!/bin/bash

# Audio Intel Deployment Verification Script
# Run this after deployment completes to verify everything is working

echo "🔍 Audio Intel Deployment Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SITE="https://intel.totalaudiopromo.com"

echo "📡 Testing production site: $SITE"
echo ""

# Test 1: Demo page should redirect (not 200)
echo "Test 1: Checking /demo protection..."
DEMO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE/demo")
if [ "$DEMO_STATUS" != "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - /demo is protected (Status: $DEMO_STATUS)"
else
    echo -e "${RED}❌ FAIL${NC} - /demo returned 200 (should redirect)"
    curl -I "$SITE/demo" 2>&1 | grep -E "HTTP|cache|prerender|location"
fi
echo ""

# Test 2: Dashboard should redirect (not 200)  
echo "Test 2: Checking /dashboard protection..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE/dashboard")
if [ "$DASHBOARD_STATUS" != "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - /dashboard is protected (Status: $DASHBOARD_STATUS)"
else
    echo -e "${RED}❌ FAIL${NC} - /dashboard returned 200 (should redirect)"
    curl -I "$SITE/dashboard" 2>&1 | grep -E "HTTP|cache|prerender|location"
fi
echo ""

# Test 3: Check for static prerendering (should NOT be present)
echo "Test 3: Checking for static caching..."
HEADERS=$(curl -I "$SITE/demo" 2>&1)
if echo "$HEADERS" | grep -q "x-nextjs-prerender: 1"; then
    echo -e "${RED}❌ FAIL${NC} - Page is being statically cached"
    echo "$HEADERS" | grep -E "cache|prerender"
else
    echo -e "${GREEN}✅ PASS${NC} - No static prerendering detected"
fi
echo ""

# Test 4: Signup page should be accessible
echo "Test 4: Checking /signup accessibility..."
SIGNUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/signup")
if [ "$SIGNUP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - /signup is accessible"
else
    echo -e "${RED}❌ FAIL${NC} - /signup returned $SIGNUP_STATUS"
fi
echo ""

# Test 5: Homepage should be accessible
echo "Test 5: Checking homepage..."
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/")
if [ "$HOME_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Homepage is accessible"
else
    echo -e "${RED}❌ FAIL${NC} - Homepage returned $HOME_STATUS"
fi
echo ""

# Test 6: API routes should require auth
echo "Test 6: Checking API protection..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/api/usage")
if [ "$API_STATUS" = "401" ] || [ "$API_STATUS" = "307" ] || [ "$API_STATUS" = "302" ]; then
    echo -e "${GREEN}✅ PASS${NC} - /api/usage is protected (Status: $API_STATUS)"
else
    echo -e "${YELLOW}⚠️  WARN${NC} - /api/usage returned unexpected status: $API_STATUS"
fi
echo ""

# Summary
echo "======================================"
echo "📊 Verification Complete"
echo ""
echo "Next steps:"
echo "1. If tests PASS: Audio Intel is protected and ready! ✅"
echo "2. If tests FAIL: Check Vercel deployment logs"
echo "3. Verify Supabase env vars are set in Vercel dashboard"
echo "4. If cache issues persist, clear Vercel cache or redeploy"
echo ""
echo "To test full user flow:"
echo "1. Visit $SITE"
echo "2. Click 'Start Free Beta'"
echo "3. Sign up with email"
echo "4. Verify email and access demo"
echo "5. Check usage counter shows 'X/500'"

