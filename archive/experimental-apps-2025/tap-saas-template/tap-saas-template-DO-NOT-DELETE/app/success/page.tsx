import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="glass-panel px-6 py-12 sm:px-10">
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          Checkout complete
        </span>
        <h1 className="mt-6 text-3xl font-semibold">Thanks for activating your workspace</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          Use this screen to confirm the subscription, share next steps, or drop onboarding links.
          The API route redirects here automatically when Stripe is configured—or immediately in dev
          mode so the flow works without keys.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/profile" className="cta-button">
            Head to your dashboard
          </Link>
          <Link href="/" className="subtle-button">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
