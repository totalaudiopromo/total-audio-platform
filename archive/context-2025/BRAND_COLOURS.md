# Total Audio Platform - Brand Colours System

## 🎨 App Colour Identity

Each app in the Total Audio ecosystem has its own distinct brand colour to maintain visual identity and prevent confusion.

### Audio Intel - BLUE (`#1E88E5`)

- **Primary**: `blue-600`, `blue-500`, `blue-700`
- **Accent**: Blue gradients
- **Use Case**: Contact enrichment, database management
- **Scripts**:
  ```bash
  cd apps/audio-intel
  npm run check-colours  # Validate colours
  npm run fix-colours    # Auto-fix wrong colours
  ```

### Pitch Generator - AMBER (`#F59E0B`)

- **Primary**: `amber-500`, `amber-600`, `brand-amber`
- **Accent**: Yellow/amber gradients
- **Use Case**: AI-powered pitch writing
- **Scripts**:
  ```bash
  cd apps/pitch-generator
  npm run check-colours
  ```

### Tracker - PURPLE (`#7C3AED`)

- **Primary**: `purple-600`, `purple-500`, `purple-700`
- **Accent**: Purple/indigo gradients
- **Use Case**: Campaign tracking and analytics
- **Scripts**:
  ```bash
  cd apps/tracker
  npm run check-colours
  ```

### Command Centre - PURPLE (`#7C3AED`)

- **Primary**: `purple-600`, similar to Tracker
- **Accent**: Purple gradients
- **Use Case**: Marketing automation dashboard

---

## 🚨 Preventing Colour Bleed

### The Problem

When copy-pasting components between apps, colours from one app (e.g., purple from Tracker) can leak into another app (e.g., Audio Intel should be blue).

### The Solution

#### 1. Automated Validation (RECOMMENDED)

Each app now has colour validation scripts that run before builds:

**Audio Intel:**

```json
{
  "scripts": {
    "prebuild": "npm run check-colours",
    "check-colours": "node scripts/check-brand-colours.js",
    "fix-colours": "node scripts/fix-brand-colours.js"
  }
}
```

This means:

- ✅ Every build validates colours first
- ✅ Catches wrong colours before deployment
- ✅ Fails build if forbidden colours detected
- ✅ Auto-fix script available

#### 2. Manual Checks

Before committing, run:

```bash
npm run check-colours
```

If issues found:

```bash
npm run fix-colours
```

#### 3. Copy-Paste Protocol

When copying components between apps:

1. **Copy the component**
2. **Run colour check**: `npm run check-colours`
3. **Fix violations**: `npm run fix-colours` or manually
4. **Verify**: `npm run check-colours` again

---

## 🎯 Quick Reference

| App                 | Brand Colour | Hex       | Tailwind     | Forbidden     |
| ------------------- | ------------ | --------- | ------------ | ------------- |
| **Audio Intel**     | Blue         | `#1E88E5` | `blue-600`   | purple, amber |
| **Pitch Generator** | Amber        | `#F59E0B` | `amber-500`  | blue, purple  |
| **Tracker**         | Purple       | `#7C3AED` | `purple-600` | blue, amber   |
| **Command Centre**  | Purple       | `#7C3AED` | `purple-600` | blue, amber   |

---

## 🛠️ Implementation Details

### Colour Validators

Located in each app: `apps/[app-name]/scripts/check-brand-colours.js`

**What they check:**

- Tailwind colour classes (e.g., `purple-600`, `blue-500`)
- Hex colour codes (e.g., `#7C3AED`, `#1E88E5`)
- Gradient classes (e.g., `from-purple-`, `to-blue-`)

**What they ignore:**

- Status colours (green for success, red for error, yellow for warnings)
- Neutral colours (gray, white, black)
- Comments and documentation
- node_modules

### Auto-Fix Scripts (Audio Intel only)

Located in: `apps/audio-intel/scripts/fix-brand-colours.js`

Automatically replaces:

- `purple-*` → `blue-*`
- `amber-*` → `blue-*` (for branding, not warnings)
- Purple hex codes → Blue hex codes

---

## 📋 Testing

### Test the Validators

```bash
# Audio Intel
cd apps/audio-intel
npm run check-colours

# Pitch Generator
cd apps/pitch-generator
npm run check-colours

# Tracker
cd apps/tracker
npm run check-colours
```

### Expected Output

**Success:**

```
🎨 Checking [App] brand colours...

✅ All colours are correct! [App] is using [colour] consistently.
```

**Violations Found:**

```
❌ Found 5 forbidden colour usage(s):

📁 components/Button.tsx
   Line 42: PURPLE colour "purple-600"
   className="bg-purple-600 hover:bg-purple-700"...
```

---

## 🔧 Troubleshooting

### Build Failing Due to Colours

```bash
# Option 1: Auto-fix (Audio Intel only)
npm run fix-colours

# Option 2: Manual fix
npm run check-colours  # See violations
# Edit files manually
npm run check-colours  # Verify fixed
```

### False Positives

If a colour is legitimately needed (e.g., status indicators), add the file to `EXCEPTIONS` array in `scripts/check-brand-colours.js`:

```javascript
const EXCEPTIONS = [
  'node_modules',
  '.next',
  'components/StatusIndicator.tsx', // Add exception
];
```

---

## 📝 Maintenance

### Adding New Apps

1. Copy colour validator from similar app
2. Update `ALLOWED_COLOURS` and `FORBIDDEN_COLOURS`
3. Add `check-colours` script to `package.json`
4. Add `prebuild` hook
5. Update this document

### Updating Brand Colours

If an app's brand colour changes:

1. Update validator script in `apps/[app]/scripts/check-brand-colours.js`
2. Run `npm run check-colours` to find old colours
3. Update components manually or with script
4. Update this document

---

**Last Updated**: October 2025
**Maintained By**: Total Audio Team
