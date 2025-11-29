# TAILWIND V4 - IMPORTANT

This project uses **Tailwind CSS v4**(not v3).

## Critical Rules

### CORRECT globals.css syntax:

```css
@import 'tailwindcss';

@theme {
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  /* ... other theme variables */
}
```

### WRONG - DO NOT USE (v3 syntax):

```css
/* These will break the build */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  /* ... */
}
```

## Key Differences

- **v4 uses**`@import "tailwindcss"` (single import)
- **v4 uses**`@theme {}` for design tokens
- **v3 used**separate imports and `@layer base {}`

## If CSS breaks:

1. Check `app/globals.css` starts with `@import "tailwindcss";`
2. Check it uses `@theme {}` not `@layer base {}`
3. Restart dev server

## Package versions (package.json):

- `tailwindcss`: `^4.1.13`
- `@tailwindcss/postcss`: `^4.1.14`
- `next`: `15.5.4`

**DO NOT downgrade to Tailwind v3 without updating globals.css syntax**
