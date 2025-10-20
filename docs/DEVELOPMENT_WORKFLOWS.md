# Total Audio Promo - Development Workflows

## Development Environment Setup

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git

### **Quick Start**
```bash
# Clone repository
git clone <repository-url>
cd total-audio-promo

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your actual values

# Set up database
npm run db:migrate
npm run db:seed

# Start development environment
npm run dev
```

### **Environment Variables**
Copy `.env.example` to `.env` and configure:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/total_audio_promo"

# Redis
REDIS_URL="redis://localhost:6379"

# Third-party APIs
ANTHROPIC_API_KEY="your-claude-api-key"
AIRTABLE_API_KEY="your-airtable-api-key"
MAILCHIMP_API_KEY="your-mailchimp-api-key"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
```

## Project Structure Overview

```
total-audio-promo/
 apps/                     # Applications
    api/                  # Backend API
    web/                  # Main web dashboard
    audio-intel/          # Audio intelligence tool
    playlist-pulse/       # Playlist curator tool
    seo-tool/            # SEO analysis tool
    mobile/              # Mobile application
 packages/                 # Shared packages
    shared/              # UI components & utilities
 tools/                   # Development tools
    agents/              # AI agents
    scripts/             # Build scripts
    workflow/            # Workflow automation
 docs/                    # Documentation
 config/                  # Configuration files
 data/                    # Sample data
 tests/                   # Test files
```

## Development Commands

### **Core Development**
```bash
# Start all services
npm run dev

# Start individual services
npm run dev:audio-intel       # Audio Intel app (port 3000)
npm run dev:playlist-pulse    # Playlist Pulse app (port 3001)
npm run dev:backend          # Backend API (port 3004)
npm run dev:mobile           # Mobile app
```

### **Building & Testing**
```bash
# Build all applications
npm run build

# Build individual apps
npm run build:audio-intel
npm run build:playlist-pulse
npm run build:backend

# Run tests
npm run test
npm run test:audio-intel
npm run test:playlist-pulse
npm run test:backend

# Type checking
npm run typecheck
npm run typecheck:audio-intel
npm run typecheck:playlist-pulse
npm run typecheck:backend

# Linting
npm run lint
npm run lint:audio-intel
npm run lint:playlist-pulse
npm run lint:backend
```

### **Database Management**
```bash
# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Reset database (caution: deletes all data)
npm run db:reset

# Generate Prisma client
npm run db:generate
```

### **AI Agents & Tools**
```bash
# Setup AI agents
npm run agents:setup

# Check agent health
npm run agents:health

# Run agent workflows
npm run agents:workflows

# Run specific agents
npm run agents:music-tech
npm run agents:music-analyze
```

### **Maintenance**
```bash
# Clean build artifacts
npm run clean

# Clean node_modules
npm run clean:node_modules

# Install all dependencies
npm run install:all

# Check development status
npm run status
```

## Git Workflow

### **Branch Strategy**
```
main                 # Production-ready code
 develop         # Development integration branch
 feature/*       # New features
 hotfix/*        # Production fixes
 release/*       # Release preparation
```

### **Commit Convention**
```bash
# Format: type(scope): description
feat(campaigns): add email tracking functionality
fix(auth): resolve JWT token expiration issue
docs(api): update authentication documentation
refactor(contacts): optimize contact enrichment process
test(integration): add Airtable sync tests
```

### **Pull Request Process**
1. Create feature branch from `develop`
2. Implement changes with tests
3. Update documentation if needed
4. Create pull request to `develop`
5. Code review and approval
6. Merge and delete feature branch

## Code Standards

### **TypeScript Guidelines**
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` type usage
- Use proper error handling with typed exceptions

### **React/Next.js Standards**
- Use functional components with hooks
- Implement proper error boundaries
- Follow Next.js app router conventions
- Use server components where appropriate

### **Backend Standards**
- Use express.js with TypeScript
- Implement proper middleware for auth and validation
- Use Prisma for database operations
- Follow REST API conventions

### **Styling Standards**
- Use Tailwind CSS for all styling
- Follow shadcn/ui component patterns
- Maintain consistent design system
- Responsive design first approach

## Testing Strategy

### **Unit Testing**
```bash
# Run unit tests
npm run test:unit

# Coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### **Integration Testing**
```bash
# Test API endpoints
npm run test:api

# Test database operations
npm run test:db

# Test third-party integrations
npm run test:integrations
```

### **End-to-End Testing**
```bash
# Run Playwright tests
npm run test:e2e

# Run specific test suites
npm run test:e2e:auth
npm run test:e2e:campaigns
```

### **Testing Best Practices**
- Write tests for all business logic
- Mock external dependencies
- Test error handling scenarios
- Maintain high test coverage (>80%)

## Database Development

### **Schema Changes**
```bash
# Create new migration
npx prisma migrate dev --name add_campaign_analytics

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio
```

### **Seeding Development Data**
```bash
# Seed with sample data
npm run db:seed

# Create custom seed data
# Edit: apps/api/prisma/seed.ts
```

### **Database Best Practices**
- Always create migrations for schema changes
- Use descriptive migration names
- Test migrations on sample data
- Backup production data before migrations

## API Development

### **Adding New Endpoints**
1. Create route file in `apps/api/src/routes/`
2. Implement controller logic
3. Add authentication middleware
4. Update API documentation
5. Write tests for endpoints

### **Example Route Structure**
```typescript
// apps/api/src/routes/campaigns.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateCampaign } from '../middleware/validation';

const router = Router();

router.get('/', authenticate, getCampaigns);
router.post('/', authenticate, validateCampaign, createCampaign);
router.get('/:id', authenticate, getCampaign);
router.put('/:id', authenticate, validateCampaign, updateCampaign);
router.delete('/:id', authenticate, deleteCampaign);

export default router;
```

### **API Documentation**
- Update OpenAPI specification
- Include request/response examples
- Document error scenarios
- Update Postman collection

## Integration Development

### **Adding New Integrations**
1. Create service class in `apps/api/src/integrations/`
2. Implement authentication and error handling
3. Add configuration to environment variables
4. Create API endpoints for management
5. Test thoroughly with third-party service

### **Integration Template**
```typescript
// apps/api/src/integrations/new-service.ts
export class NewServiceIntegration {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEW_SERVICE_API_KEY!;
  }

  async connect(): Promise<boolean> {
    // Implementation
  }

  async syncData(): Promise<void> {
    // Implementation
  }
}
```

## Frontend Development

### **Component Development**
- Use shadcn/ui components as base
- Create custom components in `packages/shared/`
- Follow atomic design principles
- Implement proper loading and error states

### **State Management**
- Use React Query for server state
- Use React Context for global UI state
- Minimize prop drilling
- Implement optimistic updates where appropriate

### **Performance Optimization**
- Use Next.js image optimization
- Implement code splitting
- Lazy load components when appropriate
- Monitor bundle size

## Deployment Workflow

### **Development Deployment**
```bash
# Build production bundles
npm run build

# Test production build locally
npm run start

# Deploy to staging
npm run deploy:staging
```

### **Production Deployment**
1. Create release branch from `develop`
2. Update version numbers
3. Test thoroughly in staging environment
4. Create production deployment
5. Monitor application health
6. Rollback if issues detected

### **Environment Management**
- **Development**: Local development environment
- **Staging**: Pre-production testing environment  
- **Production**: Live application environment

## Monitoring & Debugging

### **Logging**
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# View specific service logs
npm run logs:backend
npm run logs:frontend
```

### **Health Checks**
```bash
# Check service health
curl http://localhost:3001/health

# Check database connection
curl http://localhost:3001/health/db

# Check integrations
curl http://localhost:3001/health/integrations
```

### **Performance Monitoring**
- Monitor API response times
- Track database query performance
- Monitor third-party integration latency
- Set up alerting for critical issues

## AI Agent Development

### **Agent Structure**
```typescript
// tools/agents/example-agent.js
class ExampleAgent {
  constructor(config) {
    this.config = config;
  }

  async execute(task) {
    // Agent implementation
  }

  async healthCheck() {
    // Health check implementation
  }
}
```

### **Agent Orchestration**
```bash
# Setup agents
npm run agents:setup

# Run orchestrator
npm run agents:workflows

# Monitor agent health
npm run agents:health
```

## Troubleshooting

### **Common Issues**

#### **Database Connection**
```bash
# Check PostgreSQL status
pg_ctl status

# Reset database connection
npm run db:reset
```

#### **Integration Failures**
```bash
# Test individual integrations
curl -X GET http://localhost:3001/api/integrations/test

# Check API keys in environment
echo $AIRTABLE_API_KEY
```

#### **Build Failures**
```bash
# Clear build cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Debug Mode**
```bash
# Start with debug logging
DEBUG=* npm run dev

# Start specific service in debug mode
DEBUG=app:* npm run dev:backend
```

---

## Quick Reference

### **Port Assignments**
- **3000**: Audio Intel Live
- **3001**: Playlist Pulse Live  
- **3004**: Backend API
- **5432**: PostgreSQL
- **6379**: Redis

### **Key Directories**
- `apps/api/src/routes/` - API endpoints
- `apps/api/src/services/` - Business logic
- `apps/api/prisma/` - Database schema
- `docs/` - Documentation
- `tools/agents/` - AI agents

### **Development URLs**
- **Audio Intel**: http://localhost:3000
- **Playlist Pulse**: http://localhost:3001
- **API**: http://localhost:3004
- **API Docs**: http://localhost:3004/docs
- **Prisma Studio**: http://localhost:5555