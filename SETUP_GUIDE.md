# 🚀 Total Audio Platform - Complete Setup Guide

*Comprehensive setup instructions for development, deployment, and maintenance*

---

## 📋 **QUICK START**

### **Prerequisites**
- Node.js (v18+)
- Docker (optional)
- Git
- Vercel CLI (for deployment)
- Notion API key (for workspace management)

### **Initial Setup**
```bash
# Clone the repository
git clone [repository-url]
cd total-audio-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development
npm run dev
```

---

## 🔧 **DEVELOPMENT SETUP**

### **Environment Variables**
Create `.env` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/total_audio_platform"

# Notion Integration
NOTION_API_KEY="your_notion_api_key"
NOTION_WORKSPACE_ID="your_workspace_id"

# AI Services
OPENAI_API_KEY="your_openai_key"
PERPLEXITY_API_KEY="your_perplexity_key"

# Email Services
GMAIL_CLIENT_ID="your_gmail_client_id"
GMAIL_CLIENT_SECRET="your_gmail_client_secret"
MAILCHIMP_API_KEY="your_mailchimp_key"

# Airtable Integration
AIRTABLE_API_KEY="your_airtable_key"
AIRTABLE_BASE_ID="your_base_id"

# Vercel Deployment
VERCEL_TOKEN="your_vercel_token"
```

### **Development Commands**
```bash
# Start all applications
npm run dev

# Start individual applications
npm run dev:audio-intel      # Audio Intel platform (port 3000)
npm run dev:command-centre   # Command Centre dashboard (port 3005)
npm run dev:playlist-pulse   # Playlist Pulse platform (port 3001)
npm run dev:web             # Main landing page (port 3002)

# Backend API
npm run dev:api             # API backend (port 3003)

# Type checking
npm run typecheck

# Build all applications
npm run build

# Run tests
npm run test
```

---

## 🚀 **DEPLOYMENT SETUP**

### **Vercel Deployment**

#### **1. Install Vercel CLI**
```bash
npm install -g vercel
vercel login
```

#### **2. Deploy Individual Applications**
```bash
# Audio Intel (Production)
cd apps/audio-intel
vercel --prod
# Configure custom domain: intel.totalaudiopromo.com

# Command Centre (Production)
cd apps/command-centre
vercel --prod
# Configure custom domain: command.totalaudiopromo.com

# Playlist Pulse (Production)
cd apps/playlist-pulse
vercel --prod
# Configure custom domain: pulse.totalaudiopromo.com

# Main Landing Page (Production)
cd apps/web
vercel --prod
# Configure custom domain: totalaudiopromo.com
```

#### **3. Environment Variables in Vercel**
Set the following environment variables in each Vercel project:
- `DATABASE_URL`
- `NOTION_API_KEY`
- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `MAILCHIMP_API_KEY`
- `AIRTABLE_API_KEY`

### **Domain Configuration**
Each app requires custom domain setup in Vercel dashboard:

| Application | Domain | Status |
|-------------|--------|--------|
| **audio-intel** | intel.totalaudiopromo.com | ✅ Configured |
| **command-centre** | command.totalaudiopromo.com | 🚧 Needs setup |
| **playlist-pulse** | pulse.totalaudiopromo.com | 🚧 Needs setup |
| **web** | totalaudiopromo.com | 🚧 Needs setup |

---

## 🤖 **AGENT SYSTEM SETUP**

### **Agent Health Check**
```bash
# Check agent system status
npm run agents:health

# Start agent orchestrator
cd tools/agents
node orchestrator.js

# Individual agent testing
node contact-agent.js
node campaign-agent.js
node music-tech-agent.js
```

### **Available Agents (23+ Specialized)**
- **Database Agent** - Database operations and migrations
- **Integration Agent** - Third-party service integrations
- **Campaign Agent** - Campaign management and analytics
- **Contact Agent** - Contact enrichment and management
- **Agency Agent** - Multi-tenant agency operations
- **Music Tech Agent** - Music technology and API integration
- **Radio Promo Agent** - Radio promotion workflows
- **Content Generation Agent** - AI-powered content creation
- **Analytics Agent** - Performance tracking and insights
- **Social Media Agent** - Social media automation

### **Agent Commands**
```bash
# Music Tech Agent
npm run agents:music-tech
npm run agents:music-analyze
npm run agents:music-search

# Growth Hacking Optimizer
node agents/growth-hacking-optimizer.js funnel [agencyId]
node agents/growth-hacking-optimizer.js experiment create

# Music Industry Strategist
node agents/music-industry-strategist.js market [sector] [market]
node agents/music-industry-strategist.js partnership [type]

# Music Marketing Mastermind
node agents/music-marketing-mastermind.js campaign
node agents/music-marketing-mastermind.js playlist
```

---

## 📊 **NOTION WORKSPACE MANAGEMENT**

### **Notion API Setup**
1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the API key to your `.env` file
4. Share your workspace with the integration

### **Workspace Management Commands**
```bash
# Audit workspace
node notion-workspace-manager.js --mode=audit

# Clean up workspace
node notion-workspace-manager.js --mode=cleanup

# Consolidate duplicates
node notion-workspace-manager.js --mode=consolidate

# Organize structure
node notion-workspace-manager.js --mode=organize

# Create master databases
node notion-workspace-manager.js --mode=create-databases

# Dry run (no changes)
node notion-workspace-manager.js --mode=cleanup --dry-run
```

### **Notion Workspace Structure**
- **📊 COMMAND CENTRE** - Daily dashboard and metrics
- **🔧 PRODUCT ECOSYSTEM** - Audio Intel, Playlist Pulse, Master Platform
- **💼 BUSINESS OPERATIONS** - Partnerships, revenue, customer feedback
- **🚀 DEVELOPMENT HUB** - Technical documentation and workflows
- **📝 CONTENT & MARKETING** - Content creation and campaigns
- **🗂️ ADMIN & RESOURCES** - Templates, archive, reference materials

---

## 🧪 **TESTING SETUP**

### **Test Commands**
```bash
# Run all tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build

# Agent system tests
npm run agents:test
```

### **Test Coverage**
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Agent functionality tests
- Mobile responsiveness tests

---

## 📱 **MOBILE OPTIMIZATION**

### **Mobile-First Design**
All applications include comprehensive mobile optimizations:
- Touch-friendly UI (44px minimum touch targets)
- Responsive grid layouts
- Mobile-first CSS with proper media queries
- Optimized typography hierarchy for small screens
- Prevention of horizontal scrolling

### **Mobile CSS Files**
- `apps/audio-intel/app/mobile-optimizations.css`
- `apps/command-centre/app/mobile-optimizations.css`
- `apps/web/src/styles/mobile-optimizations.css`

---

## 🔐 **SECURITY SETUP**

### **Security Measures**
- JWT authentication with secure token management
- Environment variable protection for sensitive data
- Rate limiting on all API endpoints
- Input validation and sanitization
- HTTPS everywhere in production

### **Data Protection**
- Multi-tenant data isolation
- Regular security updates and monitoring
- Secure handling of music industry contacts
- GDPR-compliant data management

---

## 📈 **MONITORING & MAINTENANCE**

### **Health Checks**
```bash
# System status
npm run status

# Agent health
npm run agents:health

# Database connectivity
npm run db:health

# API endpoints
npm run api:health
```

### **Logging**
- Application logs in `logs/` directory
- Error tracking and monitoring
- Performance metrics collection
- Automated alerting for critical issues

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run typecheck

# Verify environment variables
npm run env:check
```

#### **Database Issues**
```bash
# Reset database
npm run db:reset

# Run migrations
npm run db:migrate

# Check connection
npm run db:health
```

#### **Agent System Issues**
```bash
# Restart agent orchestrator
cd tools/agents
node orchestrator.js restart

# Check agent dependencies
npm run agents:deps

# Test individual agents
npm run agents:test
```

### **Performance Issues**
- Check database query performance
- Monitor API response times
- Verify CDN configuration
- Review image optimization

---

## 📚 **ADDITIONAL RESOURCES**

### **Documentation**
- `README.md` - Project overview
- `MASTER_CONTEXT_CONSOLIDATED.md` - Development context
- `CONSOLIDATION_AUDIT_REPORT.md` - File organization guide
- `docs/` - Detailed documentation

### **Useful Commands**
```bash
# Quick context recovery
npm run restore-context

# Preserve context before compacting
npm run preserve-context

# Clean up workspace
npm run cleanup

# Generate documentation
npm run docs:generate
```

---

## 🎯 **NEXT STEPS**

### **After Setup**
1. **Verify all applications** are running correctly
2. **Test agent system** functionality
3. **Configure Notion workspace** using the management tools
4. **Set up monitoring** and alerting
5. **Deploy to production** following the deployment guide

### **Ongoing Maintenance**
- **Weekly**: Run workspace cleanup
- **Monthly**: Review and update documentation
- **Quarterly**: Security audit and dependency updates
- **As needed**: Feature development and bug fixes

---

**This setup guide provides everything needed to get the Total Audio Platform running in development and production environments. Follow the steps in order for the best results.**


