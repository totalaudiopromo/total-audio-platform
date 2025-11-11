# Audio Intel Enrichment API Documentation

## Overview

The enrichment API endpoint provides production-ready contact enrichment using IntelAgent with ClaudeEnrichmentService. It supports both single contact and batch processing with comprehensive error handling, rate limiting, and cost tracking.

**Endpoint**: `/api/enrich-claude`
**Version**: 2.0.0
**Model**: Claude 3.5 Sonnet

---

## Features

- ✅ Production-ready error handling
- ✅ Request/response timing metrics
- ✅ Cost tracking per request
- ✅ Rate limiting protection (100 requests/minute)
- ✅ CORS support for demo pages
- ✅ Batch and single contact processing
- ✅ Automatic fallback for failures
- ✅ Detailed logging and debugging

---

## Endpoints

### GET /api/enrich-claude

Get API status and documentation.

**Response**:

```json
{
  "service": "Audio Intel Contact Enrichment API",
  "version": "2.0.0",
  "status": "operational",
  "provider": {
    "name": "IntelAgent",
    "model": "Claude 3.5 Sonnet",
    "version": "1.0.0"
  },
  "pricing": {
    "costPerContact": "$0.003",
    "estimatedCostPer100": "$0.30"
  },
  "rateLimit": {
    "maxRequests": 100,
    "windowMs": 60000,
    "window": "1 minute"
  },
  "features": [...],
  "endpoints": {...},
  "requestFormat": {...},
  "responseFormat": {...}
}
```

### POST /api/enrich-claude

Enrich contact data with music industry intelligence.

**Request Body**:

```json
{
  "contacts": [
    {
      "name": "Contact Name (required)",
      "email": "contact@example.com (optional)",
      "genre": "Genre (optional)",
      "region": "UK (optional)"
    }
  ]
}
```

**Success Response** (200):

```json
{
  "success": true,
  "enriched": [
    {
      "name": "BBC Radio 6 Music",
      "email": "music@bbc.co.uk",
      "genre": "Alternative",
      "region": "UK",
      "intelligence": "BBC Radio 6 Music is a national DAB digital radio station...",
      "contactIntelligence": "BBC Radio 6 Music is a national DAB digital radio station...",
      "confidence": "High",
      "researchConfidence": "High",
      "lastResearched": "2025-01-10T12:34:56.789Z",
      "platform": "Radio Station",
      "format": "Digital/DAB",
      "coverage": "National",
      "genres": ["Alternative", "Indie", "Electronic"],
      "contactMethod": "Email submission",
      "bestTiming": "Monday-Friday 9am-5pm",
      "submissionGuidelines": "Email music@bbc.co.uk with...",
      "pitchTips": ["Focus on unique sound", "Highlight BBC sessions"],
      "reasoning": "High confidence due to official BBC domain...",
      "source": "claude",
      "processingTime": 1234
    }
  ],
  "summary": {
    "total": 1,
    "enriched": 1,
    "failed": 0,
    "cost": 0.003
  },
  "metrics": {
    "totalTime": "1.45s",
    "enrichmentTime": "1.23s",
    "averageTimePerContact": "1234ms",
    "successRate": "100%",
    "contactsPerSecond": 0.69
  },
  "provider": {
    "name": "IntelAgent",
    "model": "Claude 3.5 Sonnet",
    "version": "1.0.0"
  }
}
```

### OPTIONS /api/enrich-claude

CORS preflight check.

**Response**: 200 OK with CORS headers

---

## Error Responses

### 400 Bad Request - Empty Contacts

```json
{
  "success": false,
  "error": "No contacts provided",
  "code": "EMPTY_CONTACTS",
  "summary": {
    "total": 0,
    "enriched": 0,
    "failed": 0,
    "cost": 0
  }
}
```

### 400 Bad Request - Invalid JSON

```json
{
  "success": false,
  "error": "Invalid JSON in request body",
  "code": "INVALID_JSON"
}
```

### 400 Bad Request - Invalid Contacts Type

```json
{
  "success": false,
  "error": "contacts must be an array",
  "code": "INVALID_CONTACTS_TYPE"
}
```

### 429 Rate Limit Exceeded

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "resetIn": 45
}
```

### 500 Missing API Key

```json
{
  "success": false,
  "error": "API key not configured",
  "code": "MISSING_API_KEY"
}
```

### 504 Timeout

```json
{
  "success": false,
  "error": "Request timeout",
  "code": "TIMEOUT",
  "elapsed": "30.00s"
}
```

### 500 Internal Error

```json
{
  "success": false,
  "error": "Enrichment processing failed",
  "code": "INTERNAL_ERROR",
  "elapsed": "1.23s"
}
```

---

## Rate Limiting

The API implements in-memory rate limiting per IP address:

- **Limit**: 100 requests per minute
- **Window**: Rolling 60-second window
- **Reset**: Automatic after window expiry
- **Headers**: Rate limit info in error response

**Note**: For production, consider Redis-based rate limiting for distributed systems.

---

## Cost Tracking

The API tracks estimated costs for Claude API usage:

- **Cost per contact**: ~$0.003 USD
- **Cost per 100 contacts**: ~$0.30 USD
- **Model**: Claude 3.5 Sonnet ($3/1M input tokens, $15/1M output tokens)
- **Average tokens**: ~500 tokens per contact (300 input, 200 output)

Costs are included in the response `summary.cost` field.

---

## Performance Metrics

All responses include performance metrics:

- `totalTime`: End-to-end request time
- `enrichmentTime`: Time spent in enrichment logic
- `averageTimePerContact`: Average processing time per contact
- `successRate`: Percentage of successful enrichments
- `contactsPerSecond`: Throughput metric

Individual contacts include `processingTime` in milliseconds.

---

## CORS Configuration

The API includes CORS headers for cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

This enables usage from demo pages and third-party integrations.

---

## Usage Examples

### cURL Examples

**Single contact:**

```bash
curl -X POST http://localhost:3000/api/enrich-claude \
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
  }'
```

**Batch enrichment:**

```bash
curl -X POST http://localhost:3000/api/enrich-claude \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {"name": "BBC Radio 1", "email": "radio1@bbc.co.uk"},
      {"name": "BBC Radio 6 Music", "email": "music@bbc.co.uk"},
      {"name": "Amazing Radio", "email": "info@amazingradio.com"}
    ]
  }'
```

### JavaScript/TypeScript Examples

```typescript
// Single contact enrichment
const response = await fetch('/api/enrich-claude', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contacts: [
      {
        name: 'BBC Radio 6 Music',
        email: 'music@bbc.co.uk',
        genre: 'Alternative',
        region: 'UK',
      },
    ],
  }),
});

const data = await response.json();

if (data.success) {
  console.log(`Enriched ${data.summary.enriched} contacts`);
  console.log(`Cost: $${data.summary.cost}`);
  console.log(`Time: ${data.metrics.totalTime}`);
  console.log('Enriched data:', data.enriched);
} else {
  console.error(`Error: ${data.error} (${data.code})`);
}
```

### Python Example

```python
import requests

response = requests.post(
    'http://localhost:3000/api/enrich-claude',
    json={
        'contacts': [
            {
                'name': 'BBC Radio 6 Music',
                'email': 'music@bbc.co.uk',
                'genre': 'Alternative',
                'region': 'UK'
            }
        ]
    }
)

data = response.json()

if data['success']:
    print(f"Enriched {data['summary']['enriched']} contacts")
    print(f"Cost: ${data['summary']['cost']}")
    for contact in data['enriched']:
        print(f"{contact['name']}: {contact['confidence']}")
else:
    print(f"Error: {data['error']}")
```

---

## Testing

### Automated Test Script

Run the Node.js test suite:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
node scripts/test-enrichment-api.js
```

Or with custom base URL:

```bash
API_URL=https://intel.totalaudiopromo.com node scripts/test-enrichment-api.js
```

### cURL Test Script

Run the bash test suite:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
./scripts/test-enrichment-curl.sh
```

Or with custom base URL:

```bash
./scripts/test-enrichment-curl.sh https://intel.totalaudiopromo.com
```

---

## Logging

The API includes structured logging for debugging:

**Console logs include**:

- Request IP and contact count
- Individual contact processing time and cost
- Success/failure status per contact
- Total summary with metrics

**Log format**:

```
[Enrichment API] Processing 3 contacts for 192.168.1.1
[Enrichment API] Enriched BBC Radio 6 Music (1234ms, $0.0030)
[Enrichment API] Failed to enrich Contact X: Error message (567ms)
[Enrichment API] Completed: 2/3 enriched (3.45s, $0.0060)
```

---

## Architecture

The endpoint uses a clean architecture pattern:

```
API Route (route.ts)
    ↓
IntelAgent (agents/intel/IntelAgent.ts)
    ↓
ContactFinder (agents/intel/subagents/ContactFinder.ts)
    ↓
ClaudeEnrichmentService (utils/claudeEnrichmentService.ts)
    ↓
Claude API (Anthropic SDK)
```

### Benefits:

- **Separation of concerns**: API layer handles HTTP, agents handle business logic
- **Testability**: Each layer can be tested independently
- **Observability**: Built-in logging at each layer
- **Extensibility**: Easy to add new enrichment sources

---

## Environment Variables

Required environment variables:

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Required for enrichment
```

---

## Migration Notes

### From Previous Version (1.0.0)

The updated endpoint (2.0.0) maintains backward compatibility with previous response format while adding new fields:

**New fields added**:

- `summary.cost`: USD cost tracking
- `metrics.contactsPerSecond`: Throughput metric
- `processingTime`: Per-contact timing
- `source`: Enrichment source (claude/cache/fallback/error)

**Response field compatibility**:

- Both `intelligence` and `contactIntelligence` are provided
- Both `confidence` and `researchConfidence` are provided

This ensures existing components continue to work without changes.

---

## Production Considerations

### Security

- API key stored in environment variables (never committed)
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- Error messages don't expose sensitive information

### Performance

- In-memory rate limiting (consider Redis for scale)
- Sequential processing (consider parallel for large batches)
- Cost tracking prevents budget overruns
- CORS enabled for demo/development

### Monitoring

- Structured logging for debugging
- Metrics included in every response
- Per-contact timing for bottleneck detection
- Success rate tracking

### Scaling

For production at scale, consider:

1. **Redis rate limiting**: Replace in-memory Map
2. **Parallel processing**: Process contacts in batches of 3-5
3. **Caching layer**: Implement persistent caching
4. **Queue system**: Use Bull/BullMQ for background processing
5. **Monitoring**: Add Sentry/DataDog integration

---

## Support

For issues or questions:

- **Documentation**: https://intel.totalaudiopromo.com/documentation
- **GitHub**: https://github.com/totalaudiopromo/audio-intel
- **Email**: support@totalaudiopromo.com

---

**Last Updated**: January 2025
**API Version**: 2.0.0
**IntelAgent Version**: 1.0.0
