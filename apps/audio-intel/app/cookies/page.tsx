import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Audio Intel',
  description: 'Audio Intel cookie policy - how we use cookies and how to control them.',
};

export default function CookiePolicy() {
  const lastUpdated = 'January 15, 2025';

  return (
    <div className="mx-auto max-w-4xl">
      <div className="glass-panel p-8 sm:p-12">
        <h1 className="text-4xl font-black mb-2">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files stored on your device when you visit a website. They help
              websites remember your preferences and improve your experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
            <p className="mb-4">Audio Intel uses cookies for the following purposes:</p>

            <h3 className="text-xl font-bold mb-3">1. Essential Cookies (Always Active)</h3>
            <p className="mb-2">
              These cookies are necessary for the website to function properly:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>audio-intel-cookie-consent</strong> - Remembers your cookie preferences (1
                year)
              </li>
              <li>
                <strong>Session cookies</strong> - Keep you logged in to your account
              </li>
              <li>
                <strong>Security cookies</strong> - Protect against fraud and unauthorized access
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-3">
              2. Analytics Cookies (Optional - Requires Consent)
            </h3>
            <p className="mb-2">
              These cookies help us understand how users interact with our site:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Google Analytics (_ga, _gid, _gat)</strong> - Track page views, user
                behavior, and site performance
              </li>
              <li>
                <strong>Purpose:</strong> Improve website performance and user experience
              </li>
              <li>
                <strong>Retention:</strong> Up to 2 years
              </li>
              <li>
                <strong>Control:</strong> You can opt out via our cookie banner or{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-3">3. Functionality Cookies (Optional)</h3>
            <p className="mb-2">These cookies remember your preferences:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Theme preferences</strong> - Remember your display settings
              </li>
              <li>
                <strong>Language preferences</strong> - Remember your language choice
              </li>
              <li>
                <strong>Retention:</strong> Up to 1 year
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
            <p className="mb-4">Some cookies are set by third-party services we use:</p>

            <h3 className="text-xl font-bold mb-3">Google Analytics</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Purpose:</strong> Website analytics and performance tracking
              </li>
              <li>
                <strong>Data Shared:</strong> Anonymized usage data, page views, device information
              </li>
              <li>
                <strong>Privacy Policy:</strong>{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Opt-out:</strong> Decline via our cookie banner or use Google's opt-out tool
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-3">Stripe (Payment Processing)</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Purpose:</strong> Secure payment processing and fraud prevention
              </li>
              <li>
                <strong>Data Shared:</strong> Payment information (encrypted)
              </li>
              <li>
                <strong>Privacy Policy:</strong>{' '}
                <a
                  href="https://stripe.com/gb/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Stripe Privacy Policy
                </a>
              </li>
              <li>
                <strong>Note:</strong> These are essential for payment functionality
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How to Control Cookies</h2>

            <h3 className="text-xl font-bold mb-3">1. Via Our Cookie Banner</h3>
            <p className="mb-4">
              When you first visit Audio Intel, you'll see a cookie banner at the bottom of the
              page. You can:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Accept All Cookies:</strong> Allow all cookies including analytics
              </li>
              <li>
                <strong>Decline:</strong> Only use essential cookies (analytics disabled)
              </li>
            </ul>
            <p className="mb-4">
              To change your preferences later, clear your browser cookies and revisit the site, or
              contact us at{' '}
              <a
                href="mailto:privacy@totalaudiopromo.com"
                className="text-blue-600 hover:underline"
              >
                privacy@totalaudiopromo.com
              </a>
              .
            </p>

            <h3 className="text-xl font-bold mb-3">2. Via Your Browser Settings</h3>
            <p className="mb-4">All browsers allow you to control cookies. Here's how:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and Security → Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Preferences → Privacy & Security → Cookies
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and Site Permissions
              </li>
            </ul>
            <p className="mb-4 bg-yellow-50 border-2 border-yellow-500 p-4 rounded-lg">
              <strong>Note:</strong> Blocking all cookies may affect website functionality,
              including the ability to log in to your account.
            </p>

            <h3 className="text-xl font-bold mb-3">3. Via Do Not Track</h3>
            <p className="mb-4">
              Most browsers support "Do Not Track" (DNT) settings. While we respect DNT signals,
              please note that DNT is not a legally enforceable standard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy to reflect changes in our practices or legal
              requirements. We will notify you of material changes via email or a prominent notice
              on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies:
              <br />
              <strong>Email:</strong>{' '}
              <a
                href="mailto:privacy@totalaudiopromo.com"
                className="text-blue-600 hover:underline"
              >
                privacy@totalaudiopromo.com
              </a>
              <br />
              <strong>Privacy Policy:</strong>{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                View our Privacy Policy
              </Link>
            </p>
          </section>

          <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-500 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Quick Summary</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Essential cookies are always active (required for site function)</li>
              <li>🔍 Analytics cookies require your consent (improve user experience)</li>
              <li>⚙️ You can change preferences anytime via browser settings</li>
              <li>🛡️ We never sell data collected via cookies</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/privacy" className="text-blue-600 font-bold hover:underline">
            Privacy Policy →
          </Link>
          <Link href="/terms" className="text-blue-600 font-bold hover:underline">
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
