# COMMAND CENTRE - CLAUDE INSTRUCTIONS (September 2025)

## 🎯 COMMAND CENTRE IDENTITY

You are the development assistant for **Command Centre**, the central business intelligence and automation hub for Total Audio Promo. Command Centre serves as the operational nerve center supporting the Audio Intel customer acquisition mission through real-time analytics, business intelligence, and workflow automation.

**Core Purpose:**
- Business intelligence dashboard supporting Audio Intel revenue goals
- Multi-agent orchestration and automation platform
- Real-time analytics and performance monitoring
- Content creation and social media automation
- Solopreneur productivity and operational excellence

## 🏢 BUSINESS CONTEXT

### Role in Total Audio Ecosystem
- **Primary Function**: Support Audio Intel customer acquisition through intelligence and automation
- **Target User**: Chris Schofield (solopreneur) managing Total Audio operations
- **Key Metrics**: Operational efficiency, business insights, automation reliability
- **Success Measure**: Enables faster Audio Intel customer acquisition and business growth

### Current Business Phase
- **Status**: Supporting customer acquisition phase for Audio Intel
- **Priority**: Operational tools that directly enable revenue generation
- **Focus**: Real-time business intelligence and workflow automation
- **Constraint**: Must not distract from Audio Intel customer acquisition efforts

## 🛠️ TECHNICAL ARCHITECTURE

### Tech Stack
- **Framework**: Next.js 15.4.4 with TypeScript
- **UI**: React 19.1.0, Tailwind CSS, Lucide React icons
- **Dashboard**: Flowbite Admin Dashboard components
- **External Integrations**: Stripe, RSS Parser, Date-fns
- **Port**: Development on 3005, Production on 3000

### Development Commands
```bash
# Command Centre Development
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/command-centre
npm run dev           # Start development server (port 3005)
npm run build         # Build for production
npm run start         # Start production server (port 3000)
npm run lint          # ESLint code quality checks
npm run typecheck     # TypeScript validation
npm run test          # Currently no tests configured
```

## 📊 CORE FEATURES & CAPABILITIES

### 1. Business Intelligence Dashboard
- **Revenue Intelligence**: Predictive revenue analytics and forecasting
- **Customer Journey**: Track prospects through conversion funnel
- **Churn Prevention**: Early warning systems and retention analytics
- **CLV Prediction**: Customer lifetime value forecasting
- **Competitor Analysis**: Market intelligence and positioning

### 2. Multi-Agent Orchestration
- **Agent Dashboard**: Monitor and control 31+ JavaScript agents
- **Agent Activity Monitoring**: Real-time status and performance tracking
- **Agent Command Center**: Central control interface for automation
- **Agent Chat Interface**: Direct communication with AI agents
- **Performance Reporting**: Agent effectiveness and ROI tracking

### 3. Content Automation & Social Media
- **Newsjacking System**: Automated news monitoring and content generation
- **Social Media Scheduling**: Cross-platform content distribution
- **Content ROI Tracking**: Measure content performance and engagement
- **Social Media Templates**: Automated content generation
- **Enhanced Social Posting**: Advanced scheduling and analytics

### 4. Business Operations
- **Beta User Management**: Track and analyze beta user engagement
- **ConvertKit Integration**: Subscriber management and email automation
- **Notion Sync**: Business metrics and project management integration
- **System Status Monitoring**: Health checks and uptime tracking
- **User Location Analytics**: Geographic distribution insights

### 5. Radio Promotion Intelligence
- **Radio Promo Dashboard**: Campaign tracking and verification
- **Contact Intelligence**: Integration with Audio Intel contact data
- **Campaign Analytics**: Track radio promotion campaign performance
- **Verification Systems**: Validate contact and campaign data

## 🎨 DESIGN SYSTEM

### Visual Identity
- **Brand**: Total Audio Promo colour scheme and typography
- **Layout**: Mobile-first responsive design with desktop optimisation
- **Navigation**: Clean, professional interface with intuitive UX
- **Components**: Reusable dashboard components and widgets

### Design Assets
- **Clean Design**: `clean-design.css` - Minimalist professional styling
- **Mobile Optimisation**: `mobile-optimizations.css` - Mobile-first approach
- **Desktop Force**: `desktop-force.css` - Desktop-specific enhancements
- **Intel Design**: `intel-design.css` - Audio Intel brand integration
- **Postcraft Design**: `postcraft-design.css` - Content creation styling
- **Total Audio Brand**: `total-audio-brand.css` - Master brand guidelines

## 🔧 API ARCHITECTURE

### Business Intelligence APIs
- `/api/revenue-prediction` - Predictive revenue analytics
- `/api/revenue-forecasting` - Revenue forecasting models
- `/api/clv-prediction` - Customer lifetime value prediction
- `/api/churn-prevention` - Customer retention analytics
- `/api/customer-journey` - Conversion funnel tracking

### Content & Social APIs
- `/api/newsjacking/monitor` - News monitoring and analysis
- `/api/newsjacking/content` - Automated content generation
- `/api/social-media/schedule` - Social media posting automation
- `/api/social-content` - Content creation and management
- `/api/content-domination/newsjacking` - Advanced newsjacking features

### Agent Management APIs
- `/api/agents/orchestrator` - Multi-agent coordination
- `/api/agents/dashboard` - Agent status and monitoring
- `/api/agents/performance` - Agent performance analytics
- `/api/agents/consolidated` - Unified agent management

### Business Operations APIs
- `/api/notion/sync` - Notion workspace integration
- `/api/convertkit-subscribers` - Email subscriber management
- `/api/beta-tracker` - Beta user analytics
- `/api/business-metrics` - Core business KPI tracking

## 💼 DEVELOPMENT WORKFLOW

### Development Principles
- **Mobile-First**: All features must work excellently on mobile devices
- **Real-Time**: Live data updates and responsive user interface
- **Integration-Heavy**: Seamless connection with external services
- **Automation-Focused**: Reduce manual work for solopreneur operations
- **Analytics-Driven**: Everything measured and optimised for performance

### Code Standards
- **TypeScript**: Strict typing for all components and APIs
- **Component Architecture**: Reusable, modular React components
- **API Design**: RESTful endpoints with consistent error handling
- **Responsive Design**: Mobile-first with desktop enhancements
- **Performance**: Optimised for fast load times and smooth interactions

### File Organisation
```
apps/command-centre/
├── app/
│   ├── components/          # Reusable UI components
│   ├── api/                 # API routes and business logic
│   ├── [pages]/            # Page components (analytics, reports, etc.)
│   └── *.css               # Design system stylesheets
├── lib/                    # Shared utilities and helpers
└── public/                 # Static assets and images
```

## 🎯 DEVELOPMENT PRIORITIES

### Current Focus (Customer Acquisition Support)
1. **Business Intelligence**: Real-time analytics supporting Audio Intel sales
2. **Agent Optimisation**: Ensure agents effectively support customer acquisition
3. **Content Automation**: Streamline content creation for marketing efforts
4. **Performance Monitoring**: Track and optimise all automation systems

### Success Metrics
- **System Uptime**: 99.9% availability for critical business functions
- **Response Time**: Sub-2-second page loads for all dashboard pages
- **Agent Reliability**: 95%+ success rate for automated tasks
- **Data Accuracy**: Real-time business metrics with < 5-minute lag

## 🚨 CRITICAL CONSTRAINTS

### Business Alignment
- **No Revenue Distraction**: Command Centre must support, not compete with Audio Intel
- **Solopreneur Focus**: All features designed for single-user efficiency
- **Time-Boxed Sessions**: Maximum 2-hour development sessions
- **Customer Acquisition Priority**: All features must support customer acquisition goals

### Technical Constraints
- **Performance**: Must not slow down or interfere with Audio Intel operations
- **Reliability**: Business-critical functions must be highly reliable
- **Integration**: Seamless integration with existing Total Audio infrastructure
- **Mobile Excellence**: Full functionality on mobile devices

## 🔄 INTEGRATION ECOSYSTEM

### External Services
- **Notion**: Business metrics and project management
- **ConvertKit**: Email marketing and subscriber management
- **Stripe**: Payment processing and subscription management
- **RSS Feeds**: Content monitoring and newsjacking sources
- **Social Media APIs**: Cross-platform content distribution

### Internal Integrations
- **Audio Intel**: Customer data and business metrics
- **Agent System**: 31+ JavaScript agents for automation
- **Newsletter System**: Content creation and distribution
- **MCP Servers**: 14+ operational integrations

---

**Remember**: Command Centre exists to amplify Chris's effectiveness as a solopreneur, enabling faster Audio Intel customer acquisition through intelligent automation, real-time business insights, and streamlined operations. Every feature should reduce manual work and provide actionable intelligence that directly supports revenue generation.

**Last Updated**: September 2025
**Status**: Operational - Supporting Audio Intel Customer Acquisition
**Purpose**: Business Intelligence & Automation Hub
**Success Measure**: Enables faster customer acquisition and business growth