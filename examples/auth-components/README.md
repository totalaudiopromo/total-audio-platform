# Example Auth Components

Pre-built React components for authentication in your Total Audio apps. These components use the `@total-audio/auth` package and are ready to copy and customise.

## Components

### SignInForm

A complete sign-in form with email/password and magic link support.

**Features:**

- Email and password authentication
- Magic link (passwordless) option
- Error handling and loading states
- Responsive design
- Tailwind CSS styling

**Usage:**

```tsx
import { SignInForm } from './components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignInForm />
    </div>
  );
}
```

### SignUpForm

A complete sign-up form with email confirmation.

**Features:**

- Full name, email, and password fields
- Email confirmation flow
- Success state with instructions
- Error handling and validation
- Responsive design

**Usage:**

```tsx
import { SignUpForm } from './components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUpForm />
    </div>
  );
}
```

### UserMenu

A dropdown menu showing user info and subscription tier.

**Features:**

- User avatar with initials
- Subscription tier display
- Navigation links (Dashboard, Settings, Profile)
- Upgrade prompt for non-bundle users
- Sign-out functionality
- Responsive (collapses on mobile)

**Usage:**

```tsx
import { UserMenu } from './components/auth/UserMenu';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1>Total Audio</h1>
        <UserMenu />
      </div>
    </header>
  );
}
```

### AppAccessGate

Restricts access to apps based on subscription tier.

**Features:**

- Checks user's subscription tier
- Shows upgrade prompt if access denied
- Loading state while checking
- Customisable fallback UI
- Automatic tier checking

**Usage:**

```tsx
import { AppAccessGate } from './components/auth/AppAccessGate';

export default function TrackerPage() {
  return (
    <AppAccessGate appName="tracker">
      {/* Your tracker app content */}
      <div>
        <h1>Campaign Tracker</h1>
        {/* ... */}
      </div>
    </AppAccessGate>
  );
}
```

**With custom fallback:**

```tsx
<AppAccessGate appName="pitch-generator" fallback={<CustomUpgradePrompt />}>
  {/* App content */}
</AppAccessGate>
```

## Customisation

### Styling

All components use Tailwind CSS classes. To customise:

1. Copy the component to your app
2. Modify the class names to match your design system
3. Keep the functionality intact

### Example: Custom Button Colors

```tsx
// Before (default blue)
<button className="bg-blue-600 hover:bg-blue-700">

// After (your brand color)
<button className="bg-amber-500 hover:bg-amber-600">
```

### Branding

Update the components to match your app:

```tsx
// In SignInForm.tsx
<h2 className="text-2xl font-bold mb-6 text-center">Sign In to Audio Intel</h2>
```

### Links

Update navigation links to match your routes:

```tsx
// In UserMenu.tsx
<a href="/dashboard">Dashboard</a>
<a href="/pricing">Upgrade Plan</a>
```

## Integration Steps

### 1. Copy Components to Your App

```bash
# Create auth components directory
mkdir -p apps/your-app/components/auth

# Copy the components
cp examples/auth-components/*.tsx apps/your-app/components/auth/
```

### 2. Create Auth Pages

```tsx
// apps/your-app/app/signin/page.tsx
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignInForm />
    </div>
  );
}
```

```tsx
// apps/your-app/app/signup/page.tsx
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUpForm />
    </div>
  );
}
```

### 3. Add Middleware

```tsx
// apps/your-app/middleware.ts
import { createMiddleware } from '@total-audio/auth/middleware';

export const middleware = createMiddleware({
  protectedRoutes: ['/dashboard', '/settings', '/profile'],
  authRoutes: ['/signin', '/signup'],
  signInPath: '/signin',
  defaultRedirect: '/dashboard',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 4. Add Auth Callback Handler

```tsx
// apps/your-app/app/auth/callback/route.ts
import { createServerClient } from '@total-audio/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

### 5. Add User Menu to Layout

```tsx
// apps/your-app/app/layout.tsx
import { UserMenu } from '@/components/auth/UserMenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1>Your App</h1>
            <UserMenu />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

## Testing

### Test Sign Up Flow

1. Start your app: `npm run dev`
2. Navigate to `/signup`
3. Fill in the form and submit
4. Check your email for confirmation link
5. Click the link to confirm
6. You should be redirected to `/dashboard`

### Test Sign In Flow

1. Navigate to `/signin`
2. Enter your credentials
3. Submit the form
4. You should be redirected to `/dashboard`

### Test Magic Link

1. Navigate to `/signin`
2. Enter your email (no password)
3. Click "Send Magic Link"
4. Check your email
5. Click the link in the email
6. You should be signed in and redirected

### Test App Access

1. Sign in with a free tier account
2. Navigate to a protected app (e.g., `/tracker`)
3. You should see the upgrade prompt
4. Upgrade to bundle tier in database
5. Refresh the page
6. You should now have access

## Troubleshooting

### "Missing Supabase environment variables"

Make sure you have these in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Sign-in not working

1. Check Supabase Auth logs in the dashboard
2. Verify email confirmation is enabled
3. Check for JavaScript console errors
4. Ensure middleware is configured correctly

### User profile not created

Check that the database trigger is working:

```sql
-- In Supabase SQL Editor
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;
SELECT * FROM public.user_profiles ORDER BY created_at DESC LIMIT 1;
```

If users exist but profiles don't, see troubleshooting in `SUPABASE_SETUP_GUIDE.md`.

## Best Practices

1. **Always test authentication flows** after making changes
2. **Handle loading states** to prevent flashing content
3. **Show clear error messages** for better UX
4. **Implement password reset** for production
5. **Use HTTPS in production** for secure cookies
6. **Test on mobile** to ensure responsive design works

## Next Steps

- Customise the styling to match your brand
- Add social authentication (Google, GitHub, etc.)
- Implement two-factor authentication for agencies
- Add user profile editing functionality
- Create password reset flow
- Add session management in settings

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Total Audio Auth Package](../packages/auth/README.md)
- [Unified Auth Implementation Plan](../UNIFIED_AUTH_IMPLEMENTATION.md)
