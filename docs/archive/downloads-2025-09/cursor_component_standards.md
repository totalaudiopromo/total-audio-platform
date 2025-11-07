# Total Audio Promo - Component Standards for Cursor

## 🎨 Audio Brand Component System

### Core Component Architecture

```typescript
// Brand-consistent component naming and structure
packages/
├── ui/                    # Shared component library
│   ├── BrandButton.tsx   # Tool-themed buttons
│   ├── BrandCard.tsx     # Consistent card layouts
│   ├── LoadingState.tsx  # Audio-themed loading
│   └── index.ts          # Export all components
├── audio-brand/          # Audio character components
│   ├── AudioCharacter.tsx
│   ├── ColorActivation.tsx
│   └── SuccessAnimation.tsx
└── types/                # TypeScript definitions
    ├── audio.ts
    ├── user.ts
    └── index.ts
```

### Component Template Structure

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Component({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: ComponentProps) {
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

## 🎯 Audio Character Integration

### Character State Management

```typescript
interface AudioCharacterState {
  tool: 'intel' | 'pulse' | 'radar' | 'track' | 'clone' | 'predict';
  activity: 'idle' | 'working' | 'success' | 'celebration' | 'thinking';
  pose: string;
  colorActivation: boolean;
  animationDuration: number;
}

// Zustand store for character state
export const useAudioStore = create<AudioState>()((set, get) => ({
  currentTool: 'intel',
  characterState: {
    tool: 'intel',
    activity: 'idle',
    pose: 'default',
    colorActivation: false,
    animationDuration: 800,
  },

  setTool: tool =>
    set(state => ({
      currentTool: tool,
      characterState: {
        ...state.characterState,
        tool,
        activity: 'idle',
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

    setTimeout(() => {
      get().resetToIdle();
    }, 2000);
  },
}));
```

### Tool-Specific Character Poses

```typescript
const audioAnimations = {
  intel: {
    idle: 'sitting with headphones',
    working: 'focused analysis expression',
    success: 'headphones glow blue',
    celebration: 'brief blue animation',
  },
  pulse: {
    idle: 'creative writing pose',
    working: 'thoughtful pitch creation',
    success: 'notepad glows green',
    celebration: 'writing success animation',
  },
  radar: {
    idle: 'campaign strategist pose',
    working: 'coordinating multiple screens',
    success: 'orange timeline activation',
    celebration: 'campaign launch animation',
  },
};
```

## 🎨 Styling Standards

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
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
      },
    },
  },
};
```

### CSS Organization

```css
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
```

## 📝 TypeScript Standards

### Strict Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Type Organization

```typescript
// types/tools.ts
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
  features: string[];
  pricing: PricingTier[];
}

// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';
  toolAccess: ToolType[];
  usageLimits: Record<ToolType, number>;
}
```

## 🧪 Testing Standards

### Component Testing Template

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AudioCharacter } from '../AudioCharacter';

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

    rerender(<AudioCharacter {...defaultProps} state="working" />);

    const character = screen.getByTestId('audio-character');
    expect(character).toHaveClass('color-activation', 'active');
  });
});
```

### API Testing Template

```typescript
import { POST } from '../api/contacts/enrich/route';
import { NextRequest } from 'next/server';

describe('/api/contacts/enrich', () => {
  it('enriches contact successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/contacts/enrich', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      email: 'test@example.com',
      enrichedData: expect.any(Object),
    });
  });
});
```

## 🚀 Performance Standards

### Core Web Vitals Targets

- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds
- **CLS**: < 0.1

### Code Splitting

```typescript
// Dynamic imports for tool-specific components
const AudioIntelDashboard = dynamic(() => import('@/components/audio-intel/Dashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false,
});
```

## 🔧 Code Quality

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

### Naming Conventions

- **PascalCase**: Component names (`AudioCharacter`, `BrandButton`)
- **camelCase**: Props and functions (`onClick`, `handleSubmit`)
- **kebab-case**: File names (`brand-button.tsx`)
- **UPPER_SNAKE_CASE**: Constants (`TOOL_COLORS`, `API_ENDPOINTS`)

## 📱 Responsive Design

### Breakpoint Strategy

```css
.audio-character {
  width: 100px; /* Mobile */
  height: 100px;
}

@media (min-width: 768px) {
  .audio-character {
    width: 150px; /* Tablet */
    height: 150px;
  }
}

@media (min-width: 1024px) {
  .audio-character {
    width: 200px; /* Desktop */
    height: 200px;
  }
}
```

## 🔒 Security Standards

### Input Validation

```typescript
import { z } from 'zod';

export const contactEnrichmentSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1).max(100).optional(),
  company: z.string().max(100).optional(),
});

// Usage in API routes
const validatedData = contactEnrichmentSchema.parse(body);
```

## 🎯 Development Workflow

### Git Strategy

```bash
# Branch naming
feature/audio-intel-dashboard
bugfix/color-activation-timing
hotfix/api-rate-limiting

# Commit format
feat: add Audio character color activation
fix: resolve API timeout handling
docs: update component documentation
```

### Pre-commit Hooks

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```
