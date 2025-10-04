# Total Audio Promo - Design System
## Postcraft Aesthetic Standards

This document defines the visual design system for all TAP mini-tools. The aesthetic is inspired by bold, clean, print-inspired design - think modern Postcraft meets music industry edge.

---

## Core Principles

### ❌ **NEVER Use:**
- Gradients (background or text)
- Glassmorphism effects
- Backdrop blur
- Soft shadows
- Rounded corners over 16px (except buttons can be `rounded-xl`)
- Transparency/opacity on backgrounds (except for colored accent backgrounds like `bg-blue-500/20`)
- American spelling (use UK English throughout)

### ✅ **ALWAYS Use:**
- Solid colors (white, black, and brand colours)
- Bold black borders (`border-2`, `border-4`)
- Hard offset shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`)
- Clean white backgrounds
- High contrast text (black/gray on white)
- Sharp, deliberate spacing
- **UK spelling:** colour, personalised, organise, favour, etc.

---

## Color System

### Base Colors
```
White background: #FFFFFF (bg-white)
Black borders & text: #000000 (border-black, text-black)
Gray text: #4B5563 (text-gray-600)
Light gray text: #6B7280 (text-gray-500)
Dark text: #111827 (text-gray-900)
```

### Brand Colors (Tool-Specific Activation)
Each tool gets a signature color that activates on interaction:

```
Audio Intel: Electric Blue (#3b82f6 / blue-500)
Pitch Generator: Electric Blue (#3b82f6 / blue-500)
Playlist Pulse: Neon Green (#22c55e / green-500)
Release Radar: Orange/Amber (#f59e0b / amber-500)
Trend Track: Purple/Magenta (#a855f7 / purple-500)
Content Clone: Hot Pink (#ec4899 / pink-500)
Success Predict: Gold/Yellow (#eab308 / yellow-500)
```

### Semantic Colors
```
Success: #3DD68C (text-success)
Warning: #F6BD60 (text-warning)
Danger: #F25F5C (text-danger)
```

---

## Typography

### Font Stack
- **Primary:** Geist Sans (sans-serif)
- **Mono:** Geist Mono (monospace)

### Text Sizes & Weights
```
Headings: font-bold, tracking-tight
Large Title: text-3xl to text-6xl
Section Heading: text-2xl to text-3xl
Card Title: text-xl
Body: text-sm to text-base
Small/Meta: text-xs
```

### Text Colors
```
Primary heading: text-gray-900
Body text: text-gray-600
Meta/secondary: text-gray-500
Accent/links: text-blue-600
```

---

## Components

### `.glass-panel` - Primary Card Component
The main container for all content sections.

```css
.glass-panel {
  @apply rounded-2xl 
         border-4 border-black 
         bg-white 
         p-8 
         shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
         transition-all 
         hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] 
         hover:-translate-x-1 
         hover:-translate-y-1;
}
```

**Usage:**
```tsx
<div className="glass-panel px-8 py-10">
  {/* Content */}
</div>
```

---

### `.cta-button` - Primary Action Button
Bold, high-contrast button for main calls-to-action.

```css
.cta-button {
  @apply inline-flex 
         items-center justify-center 
         rounded-xl 
         border-4 border-black 
         bg-blue-500 
         px-6 py-3 
         text-sm font-bold 
         text-white 
         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
         transition-all 
         hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
         hover:-translate-x-1 
         hover:-translate-y-1 
         active:scale-95;
}
```

**Usage:**
```tsx
<button className="cta-button">
  <Sparkles className="mr-2 h-5 w-5" />
  Generate Pitch
</button>
```

---

### `.subtle-button` - Secondary Action Button
White button with black border for secondary actions.

```css
.subtle-button {
  @apply inline-flex 
         items-center justify-center 
         rounded-xl 
         border-2 border-black 
         bg-white 
         px-5 py-2.5 
         text-sm font-semibold 
         text-black 
         shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
         transition-all 
         hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
         hover:-translate-x-0.5 
         hover:-translate-y-0.5;
}
```

**Usage:**
```tsx
<Link href="/pitch/batch" className="subtle-button flex items-center gap-2">
  <Zap className="h-4 w-4" />
  Batch Mode
</Link>
```

---

### `.badge-postcraft` - Status Badge
Yellow badge for tool identification and status indicators.

```css
.badge-postcraft {
  @apply inline-flex 
         items-center gap-2 
         rounded-full 
         border-2 border-black 
         bg-yellow-300 
         px-4 py-1.5 
         text-xs font-bold 
         uppercase tracking-wide 
         text-black 
         shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
}
```

**Usage:**
```tsx
<span className="badge-postcraft">Pitch Generator</span>
```

---

## Form Inputs

All form inputs should follow this pattern:

```tsx
<input
  type="text"
  className="mt-2 w-full 
             rounded-xl 
             border border-gray-300 
             bg-white 
             px-4 py-3 
             text-gray-900 
             placeholder:text-gray-500 
             transition 
             focus:border-blue-500 
             focus:outline-none 
             focus:ring-2 
             focus:ring-blue-500/50"
  placeholder="e.g. The Midnight Sons"
/>
```

**Key attributes:**
- `rounded-xl` for soft corners
- `border border-gray-300` - thin gray border
- `bg-white` - solid white background
- `focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50` - blue focus state

---

## Icon Colors

Icons should match their context:
```tsx
// Primary brand actions
<Sparkles className="h-6 w-6 text-brand-iris" />

// Success states
<CheckCircle className="h-5 w-5 text-success" />

// Neutral/loading states
<Loader2 className="h-8 w-8 animate-spin text-brand-iris" />
```

---

## Layout Standards

### Container Max Width
```tsx
<div className="mx-auto w-full max-w-6xl">
  {/* Content */}
</div>
```

### Spacing Scale
- Small gaps: `gap-2` to `gap-4`
- Medium gaps: `gap-6` to `gap-8`
- Large gaps: `gap-10` to `gap-12`

### Grid Layouts
```tsx
// Stats grid
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

// Two-column content
<div className="grid gap-6 md:grid-cols-2">
```

---

## Template Duplication Workflow

**IMPORTANT:** This TAP SaaS template is your clean starting point. To create a new mini-tool without overwriting the template:

### Option 1: Create Tool-Specific Apps (Recommended)
Each tool gets its own app directory in the monorepo:

```
apps/
  ├── tap-saas-template/        (NEVER modify - your clean template)
  ├── pitch-generator/          (Duplicate of template, customised for Pitch Generator)
  ├── audio-intel/              (Duplicate of template, customised for Audio Intel)
  ├── playlist-pulse/           (Duplicate of template, customised for Playlist Pulse)
  └── release-radar/            (Duplicate of template, customised for Release Radar)
```

**Steps to create a new tool:**
```bash
# From your monorepo root
cd apps/
cp -r tap-saas-template pitch-generator
cd pitch-generator

# Update package.json name
# Update branding (tool name, colours, etc.)
# Deploy as separate app
```

### Option 2: Multi-Tool Single App
Keep all tools in one app but use clear routing:

```
app/
  ├── globals.css
  ├── layout.tsx
  ├── pitch-generator/    (Pitch Generator tool pages)
  ├── audio-intel/        (Audio Intel tool pages)
  ├── playlist-pulse/     (Playlist Pulse tool pages)
  └── shared/             (Shared components across tools)
```

**We recommend Option 1** - each tool as its own deployable app gives you:
- Independent deployment and versioning
- Tool-specific databases and auth
- Cleaner codebase per tool
- Easier to manage tool-specific pricing/features

---

## Directory Structure Recommendations

To keep your design system clear, organise components like this:

```
app/
  ├── globals.css           (Design system components)
  ├── layout.tsx           (Root layout with white bg)
  └── [tool-name]/         (Each mini-tool gets its own directory)

components/
  ├── ui/                  (Reusable UI primitives)
  │   ├── Button.tsx
  │   ├── Card.tsx
  │   └── Badge.tsx
  └── [shared]/           (Tool-agnostic shared components)
```

---

## Migration Checklist

When building a new mini-tool, ensure:

- [ ] Uses `.glass-panel` for all card containers
- [ ] Uses `.cta-button` for primary actions
- [ ] Uses `.subtle-button` for secondary actions
- [ ] Uses `.badge-postcraft` for tool identifiers
- [ ] All text colors use gray-scale (no white/transparency)
- [ ] Form inputs match the standard pattern
- [ ] No gradients anywhere
- [ ] No glassmorphism or backdrop-blur
- [ ] Brand color matches the tool's signature color
- [ ] Mobile responsive with proper breakpoints

---

## Example: Perfect Page Structure

```tsx
export default function ToolPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <div className="glass-panel px-8 py-6">
        <span className="badge-postcraft">Tool Name</span>
        <h1 className="mt-3 text-3xl font-bold">
          Page Title
        </h1>
        <p className="mt-2 text-gray-600">
          Clear, direct description
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                Metric Name
              </p>
              <p className="mt-3 text-3xl font-bold">42</p>
            </div>
            <div className="rounded-full bg-blue-500/20 p-3">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="cta-button">Primary Action</button>
        <button className="subtle-button">Secondary Action</button>
      </div>
    </div>
  );
}
```

---

## Questions?

This is a living document. If something doesn't fit the aesthetic, update this file and make it the standard. Keep it bold, keep it clean, keep it Postcraft.

