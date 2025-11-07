# Total Audio Command Centre - Product Requirements Document

## 🎯 Executive Summary

**Product**: Total Audio Command Centre
**Version**: 2.0 Professional (Audio Intel Brand Matched)
**Platform**: Next.js 15 Web Application
**Target Users**: Business owners, managers, and stakeholders of Total Audio Promo
**Primary Goal**: Real-time business intelligence dashboard matching Audio Intel's professional design quality

## 📋 Project Overview

### Business Context

The Total Audio Command Centre is the central nervous system for Total Audio Promo's music marketing ecosystem. It provides real-time insights into business performance, customer behavior, system health, and revenue metrics using the EXACT same visual design system as Audio Intel.

### Success Metrics

- **Revenue Tracking**: Real-time MRR, ARR, and growth metrics
- **Customer Intelligence**: Live user activity and engagement analytics
- **System Performance**: Audio Intel processing speeds and success rates
- **Newsletter Analytics**: Total Audio Insider subscriber growth and engagement
- **Operational Efficiency**: Quick actions for common business tasks

## 🎨 Design Requirements (EXACT Audio Intel Match)

### Visual Standards

**Design System**: Professional texture-enhanced cards matching Audio Intel exactly

**Color Palette** (from Audio Intel globals.css):

```css
:root {
  --brand-blue: #3b82f6;
  --brand-yellow: #f59e0b;
  --background: #fafafa;
  --card: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
}

.dark {
  --background: #0f172a;
  --card: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --border: #334155;
}
```

**Typography** (Audio Intel Standard):

- **Primary Font**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif
- **Hierarchy**:
  - H1: `text-3xl font-bold` (Command Centre title)
  - H2: `text-2xl font-bold` (Section headers)
  - H3: `text-xl font-semibold` (Card titles)
  - Body: `text-base` (Metrics and content)
  - Small: `text-sm text-gray-600` (Labels and descriptions)

**Component Standards** (EXACT Audio Intel Match):

```css
/* Cards - Same as Audio Intel */
.metric-card {
  @apply texture-card bg-white rounded-2xl p-6 shadow-texture-soft;
  @apply hover:shadow-texture-elevated hover:transform hover:translate-y-[-4px];
  @apply transition-all duration-300 ease-out;
}

/* Texture System - Same as Audio Intel */
.texture-card {
  @apply relative bg-white rounded-xl shadow-texture-soft;
  @apply transition-all duration-500 ease-out;
  transform: rotate(0deg);
  will-change: transform, box-shadow;
}

.texture-card:hover {
  @apply shadow-texture-elevated;
  transform: translateY(-8px) rotate(1deg);
}

/* Shadows - Audio Intel Standard */
.shadow-texture-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.shadow-texture-elevated {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

**Texture Background** (Audio Intel Standard):

```css
/* Same texture system as Audio Intel */
.texture-luma {
  background-image: url('/textures/DRS_4K_Luma Gradient_15.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.texture-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.15;
}
```

## 🔧 Functional Requirements

### Core Features

#### 1. Real-Time Business Dashboard

**4-Card Metric Grid** (Audio Intel Style):

```typescript
interface BusinessMetrics {
  revenue: {
    mrr: number; // Monthly Recurring Revenue
    growth: number; // Month-over-month growth %
    target: number; // Monthly target (£1000)
    arr: number; // Annual Recurring Revenue
  };
  customers: {
    total: number; // Total customer count
    active: number; // Currently active users
    newToday: number; // New signups today
    churnRate: number; // Monthly churn percentage
  };
  performance: {
    contactsEnriched: number; // Total contacts processed
    processingSpeed: number; // Average seconds per contact
    successRate: number; // Success percentage
    systemStatus: 'excellent' | 'good' | 'warning' | 'critical';
  };
  newsletter: {
    subscribers: number; // Total newsletter subscribers
    openRate: number; // Average open rate %
    clickRate: number; // Average click rate %
    newToday: number; // New subscribers today
  };
}
```

**Card Layout** (Audio Intel Standard):

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <MetricCard
    title="Monthly Revenue"
    value={`£${metrics.revenue.mrr}`}
    change={`+${metrics.revenue.growth}%`}
    icon={<TrendingUp className="h-6 w-6 text-brand-blue" />}
    textureClass="texture-paper"
  />

  <MetricCard
    title="Active Users"
    value={metrics.customers.active}
    change={`${metrics.customers.newToday} today`}
    icon={<Users className="h-6 w-6 text-brand-yellow" />}
    textureClass="texture-paper-2"
  />

  <MetricCard
    title="Intel Speed"
    value={`${metrics.performance.processingSpeed}s`}
    change={`${metrics.performance.successRate}% success`}
    icon={<Zap className="h-6 w-6 text-green-500" />}
    textureClass="texture-grain"
  />

  <MetricCard
    title="Newsletter"
    value={metrics.newsletter.subscribers}
    change={`${metrics.newsletter.openRate}% open rate`}
    icon={<Mail className="h-6 w-6 text-purple-500" />}
    textureClass="texture-grain-2"
  />
</div>
```

#### 2. Live User Tracking (Audio Intel Style)

```typescript
interface LiveUser {
  id: string;
  email: string;
  name?: string;
  app: 'Audio Intel' | 'Command Centre' | 'Landing Page';
  status: 'active' | 'idle';
  lastAction: string;
  timeAgo: number; // Minutes since last activity
  contactsProcessed: number; // Session contact count
  sessionValue: number; // Estimated session value £
}
```

**Live User Display**:

```jsx
<Card className="texture-card">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Users className="h-5 w-5 text-brand-blue" />
      Live Users ({liveUsers.length})
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {liveUsers.map(user => (
        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <div>
              <p className="font-medium text-sm">{user.name || user.email}</p>
              <p className="text-xs text-gray-600">
                {user.lastAction} • {user.timeAgo}m ago
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">£{user.sessionValue}</p>
            <p className="text-xs text-gray-600">{user.contactsProcessed} contacts</p>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

#### 3. Navigation System (Audio Intel Style)

**Tab-Based Navigation**:

```jsx
<Tabs defaultValue="overview" className="w-full">
  <TabsList className="grid w-full grid-cols-4 mb-6">
    <TabsTrigger value="overview" className="flex items-center gap-2">
      <BarChart3 className="h-4 w-4" />
      Overview
    </TabsTrigger>
    <TabsTrigger value="users" className="flex items-center gap-2">
      <Users className="h-4 w-4" />
      Live Users
    </TabsTrigger>
    <TabsTrigger value="performance" className="flex items-center gap-2">
      <Zap className="h-4 w-4" />
      Performance
    </TabsTrigger>
    <TabsTrigger value="newsletter" className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      Newsletter
    </TabsTrigger>
  </TabsList>

  <TabsContent value="overview">{/* Overview Dashboard */}</TabsContent>

  <TabsContent value="users">{/* Live Users Tracking */}</TabsContent>

  <TabsContent value="performance">{/* System Performance */}</TabsContent>

  <TabsContent value="newsletter">{/* Newsletter Analytics */}</TabsContent>
</Tabs>
```

#### 4. Quick Actions Panel (Audio Intel Style)

```typescript
interface QuickAction {
  name: string;
  action: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  icon: React.ReactNode;
  handler: () => Promise<void>;
}

const quickActions: QuickAction[] = [
  {
    name: 'Send Newsletter',
    action: 'send_newsletter',
    color: 'blue',
    icon: <Mail className="h-5 w-5" />,
    handler: async () => {
      /* Implementation */
    },
  },
  {
    name: 'Optimize Intel',
    action: 'optimize_intel',
    color: 'purple',
    icon: <Zap className="h-5 w-5" />,
    handler: async () => {
      /* Implementation */
    },
  },
  {
    name: 'Export Data',
    action: 'export_data',
    color: 'green',
    icon: <Download className="h-5 w-5" />,
    handler: async () => {
      /* Implementation */
    },
  },
  {
    name: 'View Reports',
    action: 'view_reports',
    color: 'orange',
    icon: <BarChart3 className="h-5 w-5" />,
    handler: async () => {
      /* Implementation */
    },
  },
];
```

**Quick Actions Display**:

```jsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {quickActions.map((action, index) => (
    <Button
      key={action.action}
      onClick={action.handler}
      className={`texture-btn h-20 flex-col gap-2 bg-${action.color}-500 hover:bg-${action.color}-600`}
    >
      {action.icon}
      <span className="text-sm font-medium">{action.name}</span>
    </Button>
  ))}
</div>
```

## 🏗️ Technical Architecture

### Technology Stack (Audio Intel Match)

```typescript
// Frontend: Next.js 15.4+ with TypeScript
// Styling: Tailwind CSS with Audio Intel design system
// Fonts: Inter from Google Fonts (same as Audio Intel)
// State Management: React Hooks (useState, useEffect)
// API: Next.js API routes with RESTful endpoints
// Real-time Updates: 30-second polling intervals
// Performance: Server-side rendering with client hydration
```

### File Structure

```
apps/command-centre/
├── app/
│   ├── api/
│   │   ├── business-metrics/route.ts
│   │   ├── live-users/route.ts
│   │   ├── newsletter/route.ts
│   │   └── performance/route.ts
│   ├── components/
│   │   ├── MetricCard.tsx
│   │   ├── LiveUsers.tsx
│   │   ├── QuickActions.tsx
│   │   ├── Navigation.tsx
│   │   └── ui/
│   │       ├── audio-character.tsx
│   │       └── texture-overlay.tsx
│   ├── globals.css (EXACT Audio Intel copy)
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── textures/ (Audio Intel textures)
│   └── dog-logo.png (Audio Intel mascot)
├── next.config.js
├── tailwind.config.ts (Audio Intel config)
└── package.json
```

### Port Configuration

- **Development**: http://localhost:4001
- **Production**: https://command.totalaudiopromo.com

## 📊 Component Specifications

### MetricCard Component (Audio Intel Style)

```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  textureClass: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  textureClass,
  trend = 'up',
}: MetricCardProps) {
  return (
    <Card className={`texture-card ${textureClass} relative overflow-hidden`}>
      <div className="texture-overlay" />
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold mb-1">{value}</div>
        <p
          className={`text-sm ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Audio Character Integration

```tsx
// Include Audio Intel mascot exactly as in Audio Intel
import { AudioCharacter } from '@/components/ui/audio-character';

<div className="flex items-center gap-4 mb-6">
  <AudioCharacter mood="focused" size="lg" />
  <div>
    <h1 className="text-3xl font-bold gradient-text">Command Centre</h1>
    <p className="text-gray-600">Total Audio Business Intelligence</p>
  </div>
</div>;
```

### Texture Background (Audio Intel Match)

```tsx
// Same texture system as Audio Intel
import { TextureBackground } from '@/components/ui/texture-overlay';

<main className="min-h-screen relative">
  <TextureBackground variant="luma" opacity={0.15} className="fixed inset-0 z-0" />
  <div className="relative z-10 container mx-auto px-4 py-8">{/* Command Centre Content */}</div>
</main>;
```

## 🔥 API Endpoints

### Business Metrics API

```typescript
// GET /api/business-metrics
export interface BusinessMetricsResponse {
  revenue: {
    mrr: number;
    growth: number;
    target: 1000;
    arr: number;
  };
  customers: {
    total: number;
    active: number;
    newToday: number;
    churnRate: number;
  };
  performance: {
    contactsEnriched: number;
    processingSpeed: number;
    successRate: number;
    systemStatus: 'excellent' | 'good' | 'warning' | 'critical';
  };
  newsletter: {
    subscribers: number;
    openRate: number;
    clickRate: number;
    newToday: number;
  };
  lastUpdated: string;
}
```

### Live Users API

```typescript
// GET /api/live-users
export interface LiveUsersResponse {
  users: LiveUser[];
  totalActive: number;
  totalRevenue: number;
  lastUpdated: string;
}
```

## 🎯 Success Criteria

### MVP Requirements

- [ ] Application builds without errors
- [ ] Starts successfully on http://localhost:4001
- [ ] EXACT visual match to Audio Intel design quality
- [ ] All 4 navigation tabs work properly
- [ ] Professional texture cards with hover effects
- [ ] Mobile responsive design works
- [ ] All metrics display with proper formatting
- [ ] Quick actions buttons are functional
- [ ] No console errors in browser
- [ ] API endpoints return proper JSON data
- [ ] Loading states work correctly
- [ ] Audio Intel mascot integration
- [ ] Texture background system working

### Performance Criteria

- [ ] 90%+ uptime
- [ ] <3 second page load times
- [ ] 80%+ user retention after 30 days
- [ ] 5x faster than manual campaign creation
- [ ] Professional UI matching Audio Intel exactly

## 🚀 Competitive Advantage

1. **Visual Consistency**: Identical design quality to Audio Intel
2. **Music Industry Focus**: Unlike generic business dashboards
3. **Real-time Intelligence**: Live user tracking and performance metrics
4. **Texture-Enhanced UI**: Professional design system with texture overlays
5. **Mobile-First Design**: Optimized for music industry professionals on-the-go

---

**Next Steps**: Create comprehensive Cursor prompt using this PRD to build Command Centre that exactly matches Audio Intel's professional design quality and texture system.
