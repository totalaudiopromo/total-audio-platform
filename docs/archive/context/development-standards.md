# Total Audio Promo - Development Standards

## 🎯 Development Philosophy

### Core Principles

- **Audio-First Design**: Every component considers the Audio character integration
- **Speed Without Compromise**: Rapid development while maintaining professional quality
- **Ecosystem Thinking**: Components work across all tools, not just single implementations
- **User Experience Excellence**: Every interaction delights and drives results

### AI-Powered Development Workflow

- **Claude Code**: Primary IDE for architectural decisions and complex features
- **Cursor**: Targeted improvements, refactoring, and specific component work
- **V0**: Rapid UI prototyping and design iteration
- **CodeRabbit**: Automated code reviews and quality assurance

---

## 📁 Project Structure Standards

### Monorepo Organization

```
total-audio-ecosystem/
├── apps/
│   ├── intel/                 # Audio Intel (intel.totalaudiopromo.com)
│   ├── pulse/                 # Playlist Pulse (pulse.totalaudiopromo.com)
│   ├── radar/                 # Release Radar (radar.totalaudiopromo.com)
│   ├── track/                 # Trend Track (track.totalaudiopromo.com)
│   ├── clone/                 # Content Clone (clone.totalaudiopromo.com)
│   └── predict/               # Success Predict (predict.totalaudiopromo.com)
├── packages/
│   ├── ui/                    # Shared component library
│   ├── audio-brand/           # Audio character components
│   ├── config/                # Shared configuration
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript type definitions
├── libs/
│   ├── database/              # Prisma schema and utilities
│   ├── auth/                  # Authentication logic
│   └── integrations/          # API integrations
└── docs/
    ├── context/               # Claude Code context files
    ├── api/                   # API documentation
    └── guides/                # Development guides
```

### Individual App Structure

```
apps/intel/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication routes
│   │   ├── dashboard/        # Main app routes
│   │   ├── api/              # API endpoints
│   │   └── globals.css       # Global styles
│   ├── components/           # App-specific components
│   │   ├── enrichment/       # Contact enrichment UI
│   │   ├── contacts/         # Contact management
│   │   └── analytics/        # Analytics dashboard
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── styles/               # Component styles
│   └── types/                # App-specific types
├── public/                   # Static assets
├── prisma/                   # Database schema
└── package.json
```

---

## 🎨 Component Standards

### Audio Brand Component Architecture

```typescript
// packages/audio-brand/src/AudioCharacter.tsx
interface AudioCharacterProps {
  tool: 'intel' | 'pulse' | 'radar' | 'track' | 'clone' | 'predict';
  state: 'idle' | 'working' | 'success' | 'celebration' | 'thinking';
  size: 'sm' | 'md' | 'lg';
  position?: 'header' | 'sidebar' | 'floating' | 'inline';
  onClick?: () => void;
  className?: string;
}

// Usage Example
<AudioCharacter
  tool="intel"
  state="working"
  size="md"
  position="header"
/>
```

### Shared UI Components

```typescript
// packages/ui/src/components/
├── BrandButton.tsx           # Tool-themed buttons
├── BrandCard.tsx             # Consistent card layouts
├── ColorActivation.tsx       # B&W to color transitions
├── LoadingState.tsx          # Audio-themed loading
├── SuccessAnimation.tsx      # Celebration animations
├── NavigationWrapper.tsx     # Cross-tool navigation
├── DashboardLayout.tsx       # Standard layout
└── index.ts                  # Export all components
```

### Component Naming Conventions

- **PascalCase** for component names: `AudioCharacter`, `BrandButton`
- **camelCase** for props and functions: `onClick`, `handleSubmit`
- **kebab-case** for file names when multiple words: `brand-button.tsx`
- **UPPER_SNAKE_CASE** for constants: `TOOL_COLORS`, `ANIMATION_DURATION`

### Component Structure Template

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { AudioCharacter } from '@total-audio/audio-brand';

interface ComponentNameProps {
  // Props with JSDoc comments
  /** Brief description of the prop */
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function ComponentName({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: ComponentNameProps) {
  return (
    <div
      className={cn(
        // Base styles
        'relative rounded-lg border',
        // Variant styles
        {
          'bg-white border-gray-200': variant === 'default',
          'bg-red-50 border-red-200': variant === 'destructive',
        },
        // Size styles
        {
          'p-2 text-sm': size === 'sm',
          'p-4 text-base': size === 'md',
          'p-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

## 🎨 Styling Standards

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/audio-brand/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tool-specific colors
        'audio-intel': {
          50: '#E3F2FD',
          500: '#1E88E5',
          600: '#1976D2',
        },
        'playlist-pulse': {
          50: '#E8F5E8',
          500: '#43A047',
          600: '#388E3C',
        },
        'release-radar': {
          50: '#FFF3E0',
          500: '#FF9800',
          600: '#F57C00',
        },
        // Continue for all tools...
      },
      animation: {
        'color-activate': 'colorActivate 0.8s ease-in-out',
        'audio-bounce': 'audioBounce 0.6s ease-in-out',
        'success-pulse': 'successPulse 1.2s ease-in-out',
      },
      keyframes: {
        colorActivate: {
          '0%': { filter: 'grayscale(1)' },
          '100%': { filter: 'grayscale(0)' },
        },
        audioBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        successPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### CSS Organization

```css
/* globals.css structure */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base layer - Reset and foundations */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      'rlig' 1,
      'calt' 1;
  }
}

/* Components layer - Reusable patterns */
@layer components {
  .audio-card {
    @apply rounded-lg border bg-white p-6 shadow-sm;
  }

  .tool-button {
    @apply inline-flex items-center justify-center rounded-md px-4 py-2 
           text-sm font-medium transition-colors focus-visible:outline-none 
           focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50;
  }

  .color-activation {
    @apply transition-all duration-[800ms] ease-in-out;
    filter: grayscale(1);
  }

  .color-activation.active {
    filter: grayscale(0);
  }
}

/* Utilities layer - Single-purpose helpers */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 📝 TypeScript Standards

### Type Organization

```typescript
// packages/types/src/index.ts
export * from './user';
export * from './tools';
export * from './analytics';
export * from './api';

// packages/types/src/tools.ts
export type ToolType =
  | 'audio-intel'
  | 'playlist-pulse'
  | 'release-radar'
  | 'trend-track'
  | 'content-clone'
  | 'success-predict';

export interface Tool {
  id: ToolType;
  name: string;
  description: string;
  color: string;
  icon: string;
  features: string[];
  pricing: PricingTier[];
}

export interface AudioCharacterState {
  tool: ToolType;
  activity: 'idle' | 'working' | 'success' | 'celebration' | 'thinking';
  pose: string;
  colorActivation: boolean;
  animationDuration: number;
}
```

### Strict TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@total-audio/ui": ["../../packages/ui/src"],
      "@total-audio/audio-brand": ["../../packages/audio-brand/src"],
      "@total-audio/types": ["../../packages/types/src"]
    },
    // Strict type checking
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## 🧪 Testing Standards

### Testing Framework Setup

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@total-audio/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/*.(test|spec).(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!src/**/*.d.ts', '!src/test/**/*'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Component Testing Template

```typescript
// src/components/__tests__/AudioCharacter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AudioCharacter } from '@total-audio/audio-brand';

describe('AudioCharacter', () => {
  const defaultProps = {
    tool: 'intel' as const,
    state: 'idle' as const,
    size: 'md' as const,
  };

  it('renders with correct tool styling', () => {
    render(<AudioCharacter {...defaultProps} />);

    const character = screen.getByTestId('audio-character');
    expect(character).toHaveClass('tool-intel');
  });

  it('activates color on state change', () => {
    const { rerender } = render(<AudioCharacter {...defaultProps} />);

    rerender(
      <AudioCharacter {...defaultProps} state="working" />
    );

    const character = screen.getByTestId('audio-character');
    expect(character).toHaveClass('color-activation', 'active');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <AudioCharacter {...defaultProps} onClick={handleClick} />
    );

    await user.click(screen.getByTestId('audio-character'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Testing Template

```typescript
// src/app/api/__tests__/contacts.test.ts
import { POST } from '../contacts/enrich/route';
import { NextRequest } from 'next/server';

describe('/api/contacts/enrich', () => {
  it('enriches contact successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/contacts/enrich', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      email: 'test@example.com',
      enrichedData: expect.any(Object),
    });
  });

  it('handles invalid email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/contacts/enrich', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

---

## 🔧 Code Quality Standards

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    "prefer-const": "off",
    "react-hooks/exhaustive-deps": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

---

## 📊 Performance Standards

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Size Limits

```javascript
// next.config.js
module.exports = {
  experimental: {
    bundlePagesRouterDependencies: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },
};
```

### Performance Monitoring

```typescript
// lib/analytics.ts
export function trackPerformance(metricName: string, value: number) {
  // Send to PostHog or analytics service
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('performance_metric', {
      metric: metricName,
      value,
      url: window.location.pathname,
    });
  }
}

// Usage in components
useEffect(() => {
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        trackPerformance('lcp', entry.startTime);
      }
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint'] });

  return () => observer.disconnect();
}, []);
```

---

## 🚀 Deployment Standards

### Environment Configuration

```bash
# .env.example
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""

# AI Services
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
PERPLEXITY_API_KEY=""

# Music APIs
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""

# Tool-specific configs
AUDIO_INTEL_CONFIG=""
PLAYLIST_PULSE_CONFIG=""
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript checks
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:ci

      - name: Build application
        run: npm run build

      - name: Run bundle analysis
        run: npm run analyze

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

      - name: Run post-deployment tests
        run: npm run test:e2e
        env:
          TEST_URL: ${{ steps.deploy.outputs.preview-url }}

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📋 Code Review Standards

### Pull Request Template

```markdown
## Summary

Brief description of changes and motivation

## Changes Made

- [ ] Feature implementation
- [ ] Bug fixes
- [ ] Performance improvements
- [ ] Documentation updates

## Audio Character Integration

- [ ] Character state properly managed
- [ ] Color activation working correctly
- [ ] Animations smooth and professional
- [ ] Tool-specific poses implemented

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Screenshots/Videos

[Include screenshots of Audio character states and animations]

## Deployment Notes

- [ ] Environment variables updated
- [ ] Database migrations included
- [ ] Third-party service changes noted

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Documentation updated
```

### Review Criteria

1. **Audio Brand Consistency**: Does the code maintain Audio character integration standards?
2. **Cross-Tool Compatibility**: Will this work across all tools in the ecosystem?
3. **Performance Impact**: Does this maintain our Core Web Vitals targets?
4. **Type Safety**: Are all TypeScript types properly defined and used?
5. **Test Coverage**: Are critical paths covered by tests?
6. **Accessibility**: Does this maintain WCAG 2.1 AA compliance?

---

## 🔒 Security Standards

### Input Validation

```typescript
// lib/validation.ts
import { z } from 'zod';

export const contactEnrichmentSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1).max(100).optional(),
  company: z.string().max(100).optional(),
});

export const playlistAnalysisSchema = z.object({
  playlistUrl: z.string().url('Invalid playlist URL'),
  trackInfo: z.object({
    title: z.string().min(1).max(200),
    artist: z.string().min(1).max(100),
    genre: z.string().max(50).optional(),
  }),
});

// Usage in API routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactEnrichmentSchema.parse(body);

    // Process validated data...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Rate Limiting Implementation

```typescript
// lib/rate-limit.ts
import { redis } from './redis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (request: NextRequest) => string;
}

export async function rateLimit(request: NextRequest, config: RateLimitConfig): Promise<boolean> {
  const key = config.keyGenerator(request);
  const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / config.windowMs)}`;

  const current = await redis.incr(windowKey);

  if (current === 1) {
    await redis.expire(windowKey, Math.ceil(config.windowMs / 1000));
  }

  return current <= config.maxRequests;
}

// Usage in API middleware
export async function middleware(request: NextRequest) {
  const isAllowed = await rateLimit(request, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyGenerator: req => req.ip || 'anonymous',
  });

  if (!isAllowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  return NextResponse.next();
}
```

### Environment Security

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

export const env = envSchema.parse(process.env);

// Usage
import { env } from '@/lib/env';
// env.OPENAI_API_KEY is now type-safe and validated
```

---

## 📱 Mobile Development Standards

### Responsive Breakpoints

```typescript
// lib/breakpoints.ts
export const breakpoints = {
  sm: 640, // Mobile
  md: 768, // Tablet
  lg: 1024, // Desktop
  xl: 1280, // Large desktop
  '2xl': 1536, // Extra large desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Custom hook for responsive behavior
export function useBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(min-width: ${breakpoints[breakpoint]}px)`;
    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}
```

### Touch-Friendly Interactions

```css
/* Mobile-specific styles */
@media (max-width: 768px) {
  .audio-character {
    /* Larger touch target */
    min-width: 44px;
    min-height: 44px;

    /* Touch feedback */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .tool-button {
    /* Minimum 44px touch target */
    min-height: 44px;
    padding: 12px 16px;
  }

  /* Prevent zoom on input focus */
  input,
  select,
  textarea {
    font-size: 16px;
  }
}
```

---

## 🎯 Accessibility Standards

### WCAG 2.1 AA Compliance

```typescript
// components/AccessibleButton.tsx
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AccessibleButton({
  children,
  onClick,
  ariaLabel,
  disabled = false,
  variant = 'primary',
}: AccessibleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        // Base styles with proper contrast ratios
        'inline-flex items-center justify-center rounded-md px-4 py-2',
        'text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        // Color variants with WCAG AA contrast
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500':
            variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500':
            variant === 'secondary',
        }
      )}
    >
      {children}
    </button>
  );
}
```

### Screen Reader Support

```typescript
// Audio character with accessibility
export function AudioCharacter({ tool, state, ...props }: AudioCharacterProps) {
  const getAriaLabel = () => {
    switch (state) {
      case 'working':
        return `Audio is processing your ${tool} request`;
      case 'success':
        return `${tool} task completed successfully`;
      case 'celebration':
        return `Audio is celebrating your success with ${tool}`;
      default:
        return `Audio assistant for ${tool}`;
    }
  };

  return (
    <div
      role="img"
      aria-label={getAriaLabel()}
      aria-live={state === 'success' ? 'polite' : 'off'}
      className="audio-character"
    >
      {/* SVG content with proper accessibility */}
      <svg aria-hidden="true" viewBox="0 0 200 200">
        {/* Audio character SVG paths */}
      </svg>
    </div>
  );
}
```

---

## 🔄 State Management Standards

### Zustand Store Structure

```typescript
// stores/audio-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AudioState {
  // Character state
  currentTool: ToolType;
  characterState: AudioCharacterState;

  // User interaction
  isInteracting: boolean;
  lastInteraction: Date | null;

  // Actions
  setTool: (tool: ToolType) => void;
  updateCharacterState: (state: Partial<AudioCharacterState>) => void;
  triggerCelebration: () => void;
  resetToIdle: () => void;
}

export const useAudioStore = create<AudioState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentTool: 'audio-intel',
      characterState: {
        tool: 'audio-intel',
        activity: 'idle',
        pose: 'default',
        colorActivation: false,
        animationDuration: 800,
      },
      isInteracting: false,
      lastInteraction: null,

      // Actions
      setTool: tool =>
        set(state => ({
          currentTool: tool,
          characterState: {
            ...state.characterState,
            tool,
            activity: 'idle',
          },
        })),

      updateCharacterState: newState =>
        set(state => ({
          characterState: {
            ...state.characterState,
            ...newState,
          },
        })),

      triggerCelebration: () => {
        set(state => ({
          characterState: {
            ...state.characterState,
            activity: 'celebration',
            colorActivation: true,
          },
        }));

        // Auto-reset after animation
        setTimeout(() => {
          get().resetToIdle();
        }, 2000);
      },

      resetToIdle: () =>
        set(state => ({
          characterState: {
            ...state.characterState,
            activity: 'idle',
            colorActivation: false,
          },
          isInteracting: false,
        })),
    }),
    { name: 'audio-store' }
  )
);
```

### React Query Integration

```typescript
// hooks/use-contact-enrichment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAudioStore } from '@/stores/audio-store';

export function useContactEnrichment() {
  const queryClient = useQueryClient();
  const { updateCharacterState, triggerCelebration } = useAudioStore();

  return useMutation({
    mutationFn: async (email: string) => {
      updateCharacterState({ activity: 'working', colorActivation: true });

      const response = await fetch('/api/contacts/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Enrichment failed');
      }

      return response.json();
    },
    onSuccess: data => {
      triggerCelebration();
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => {
      updateCharacterState({ activity: 'idle', colorActivation: false });
    },
  });
}
```

---

## 📚 Documentation Standards

### Component Documentation

````typescript
/**
 * AudioCharacter - The brand mascot that guides users through Total Audio tools
 *
 * Features:
 * - Tool-specific poses and animations
 * - Color activation based on user interactions
 * - Accessibility support with screen reader announcements
 * - Responsive sizing across devices
 *
 * @example
 * ```tsx
 * <AudioCharacter
 *   tool="intel"
 *   state="working"
 *   size="md"
 *   onClick={() => showHelp()}
 * />
 * ```
 */
export function AudioCharacter(props: AudioCharacterProps) {
  // Implementation...
}
````

### API Documentation

````typescript
/**
 * POST /api/contacts/enrich
 *
 * Enriches contact information using AI and external data sources
 *
 * @param email - Contact email address (required)
 * @param name - Contact name (optional)
 *
 * @returns EnrichedContact object with social profiles and preferences
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/contacts/enrich', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'curator@example.com' })
 * });
 * ```
 *
 * Rate Limits:
 * - Free tier: 10 requests/day
 * - Pro tier: 100 requests/day
 * - Agency tier: 1000 requests/day
 */
export async function POST(request: NextRequest) {
  // Implementation...
}
````

---

## 🎯 Error Handling Standards

### Global Error Boundary

```typescript
// components/ErrorBoundary.tsx
import { AudioCharacter } from '@total-audio/audio-brand';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <AudioCharacter
            tool="audio-intel"
            state="idle"
            size="lg"
          />
          <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-gray-600">
            Audio encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// lib/api-error.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): NextResponse {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  console.error('Unexpected API error:', error);

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

---

## 🚀 Performance Optimization Standards

### Image Optimization

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      className={cn('object-cover', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### Code Splitting Strategy

```typescript
// Dynamic imports for tool-specific components
const AudioIntelDashboard = dynamic(
  () => import('@/components/audio-intel/Dashboard'),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }
);

const PlaylistPulseDashboard = dynamic(
  () => import('@/components/playlist-pulse/Dashboard'),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }
);
```

---

_These development standards ensure consistent, high-quality code across the entire Total Audio ecosystem while maintaining the Audio brand experience and optimal performance._
