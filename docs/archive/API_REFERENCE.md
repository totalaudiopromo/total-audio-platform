# Total Audio Promo - API Reference

## Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.totalaudiopromo.com/api`

## Authentication
All API requests require JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Core API Endpoints

### **Authentication**
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/logout         # User logout
POST /api/auth/refresh        # Refresh JWT token
GET  /api/auth/me            # Get current user
```

### **Users**
```
GET    /api/users            # List users (admin only)
GET    /api/users/:id        # Get user by ID
PUT    /api/users/:id        # Update user
DELETE /api/users/:id        # Delete user (admin only)
POST   /api/users/invite     # Invite user to agency
```

### **Agencies**
```
GET    /api/agencies         # List agencies (admin only)
GET    /api/agencies/:id     # Get agency details
POST   /api/agencies         # Create agency
PUT    /api/agencies/:id     # Update agency
DELETE /api/agencies/:id     # Delete agency
PUT    /api/agencies/:id/branding  # Update agency branding
```

### **Artists**
```
GET    /api/artists          # List artists (filtered by agency)
GET    /api/artists/:id      # Get artist details
POST   /api/artists          # Create artist
PUT    /api/artists/:id      # Update artist
DELETE /api/artists/:id      # Delete artist
```

### **Campaigns**
```
GET    /api/campaigns        # List campaigns
GET    /api/campaigns/:id    # Get campaign details
POST   /api/campaigns        # Create campaign
PUT    /api/campaigns/:id    # Update campaign
DELETE /api/campaigns/:id    # Delete campaign
POST   /api/campaigns/:id/start    # Start campaign
POST   /api/campaigns/:id/pause    # Pause campaign
POST   /api/campaigns/:id/stop     # Stop campaign
```

### **Contacts**
```
GET    /api/contacts         # List contacts
GET    /api/contacts/:id     # Get contact details
POST   /api/contacts         # Create contact
PUT    /api/contacts/:id     # Update contact
DELETE /api/contacts/:id     # Delete contact
POST   /api/contacts/import  # Import contacts from CSV
POST   /api/contacts/enrich  # Enrich contact data
```

### **Analytics**
```
GET    /api/analytics/campaigns/:id    # Campaign analytics
GET    /api/analytics/overview        # Dashboard overview
GET    /api/analytics/contacts        # Contact engagement
GET    /api/analytics/emails          # Email performance
GET    /api/analytics/export          # Export analytics data
```

### **Reports**
```
GET    /api/reports          # List reports
GET    /api/reports/:id      # Get report details
POST   /api/reports/generate # Generate new report
DELETE /api/reports/:id      # Delete report
```

### **Integrations**
```
GET    /api/integrations     # List integrations
POST   /api/integrations/airtable/sync       # Sync Airtable data
POST   /api/integrations/mailchimp/campaign  # Create Mailchimp campaign
GET    /api/integrations/gmail/auth          # Gmail OAuth flow
POST   /api/integrations/claude/generate     # Generate content with Claude
```

### **Billing**
```
GET    /api/billing/subscription      # Get subscription details
POST   /api/billing/subscribe         # Create subscription
PUT    /api/billing/subscription      # Update subscription
POST   /api/billing/cancel           # Cancel subscription
GET    /api/billing/invoices         # List invoices
```

### **Webhooks**
```
POST   /api/webhooks/mailchimp       # Mailchimp webhook
POST   /api/webhooks/stripe          # Stripe webhook
POST   /api/webhooks/make            # Make.com webhook
```

## Specialized Services

### **Airtable Contact Enrichment**
```
POST   /api/airtable/audit                    # Audit Airtable data
POST   /api/airtable/enrich                  # Enrich contacts
POST   /api/airtable/domain-analysis         # Domain analysis
POST   /api/airtable/duplicate-removal       # Remove duplicates
POST   /api/airtable/radio-enhancement       # Enhance radio contacts
```

### **AI Services**
```
POST   /api/claude/analyze           # Analyze content with Claude
POST   /api/claude/generate          # Generate content
POST   /api/perplexity/research      # Research with Perplexity
POST   /api/agents/orchestrate       # AI agent orchestration
```

### **SEO Tools**
```
POST   /api/seo/analyze              # SEO analysis
GET    /api/seo/tools                # List available tools
POST   /api/seo/hybrid               # Hybrid SEO analysis
```

### **Curator Discovery**
```
GET    /api/curators                 # List curators
POST   /api/curators/discover        # Discover new curators
POST   /api/curators/analyze         # Analyze curator preferences
```

## Request/Response Examples

### **Create Campaign**
```typescript
POST /api/campaigns
Content-Type: application/json

{
  "name": "Summer Release Campaign",
  "artistId": "artist_123",
  "type": "EMAIL",
  "startDate": "2024-08-01T00:00:00Z",
  "endDate": "2024-08-31T23:59:59Z",
  "targetAudience": "UK Radio Stations",
  "goals": ["radio_play", "streaming_increase"]
}

Response:
{
  "id": "campaign_456",
  "name": "Summer Release Campaign",
  "status": "DRAFT",
  "createdAt": "2024-07-20T10:30:00Z",
  "artist": {
    "id": "artist_123",
    "name": "Artist Name"
  }
}
```

### **Enrich Contacts**
```typescript
POST /api/contacts/enrich
Content-Type: application/json

{
  "contactIds": ["contact_1", "contact_2"],
  "enrichmentType": "full",
  "includeResearch": true
}

Response:
{
  "jobId": "job_789",
  "status": "processing",
  "totalContacts": 2,
  "estimatedCompletion": "2024-07-20T10:35:00Z"
}
```

### **Campaign Analytics**
```typescript
GET /api/analytics/campaigns/campaign_456?timeframe=30d

Response:
{
  "campaignId": "campaign_456",
  "timeframe": "30d",
  "metrics": {
    "emailsSent": 150,
    "opensCount": 75,
    "clicksCount": 15,
    "repliesCount": 8,
    "openRate": 50.0,
    "clickRate": 10.0,
    "replyRate": 5.3
  },
  "engagement": {
    "highEngagement": 12,
    "mediumEngagement": 28,
    "lowEngagement": 35,
    "noEngagement": 75
  },
  "topContacts": [
    {
      "contactId": "contact_1",
      "name": "Radio Station Manager",
      "engagementScore": 95
    }
  ]
}
```

## Error Handling

### **Standard Error Response**
```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "requestId": "req_123456"
}
```

### **HTTP Status Codes**
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **422**: Validation Error
- **429**: Rate Limited
- **500**: Internal Server Error

## Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per window
- **Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination
List endpoints support pagination:
```
GET /api/contacts?page=2&limit=20&sort=createdAt&order=desc

Response:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Filtering & Search
```
GET /api/contacts?search=radio&type=station&country=UK&active=true
```

## Webhooks

### **Webhook Security**
All webhooks include signature verification:
```
X-Webhook-Signature: sha256=<signature>
```

### **Webhook Events**
- `campaign.started`
- `campaign.completed`
- `email.opened`
- `email.clicked`
- `contact.replied`
- `subscription.updated`

---

## Development Notes

### **Testing**
- Use Postman collection: `/docs/postman/`
- Test environment: `http://localhost:3001/api`
- Include JWT token in all requests

### **Documentation**
- OpenAPI spec: `/docs/openapi.json`
- Interactive docs: `/docs/api`
- Postman collection: Available in repo

### **Environment Variables**
See `.env.example` for required configuration.