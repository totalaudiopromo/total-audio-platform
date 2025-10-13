import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Audio Intel',
  description: 'Audio Intel privacy policy - how we collect, use, and protect your data in compliance with UK GDPR.',
};

export default function PrivacyPolicy() {
  const lastUpdated = 'January 15, 2025';

  return (
    <div className="mx-auto max-w-4xl">
      <div className="glass-panel p-8 sm:p-12">
        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Total Audio Promo Ltd ("Audio Intel", "we", "us", or "our") operates intel.totalaudiopromo.com.
              We are committed to protecting your privacy and complying with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.
            </p>
            <p className="mb-4">
              <strong>Data Controller:</strong> Total Audio Promo Ltd<br />
              <strong>Contact:</strong> <a href="mailto:privacy@totalaudiopromo.com" className="text-blue-600 hover:underline">privacy@totalaudiopromo.com</a><br />
              <strong>ICO Registration:</strong> [Your ICO Registration Number - apply at ico.org.uk if not registered]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-bold mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, payment information</li>
              <li><strong>Contact Lists:</strong> Music industry contacts you upload for enrichment</li>
              <li><strong>Communications:</strong> Support messages, feedback, and correspondence</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> See our <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link> for details</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We process your data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Service Delivery:</strong> To provide contact enrichment services (Legal Basis: Contract Performance)</li>
              <li><strong>Account Management:</strong> To manage your account and subscriptions (Legal Basis: Contract Performance)</li>
              <li><strong>Payment Processing:</strong> To process payments via Stripe (Legal Basis: Contract Performance)</li>
              <li><strong>Service Improvement:</strong> To analyze usage and improve features (Legal Basis: Legitimate Interest)</li>
              <li><strong>Communications:</strong> To send service updates and respond to inquiries (Legal Basis: Contract Performance / Legitimate Interest)</li>
              <li><strong>Marketing:</strong> To send promotional emails (Legal Basis: Consent - you can opt out anytime)</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations (Legal Basis: Legal Obligation)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Third Parties</h2>
            <p className="mb-4">We share your data only when necessary:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (PCI-compliant, UK-GDPR compliant)</li>
              <li><strong>Google Analytics:</strong> Usage analytics (anonymized, with your consent)</li>
              <li><strong>Vercel:</strong> Website hosting (UK-GDPR compliant)</li>
              <li><strong>AI Services:</strong> Contact enrichment via Anthropic Claude API (data processing agreement in place)</li>
            </ul>
            <p className="mb-4">
              <strong>We never sell your data to third parties.</strong> All third-party processors are contractually bound to protect your data under UK GDPR.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect your data:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits</li>
              <li>Secure payment processing via Stripe (PCI-DSS compliant)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Rights Under UK GDPR</h2>
            <p className="mb-4">You have the following rights:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, email us at <a href="mailto:privacy@totalaudiopromo.com" className="text-blue-600 hover:underline">privacy@totalaudiopromo.com</a>. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <p className="mb-4">We retain your data for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Account Data:</strong> While your account is active + 30 days after deletion</li>
              <li><strong>Contact Lists:</strong> While your account is active (you can delete anytime)</li>
              <li><strong>Payment Records:</strong> 7 years (legal requirement for UK tax purposes)</li>
              <li><strong>Usage Analytics:</strong> 26 months (Google Analytics default)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
            <p className="mb-4">
              Your data is primarily processed within the UK/EEA. Where we use third-party services outside the UK/EEA (e.g., Anthropic Claude API), we ensure adequate safeguards are in place through:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Data Processing Agreements</li>
              <li>Adequacy decisions where applicable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Audio Intel is not intended for users under 18. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this policy to reflect changes in our practices or legal requirements. We will notify you of material changes via email or a prominent notice on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Contact Us & Complaints</h2>
            <p className="mb-4">
              For privacy-related questions or to exercise your rights:<br />
              <strong>Email:</strong> <a href="mailto:privacy@totalaudiopromo.com" className="text-blue-600 hover:underline">privacy@totalaudiopromo.com</a><br />
              <strong>Address:</strong> [Your Registered UK Address]
            </p>
            <p className="mb-4">
              If you're not satisfied with our response, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO):
            </p>
            <p className="mb-4">
              <strong>ICO Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ico.org.uk</a><br />
              <strong>ICO Helpline:</strong> 0303 123 1113
            </p>
          </section>

          <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-500 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Data Protection Officer</h3>
            <p className="text-sm">
              If you have questions about how we process your data, you can contact our Data Protection Officer at:
              <a href="mailto:dpo@totalaudiopromo.com" className="text-blue-600 hover:underline ml-1">dpo@totalaudiopromo.com</a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/cookies" className="text-blue-600 font-bold hover:underline">
            Cookie Policy →
          </Link>
          <Link href="/terms" className="text-blue-600 font-bold hover:underline">
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
