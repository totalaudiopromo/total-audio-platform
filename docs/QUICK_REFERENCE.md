# Total Audio Promo - Quick Reference Guide

##  Development Commands

### **Start Services**
```bash
npm run dev                    # Start all services
npm run dev:audio-intel        # Audio Intel app (port 3000)
npm run dev:playlist-pulse     # Playlist Pulse app (port 3001)
npm run dev:backend           # Backend API (port 3004)
```

### **Build & Test**
```bash
npm run build                 # Build all applications
npm run test                  # Run all tests
npm run typecheck            # Type checking
npm run lint                 # Code linting
```

### **Database**
```bash
npm run db:migrate           # Run migrations
npm run db:seed              # Seed with sample data
npm run db:reset             # Reset database (CAUTION)
npm run db:generate          # Generate Prisma client
```

### **AI Agents**
```bash
npm run agents:setup         # Initialize agents
npm run agents:health        # Check agent status
npm run agents:workflows     # Run orchestrator
npm run agents:test          # Test functionality
```

##  Environment Configuration

### **Required Environment Variables**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/total_audio_promo"
REDIS_URL="redis://localhost:6379"

# AI Services
ANTHROPIC_API_KEY="your-claude-api-key"
PERPLEXITY_API_KEY="your-perplexity-api-key"

# Third-party Integrations
AIRTABLE_API_KEY="your-airtable-api-key"
AIRTABLE_BASE_ID="your-base-id"
MAILCHIMP_API_KEY="your-mailchimp-api-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"

# Gmail Integration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Security
JWT_SECRET="your-super-secret-jwt-key"
```

##  Project Structure

```
total-audio-promo/
 apps/                     # Applications
    api/                  # Backend API (port 3004)
    web/                  # Main dashboard
    audio-intel/          # Audio Intel tool (port 3000)
    playlist-pulse/       # Playlist Pulse tool (port 3001)
    mobile/               # Mobile app
 packages/shared/          # Shared components
 tools/agents/             # AI agents
 docs/                     # Documentation
 config/                   # Configuration files
```

##  Service URLs

### **Development**
- Audio Intel: http://localhost:3000
- Playlist Pulse: http://localhost:3001
- Backend API: http://localhost:3004
- API Docs: http://localhost:3004/docs
- Prisma Studio: http://localhost:5555

### **Health Checks**
```bash
curl http://localhost:3004/health              # API health
curl http://localhost:3004/health/db           # Database
curl http://localhost:3004/health/integrations # Third-party services
```

##  API Endpoints

### **Authentication**
```bash
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/refresh        # Refresh JWT token
GET  /api/auth/profile        # User profile
```

### **Campaigns**
```bash
GET    /api/campaigns         # List campaigns
POST   /api/campaigns         # Create campaign
GET    /api/campaigns/:id     # Get campaign
PUT    /api/campaigns/:id     # Update campaign
DELETE /api/campaigns/:id     # Delete campaign
```

### **Contacts**
```bash
GET    /api/contacts          # List contacts
POST   /api/contacts          # Create contact
GET    /api/contacts/:id      # Get contact
PUT    /api/contacts/:id      # Update contact
POST   /api/contacts/import   # Import contacts
POST   /api/contacts/enrich   # Enrich contact data
```

### **Integrations**
```bash
GET  /api/integrations/status      # Integration health
POST /api/airtable/sync           # Sync Airtable
POST /api/airtable/audit          # Audit data
POST /api/mailchimp/campaign      # Create email campaign
POST /api/claude/generate         # Generate content
POST /api/perplexity/research     # Research contacts
```

##  Database Schema

### **Key Models**
```typescript
User {
  id: String @id
  email: String @unique
  role: UserRole (ARTIST, AGENCY, ADMIN)
  workspace: Workspace?
}

Workspace {
  id: String @id
  name: String
  users: User[]
  campaigns: Campaign[]
}

Campaign {
  id: String @id
  name: String
  status: CampaignStatus
  contacts: Contact[]
  analytics: Analytics[]
}

Contact {
  id: String @id
  email: String
  stationName: String?
  enrichmentData: Json?
  campaigns: Campaign[]
}
```

##  AI Agent Commands

### **Music Technology Agent**
```bash
npm run agents:music-tech          # Full music analysis
npm run agents:music-analyze       # Analyze audio files
npm run agents:music-search        # Search recommendations
npm run agents:music-performance   # Performance optimization
```

### **Marketing Agent**
```bash
npm run agents:marketing-analyze   # Analyze campaigns
npm run agents:marketing-optimize  # Optimize performance
```

### **Content Agent**
```bash
npm run agents:content-generate    # Generate content
npm run agents:content-optimize    # Optimize existing
```

##  Business Model

### **Pricing Structure**
- **Artist Plan**: £45/month + £200 setup
- **Agency Plan**: £150/month + £500 setup

### **Key Metrics**
- Campaign Success Rate
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Monthly Recurring Revenue (MRR)

##  Troubleshooting

### **Common Issues**

#### **Database Connection**
```bash
# Check PostgreSQL status
pg_ctl status

# Reset connection
npm run db:reset
```

#### **Integration Failures**
```bash
# Test integrations
curl -X GET http://localhost:3004/api/integrations/test

# Check API keys
echo $AIRTABLE_API_KEY
echo $ANTHROPIC_API_KEY
```

#### **Build Issues**
```bash
# Clean build cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Debug Mode**
```bash
# Debug all services
DEBUG=* npm run dev

# Debug specific service
DEBUG=app:* npm run dev:backend
```

##  Testing

### **Test Commands**
```bash
npm run test                   # All tests
npm run test:unit             # Unit tests
npm run test:api              # API tests
npm run test:e2e              # End-to-end tests
npm run test:coverage         # Coverage report
```

### **Test Specific Services**
```bash
npm run test:audio-intel      # Audio Intel tests
npm run test:playlist-pulse   # Playlist Pulse tests
npm run test:backend          # Backend tests
```

##  Security

### **Authentication Flow**
1. User registers/logs in
2. JWT token issued
3. Token included in API requests
4. Multi-tenant access control

### **API Security**
- JWT authentication required
- Role-based access control
- Rate limiting implemented
- HTTPS in production

##  Documentation Quick Links

### **Technical Docs**
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Development Workflows](./DEVELOPMENT_WORKFLOWS.md)

### **Business Docs**
- [Business Context](./BUSINESS_CONTEXT.md)
- [Product Requirements](../Total_Audio_Promo_Updated_PRD.md)

### **AI & Automation**
- [AI Agents Guide](./AI_AGENTS_GUIDE.md)
- [Claude Development Guide](../CLAUDE.md)

##  Getting Help

### **Development Issues**
1. Check [DEVELOPMENT_WORKFLOWS.md](./DEVELOPMENT_WORKFLOWS.md) → Troubleshooting
2. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) → Error Handling
3. Consult [API_REFERENCE.md](./API_REFERENCE.md) → Error Codes

### **Business Questions**
1. Review [BUSINESS_CONTEXT.md](./BUSINESS_CONTEXT.md)
2. Check [Total_Audio_Promo_Updated_PRD.md](../Total_Audio_Promo_Updated_PRD.md)

### **Log Files**
```bash
tail -f logs/app.log          # Application logs
tail -f logs/error.log        # Error logs
npm run logs:backend          # Backend service logs
```

---

##  Daily Workflow Checklist

### **Development Start**
- [ ] `npm run dev` to start all services
- [ ] Check service health at health endpoints
- [ ] Review any overnight errors in logs
- [ ] Check integration status dashboard

### **Before Committing**
- [ ] `npm run lint` - Code quality check
- [ ] `npm run typecheck` - Type validation
- [ ] `npm run test` - Run test suite
- [ ] `npm run build` - Verify build success

### **Deployment**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Health checks verified

---

*This quick reference is your go-to guide for daily development tasks. Bookmark this file and refer to it regularly for efficient workflow management.* 