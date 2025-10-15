import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Tracker | Total Audio Promo',
  description: 'Privacy policy and GDPR compliance for Tracker campaign tracking software. UK-based data handling and user rights.',
  alternates: {
    canonical: 'https://tracker.totalaudiopromo.com/privacy',
    languages: {
      'en-GB': 'https://tracker.totalaudiopromo.com/privacy',
    }
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="glass-panel px-8 py-12">
        <h1 className="mb-6 text-4xl font-black">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-600">Last updated: October 2025</p>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">1. Introduction</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Total Audio Promo ("we", "our", or "us") operates Tracker, a campaign tracking platform for music
              professionals. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our service.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              We are committed to protecting your privacy and complying with the UK General Data Protection Regulation
              (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">2. Information We Collect</h2>

            <h3 className="mb-3 text-xl font-bold">2.1 Information You Provide</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Account Information:</strong> Email address, password (encrypted), name</li>
              <li><strong>Campaign Data:</strong> Campaign names, contact lists, response tracking data, notes</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe (we don't store card details)</li>
              <li><strong>Communications:</strong> Support messages, feedback, survey responses</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold">2.2 Automatically Collected Information</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, actions taken</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> Essential cookies for authentication and preferences (see Cookie Policy below)</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">3. How We Use Your Information</h2>
            <p className="mb-3 text-gray-700">We use your information for the following purposes:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve Tracker's features</li>
              <li><strong>AI Intelligence:</strong> To generate campaign insights and benchmarks (anonymised data only)</li>
              <li><strong>Communication:</strong> To send service updates, support responses, and optional newsletters</li>
              <li><strong>Security:</strong> To protect against fraud, unauthorised access, and technical issues</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Legal Basis for Processing (UK GDPR) */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">4. Legal Basis for Processing (UK GDPR)</h2>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Contract Performance:</strong> Processing necessary to provide our service</li>
              <li><strong>Legitimate Interests:</strong> Service improvement, fraud prevention, analytics</li>
              <li><strong>Consent:</strong> Marketing communications (you can opt out anytime)</li>
              <li><strong>Legal Obligation:</strong> Compliance with UK law and regulations</li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">5. Data Sharing and Disclosure</h2>
            <p className="mb-3 text-gray-700">We do not sell your personal data. We may share data with:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> Supabase (database), Stripe (payments), Vercel (hosting),
                  Anthropic (AI processing) - all GDPR compliant</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (you'll be notified)</li>
            </ul>
            <p className="text-gray-700">
              <strong>International Transfers:</strong> Some service providers may process data outside the UK.
              We ensure adequate safeguards are in place (Standard Contractual Clauses).
            </p>
          </section>

          {/* Your Rights Under UK GDPR */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">6. Your Rights Under UK GDPR</h2>
            <p className="mb-3 text-gray-700">You have the following rights regarding your personal data:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> For marketing communications</li>
            </ul>
            <p className="text-gray-700 font-bold">
              To exercise these rights, email us at <a href="mailto:privacy@totalaudiopromo.com" className="text-amber-600 underline">privacy@totalaudiopromo.com</a> or
              use the data deletion option in your dashboard settings.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">7. Data Retention</h2>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Deleted Accounts:</strong> Data deleted within 30 days of account closure</li>
              <li><strong>Backups:</strong> Backup data deleted within 90 days</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal/accounting purposes (e.g., payment records for 7 years)</li>
            </ul>
          </section>

          {/* Cookie Policy */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">8. Cookie Policy</h2>
            <p className="mb-3 text-gray-700">We use the following types of cookies:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for authentication and security (cannot be disabled)</li>
              <li><strong>Analytics Cookies:</strong> Google Tag Manager for usage analytics (can be disabled)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
            </ul>
            <p className="text-gray-700">
              You can control cookies through your browser settings. Note that disabling essential cookies may
              prevent you from using Tracker.
            </p>
          </section>

          {/* Security */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">9. Security</h2>
            <p className="mb-3 text-gray-700">We implement industry-standard security measures:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Encryption in transit (HTTPS/TLS) and at rest</li>
              <li>Secure authentication with bcrypt password hashing</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p className="text-gray-700">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Tracker is not intended for users under 16 years of age. We do not knowingly collect data from
              children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via
              email or dashboard notification. The "Last updated" date at the top indicates when changes were made.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">12. Contact Us</h2>
            <p className="mb-3 text-gray-700">For privacy-related questions or to exercise your rights:</p>
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <p className="font-bold mb-2">Total Audio Promo</p>
              <p className="text-gray-700">Email: <a href="mailto:privacy@totalaudiopromo.com" className="text-amber-600 underline">privacy@totalaudiopromo.com</a></p>
              <p className="text-gray-700">Location: Brighton, United Kingdom</p>
            </div>
          </section>

          {/* ICO Information */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">13. Complaints</h2>
            <p className="text-gray-700">
              If you are not satisfied with how we handle your data, you have the right to lodge a complaint with
              the UK Information Commissioner's Office (ICO):
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
              <p className="font-bold mb-2">Information Commissioner's Office (ICO)</p>
              <p className="text-gray-700">Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">ico.org.uk</a></p>
              <p className="text-gray-700">Helpline: 0303 123 1113</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
