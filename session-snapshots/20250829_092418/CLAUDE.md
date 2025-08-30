# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Total Audio Promo** is a multi-tenant music promotion platform serving both independent artists and PR agencies. The platform provides automated campaign tracking, real-time analytics, and AI-powered reporting through integrations with Airtable, Mailchimp, Gmail, and Make.com.

**Key Architecture**: Multi-tenant SaaS with role-based access (Artist/Agency/Admin), real-time analytics, and comprehensive third-party integrations.

## Development Commands

### Setup & Installation
```bash
# Install all dependencies
npm install

# Set up environment
cp .env.example .env

# Database setup
cd backend
npm run db:migrate
npm run db:seed
npm run db:generate
```

### Development
```bash
# Start full development environment
npm run dev

# Start individual services
npm run dev:frontend    # Frontend only (port 3000)
npm run dev:backend     # Backend only (port 3001)
```

### Building & Testing
```bash
# Build all services
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset

# Generate Prisma client
npm run db:generate
```

### Docker Development
```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Architecture Overview

### Multi-Tenant Structure
- **Users**: Artists, agency owners, and admins with role-based access
- **Agencies**: PR agencies managing multiple artists with white-label options
- **Artists**: Can be independent or agency-managed
- **Campaigns**: Promotion campaigns with real-time analytics
- **Contacts**: Industry contacts with engagement tracking

### Technology Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + React Query
- **Backend**: Node.js + Express + PostgreSQL + Prisma + Redis
- **Integrations**: Airtable, Mailchimp, Gmail, Make.com, Claude AI
- **Auth**: JWT with role-based access control
- **Real-time**: Socket.io for live updates

### Key Business Logic
- **Pricing**: Artists (£45/month + £200 setup), Agencies (£150/month + £500 setup)
- **Brand Colors**: Primary Yellow (#f6ab00), Secondary Blue (#2538c7)
- **Multi-tenancy**: Agencies can manage multiple artists with data isolation

## Important File Locations

### Frontend Structure
- `frontend/src/components/artist/` - Artist-specific UI components
- `frontend/src/components/agency/` - Agency dashboard components
- `frontend/src/components/shared/` - Shared UI components
- `frontend/src/contexts/AuthContext.tsx` - Authentication state management
- `frontend/src/types/index.ts` - TypeScript definitions

### Backend Structure
- `backend/src/routes/` - API route definitions
- `backend/src/controllers/` - Business logic controllers
- `backend/src/middleware/auth.ts` - Authentication middleware
- `backend/src/integrations/` - Third-party service integrations
- `backend/prisma/schema.prisma` - Database schema

### Database Schema Key Models
- `User` - System users with role-based access
- `Agency` - PR agencies with branding configuration
- `Artist` - Individual artists (independent or agency-managed)
- `Campaign` - Promotion campaigns with analytics
- `Contact` - Industry contacts with engagement tracking
- `EmailCampaign` - Email campaigns with Mailchimp integration
- `Integration` - Third-party service configurations
- `Report` - AI-generated insights and recommendations

## Integration Services

### Airtable Integration (`backend/src/integrations/airtable/`)
- Syncs contacts from Airtable CRM
- Creates campaign records
- Logs interactions and analytics

### Mailchimp Integration (`backend/src/integrations/mailchimp/`)
- Creates and sends email campaigns
- Tracks email analytics (opens, clicks, replies)
- Syncs contact lists

### Gmail Integration (`backend/src/integrations/gmail/`)
- Tracks email replies in real-time
- Monitors engagement metrics
- Sends direct emails

### Claude AI Integration (`backend/src/integrations/claude/`)
- Generates campaign reports and insights
- Creates email content
- Analyzes contact engagement

## Existing Agent System

**IMPORTANT**: Total Audio Promo has 18+ specialized agents already built. DO NOT create new agents - use existing ones via orchestrator.

### Agent Location
- **Path**: `/tools/agents/`
- **Orchestrator**: `/tools/agents/orchestrator.js`
- **Deployment**: `node orchestrator.js` from tools/agents directory

### Existing Specialized Agents

#### Core Business Agents
- **`agency-agent.js`** - Agency management and white-label operations
- **`campaign-agent.js`** - Campaign creation, management, and tracking
- **`contact-agent.js`** - Contact management and enrichment
- **`analytics-agent.js`** - Performance tracking and reporting
- **`database-agent.js`** - Database operations and data management

#### Integration & Technical Agents
- **`integration-agent.js`** - Third-party service integrations
- **`integration-agent-real.js`** - Production integration handling
- **`music-tech-agent.js`** - Technical music industry operations
- **`service-wrapper.js`** - Service coordination and wrapping

#### Content & Marketing Agents
- **`content-generation-agent.js`** - Content creation and optimization
- **`social-media-agent.js`** - Social media management and posting
- **`radio-promo-agent.js`** - Radio promotion and outreach
- **`viral-content-automation.js`** - Viral content strategies

#### Strategic & Growth Agents
- **`music-industry-strategist.js`** - Industry strategy and positioning
- **`music-marketing-mastermind.js`** - Advanced marketing strategies
- **`growth-hacking-optimizer.js`** - Growth optimization and scaling

#### System Agents
- **`orchestrator.js`** - Multi-agent coordination and workflows
- **`orchestrator-real.js`** - Production orchestration
- **`setup.js`** - Agent initialization and configuration

### Usage Guidelines
1. **Always check existing agents first** before considering new functionality
2. **Use orchestrator.js** to coordinate multi-agent workflows
3. **Deploy via**: `cd tools/agents && node orchestrator.js`
4. **Configuration**: Each agent has specialized capabilities - check individual files
5. **Color Coding**: Use agent visualization system for monitoring

### Agent Capabilities
- Multi-tenant operations with data isolation
- Real-time analytics and reporting
- Third-party API integrations (Airtable, Mailchimp, Gmail)
- Content generation and optimization
- Campaign management and tracking
- Social media automation
- Music industry expertise and strategy

## Role-Based Access Control

### User Roles
- **ARTIST**: Individual artists with limited access
- **AGENCY**: Agency users managing multiple artists
- **ADMIN**: System administrators with full access

### Access Patterns
- Artists can only access their own campaigns and data
- Agency users can access all artists under their agency
- Agency owners have full control over their agency's data
- Multi-tenant data isolation is enforced at the database level

## Development Guidelines

### Code Organization
- Use TypeScript throughout the codebase
- Follow Next.js app directory structure
- Implement proper error handling and logging
- Use Prisma for all database operations
- Follow RESTful API conventions

### Testing
- Write unit tests for business logic
- Test integration endpoints
- Verify multi-tenant data isolation
- Test third-party integrations with mocks

### Security Considerations
- Implement proper JWT validation
- Enforce role-based access control
- Validate all user inputs
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints

## Environment Variables

Key environment variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `REDIS_URL` - Redis connection for job queues
- `ANTHROPIC_API_KEY` - Claude AI integration
- `MAILCHIMP_API_KEY` - Mailchimp integration
- `AIRTABLE_API_KEY` - Airtable integration
- `GOOGLE_CLIENT_ID` - Gmail integration

## Common Development Tasks

### Adding New API Endpoints
1. Create route in `backend/src/routes/`
2. Add controller logic in `backend/src/controllers/`
3. Update Prisma schema if needed
4. Add authentication middleware
5. Implement proper error handling

### Creating New UI Components
1. Add component to appropriate directory (`artist/`, `agency/`, `shared/`)
2. Follow existing component patterns
3. Use Tailwind CSS for styling
4. Implement proper TypeScript types
5. Add to component exports

### Database Schema Changes
1. Update `backend/prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Update TypeScript types
4. Update API endpoints if needed
5. Test multi-tenant data isolation

### Integration Development
1. Create service class in `backend/src/integrations/`
2. Implement authentication and error handling
3. Add configuration to Integration model
4. Create API endpoints for management
5. Test thoroughly with third-party service

## Troubleshooting

### Common Issues
- **Database connection errors**: Check DATABASE_URL and ensure PostgreSQL is running
- **Authentication failures**: Verify JWT_SECRET and token validation
- **Integration errors**: Check API keys and service configurations
- **Build failures**: Ensure all dependencies are installed and types are correct

### Debugging Tips
- Use `npm run dev` for development with hot reload
- Check browser console for frontend errors
- Review backend logs for API issues
- Use Prisma Studio for database inspection
- Test integrations with proper API credentials

## Performance Considerations

### Database Optimization
- Use proper database indexes
- Implement query optimization
- Use connection pooling
- Monitor query performance

### Frontend Performance
- Implement proper code splitting
- Use React Query for data caching
- Optimize image and asset loading
- Monitor bundle size

### API Performance
- Implement proper caching strategies
- Use Redis for session management
- Monitor API response times
- Implement rate limiting

## Deployment Notes

### Production Deployment
- Use Docker containers for consistency
- Implement proper health checks
- Set up monitoring and logging
- Use environment-specific configurations
- Implement database migrations properly

### Security in Production
- Use HTTPS everywhere
- Implement proper CORS policies
- Use secure JWT configurations
- Monitor for security vulnerabilities
- Regular security updates