#!/bin/bash

# Test script for enrichment API using curl
# Usage: ./test-enrichment-curl.sh [base-url]

BASE_URL="${1:-http://localhost:3000}"
API_ENDPOINT="${BASE_URL}/api/enrich-claude"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 Audio Intel Enrichment API cURL Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "Testing: ${API_ENDPOINT}"
echo ""

# Test 1: GET status check
echo -e "${BLUE}🧪 Test 1: GET Status Check${NC}"
curl -s -X GET "${API_ENDPOINT}" | jq '.' || echo -e "${RED}✗ Failed${NC}"
echo ""

# Test 2: POST empty body
echo -e "${BLUE}🧪 Test 2: POST Empty Body (should return 400)${NC}"
curl -s -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'
echo ""

# Test 3: POST invalid contacts type
echo -e "${BLUE}🧪 Test 3: POST Invalid Contacts Type (should return 400)${NC}"
curl -s -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{"contacts": "not-an-array"}' | jq '.'
echo ""

# Test 4: POST single contact enrichment
echo -e "${BLUE}🧪 Test 4: POST Single Contact Enrichment${NC}"
curl -s -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {
        "name": "BBC Radio 6 Music",
        "email": "music@bbc.co.uk",
        "genre": "Alternative",
        "region": "UK"
      }
    ]
  }' | jq '.'
echo ""

# Test 5: POST batch enrichment (3 contacts)
echo -e "${BLUE}🧪 Test 5: POST Batch Enrichment (3 contacts)${NC}"
curl -s -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {
        "name": "BBC Radio 1",
        "email": "radio1@bbc.co.uk",
        "genre": "Pop",
        "region": "UK"
      },
      {
        "name": "BBC Radio 6 Music",
        "email": "music@bbc.co.uk",
        "genre": "Alternative",
        "region": "UK"
      },
      {
        "name": "Amazing Radio",
        "email": "info@amazingradio.com",
        "genre": "Indie",
        "region": "UK"
      }
    ]
  }' | jq '.summary, .metrics'
echo ""

# Test 6: POST contact without name
echo -e "${BLUE}🧪 Test 6: POST Contact Without Name${NC}"
curl -s -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {
        "email": "test@example.com",
        "genre": "Electronic"
      }
    ]
  }' | jq '.enriched[0] | {name, intelligence, confidence, source}'
echo ""

# Test 7: OPTIONS CORS check
echo -e "${BLUE}🧪 Test 7: OPTIONS CORS Check${NC}"
curl -s -X OPTIONS "${API_ENDPOINT}" -v 2>&1 | grep -i "access-control" || echo -e "${YELLOW}⚠ CORS headers may not be visible in this test${NC}"
echo ""

# Test 8: Response timing
echo -e "${BLUE}🧪 Test 8: Response Timing Test${NC}"
time curl -s -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {"name": "Test Contact", "email": "test@example.com"}
    ]
  }' > /dev/null
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ cURL tests complete${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
