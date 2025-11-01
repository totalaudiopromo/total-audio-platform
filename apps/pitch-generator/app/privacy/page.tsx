import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Pitch Generator',
  description:
    'Privacy policy for Pitch Generator by Total Audio Promo. GDPR-compliant data handling for UK users.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="glass-panel px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-amber-600 hover:underline">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Pitch Generator ("we", "our", or "us"). We are committed to protecting your
              personal data and respecting your privacy. This Privacy Policy explains how we
              collect, use, share, and protect your information when you use
              pitch.totalaudiopromo.com (the "Service").
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Data Controller:</strong> Total Audio Promo
              <br />
              <strong>Contact:</strong> info@totalaudiopromo.com
              <br />
              <strong>Location:</strong> United Kingdom
            </p>
          </section>

          {/* What Data We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. What Data We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.1 Account Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Email address (required for account creation)</li>
              <li>Name (if provided during registration)</li>
              <li>Authentication credentials (securely hashed)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.2 Content You Create
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Contact information (names, email addresses, roles, outlets)</li>
              <li>Music pitch content (artist names, track details, pitch text)</li>
              <li>Voice profile settings (writing style preferences)</li>
              <li>Saved pitches and templates</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Usage Data</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Pages visited and features used</li>
              <li>Time spent on the Service</li>
              <li>Browser type and version</li>
              <li>Device information (type, operating system)</li>
              <li>IP address (anonymized for analytics)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.4 Payment Information
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We use Stripe for payment processing. We <strong>do not store</strong> your credit
              card details. Stripe handles all payment data in compliance with PCI-DSS standards.
            </p>
          </section>

          {/* How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-600 leading-relaxed">
              We use your data for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>
                <strong>Provide the Service:</strong> Generate AI-powered music pitches based on
                your inputs
              </li>
              <li>
                <strong>Account Management:</strong> Create and maintain your user account
              </li>
              <li>
                <strong>Communication:</strong> Send service updates, support responses, and
                marketing emails (with consent)
              </li>
              <li>
                <strong>Improvement:</strong> Analyze usage patterns to improve features and user
                experience
              </li>
              <li>
                <strong>Security:</strong> Detect and prevent fraud, abuse, and unauthorized access
              </li>
              <li>
                <strong>Legal Compliance:</strong> Comply with legal obligations and protect our
                rights
              </li>
            </ul>
          </section>

          {/* Legal Basis (GDPR) */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Legal Basis for Processing (GDPR)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Under GDPR, we process your data based on:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>
                <strong>Contract Performance:</strong> To provide the Service you signed up for
              </li>
              <li>
                <strong>Legitimate Interests:</strong> To improve the Service and ensure security
              </li>
              <li>
                <strong>Consent:</strong> For marketing communications (you can opt out anytime)
              </li>
              <li>
                <strong>Legal Obligation:</strong> To comply with UK/EU laws
              </li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed">We share your data with:</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Service Providers</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Supabase:</strong> Database hosting and authentication (EU servers)
              </li>
              <li>
                <strong>Anthropic (Claude AI):</strong> AI-powered pitch generation (your data is
                not used for training)
              </li>
              <li>
                <strong>Stripe:</strong> Payment processing (PCI-DSS compliant)
              </li>
              <li>
                <strong>Vercel:</strong> Website hosting and infrastructure
              </li>
              <li>
                <strong>Plausible Analytics:</strong> Privacy-friendly analytics (no cookies,
                GDPR-compliant)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 We Do NOT</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Sell your data to third parties</li>
              <li>Use your data for AI model training without consent</li>
              <li>Share your contact lists with other users</li>
              <li>Display your pitches publicly</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Active Accounts:</strong> We retain your data as long as your account is
                active
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Data is permanently deleted within 30 days of
                account deletion
              </li>
              <li>
                <strong>Legal Requirements:</strong> Some data may be retained longer to comply with
                UK tax/legal obligations
              </li>
            </ul>
          </section>

          {/* Your GDPR Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights (GDPR)</h2>
            <p className="text-gray-600 leading-relaxed">
              As a UK/EU data subject, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>
                <strong>Access:</strong> Request a copy of your data (export feature in dashboard)
              </li>
              <li>
                <strong>Rectification:</strong> Correct inaccurate data (edit in dashboard)
              </li>
              <li>
                <strong>Erasure ("Right to be Forgotten"):</strong> Delete your account and all data
              </li>
              <li>
                <strong>Portability:</strong> Export your data in JSON format
              </li>
              <li>
                <strong>Object:</strong> Opt out of marketing communications
              </li>
              <li>
                <strong>Restrict Processing:</strong> Limit how we use your data
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              To exercise your rights, email us at{' '}
              <a
                href="mailto:privacy@totalaudiopromo.com"
                className="text-amber-600 hover:underline"
              >
                privacy@totalaudiopromo.com
              </a>{' '}
              or use the settings in your dashboard.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Encrypted connections (HTTPS/TLS)</li>
              <li>Hashed passwords (bcrypt)</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>EU-based data servers (Supabase)</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cookies & Tracking</h2>
            <p className="text-gray-600 leading-relaxed">We use minimal cookies:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>
                <strong>Essential Cookies:</strong> Authentication session (NextAuth)
              </li>
              <li>
                <strong>Analytics:</strong> Plausible (no personal data, no tracking across sites)
              </li>
              <li>We do NOT use Google Analytics, Facebook Pixel, or invasive tracking</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              The Service is not intended for users under 16. We do not knowingly collect data from
              children. If you believe a child has provided data to us, contact us immediately.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              11. International Data Transfers
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is primarily stored in the EU (Supabase). When we use US-based services
              (Anthropic, Vercel), we ensure appropriate safeguards (Standard Contractual Clauses,
              adequacy decisions).
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              12. Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this policy from time to time. Material changes will be notified via
              email. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy questions or to exercise your rights:
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:privacy@totalaudiopromo.com"
                className="text-amber-600 hover:underline"
              >
                privacy@totalaudiopromo.com
              </a>
              <br />
              <strong>Subject:</strong> Pitch Generator - Privacy Request
              <br />
              <strong>Response Time:</strong> Within 30 days (as required by GDPR)
            </p>
          </section>

          {/* Complaints */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Complaints</h2>
            <p className="text-gray-600 leading-relaxed">
              If you're not satisfied with our response, you have the right to lodge a complaint
              with the UK Information Commissioner's Office (ICO):
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>ICO Website:</strong>{' '}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:underline"
              >
                ico.org.uk
              </a>
              <br />
              <strong>Phone:</strong> 0303 123 1113
            </p>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-xl border-2 border-amber-500 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Questions about your data?</h3>
          <p className="text-sm text-gray-600 mb-4">
            We're committed to transparency. If you have any questions about how we handle your
            data, we're here to help.
          </p>
          <a href="mailto:privacy@totalaudiopromo.com" className="cta-button inline-flex">
            Email Privacy Team
          </a>
        </div>
      </div>
    </div>
  );
}
