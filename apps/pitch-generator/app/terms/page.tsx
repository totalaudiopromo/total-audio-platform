import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Pitch Generator',
  description: 'Terms of Service for Pitch Generator by Total Audio Promo. UK-compliant service agreement.',
  robots: { index: true, follow: true }
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="glass-panel px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Pitch Generator ("the Service"), you agree to be bound by these Terms of Service ("Terms").
              If you disagree with any part of these terms, you may not use the Service.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Service Provider:</strong> Total Audio Promo<br />
              <strong>Service:</strong> pitch.totalaudiopromo.com<br />
              <strong>Governing Law:</strong> England and Wales
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
            <p className="text-gray-600 leading-relaxed">
              Pitch Generator is an AI-powered tool that helps music industry professionals create personalised
              music PR pitches for radio stations, blogs, playlists, and media outlets.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 What We Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>AI-generated music pitch content based on your inputs</li>
              <li>Contact database management</li>
              <li>Pitch history and templates</li>
              <li>Voice profile customisation</li>
              <li>Export and copy functionality</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 What We Don't Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Guaranteed pitch acceptance or response rates</li>
              <li>Direct email sending on your behalf</li>
              <li>Music PR consultation or strategy services</li>
              <li>Legal advice about music industry contracts</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Account Registration</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-600 leading-relaxed">
              To use the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Be responsible for all activity under your account</li>
              <li>Notify us immediately of unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Eligibility</h3>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 16 years old to use the Service. By registering, you represent that you meet this requirement.
            </p>
          </section>

          {/* Usage Rules */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Permitted Use</h3>
            <p className="text-gray-600 leading-relaxed">You may use the Service to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Generate professional music PR pitches</li>
              <li>Store and manage your contact databases</li>
              <li>Customize your writing voice and style</li>
              <li>Export pitches for your campaigns</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Prohibited Use</h3>
            <p className="text-gray-600 leading-relaxed">You may NOT:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li><strong>Spam:</strong> Generate pitches for unsolicited mass email campaigns</li>
              <li><strong>Scrape:</strong> Use automated tools to extract data from the Service</li>
              <li><strong>Resell:</strong> Sell or redistribute generated pitches as a commercial service</li>
              <li><strong>Abuse:</strong> Attempt to overload, hack, or compromise the Service</li>
              <li><strong>Violate Laws:</strong> Use the Service for illegal purposes or to violate GDPR/UK laws</li>
              <li><strong>Impersonate:</strong> Pretend to be another person or entity</li>
              <li><strong>Defame:</strong> Generate content that is defamatory, offensive, or harassing</li>
            </ul>
          </section>

          {/* Pricing & Payments */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Pricing & Payments</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Pricing Plans</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Free:</strong> 5 pitches per month (no credit card required)</li>
              <li><strong>PRO:</strong> £12/month or £120/year (unlimited pitches)</li>
              <li><strong>Agency:</strong> £79/month or £790/year (unlimited + team features)</li>
              <li><strong>Bundle:</strong> £19/month or £190/year (Intel + Pitch Generator + Tracker)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Payment Terms</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Payments are processed via Stripe (PCI-DSS compliant)</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Prices are in GBP and include applicable UK taxes</li>
              <li>We reserve the right to change prices with 30 days' notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Refunds</h3>
            <p className="text-gray-600 leading-relaxed">
              We offer a 30-day money-back guarantee for first-time PRO and Agency subscribers.
              To request a refund, email <a href="mailto:billing@totalaudiopromo.com" className="text-blue-600 hover:underline">billing@totalaudiopromo.com</a> within 30 days of your first payment.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Cancellation</h3>
            <p className="text-gray-600 leading-relaxed">
              You may cancel your subscription anytime from your account settings. Your access continues until the end of your billing period.
              No partial refunds for unused time.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Your Content</h3>
            <p className="text-gray-600 leading-relaxed">
              You retain all rights to the content you input (track details, contact info, etc.) and the pitches you generate.
              We do not claim ownership of your pitches or data.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Our Service</h3>
            <p className="text-gray-600 leading-relaxed">
              The Service itself (code, design, AI models, algorithms) is owned by Total Audio Promo. You may not copy,
              modify, or reverse-engineer the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 License to Use Your Content</h3>
            <p className="text-gray-600 leading-relaxed">
              By using the Service, you grant us a limited license to process your content solely for the purpose of
              providing the Service. We do not use your pitches or data to train AI models or share with third parties.
            </p>
          </section>

          {/* AI-Generated Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. AI-Generated Content</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 No Guarantees</h3>
            <p className="text-gray-600 leading-relaxed">
              AI-generated pitches are suggestions based on your inputs. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Accuracy of all generated content</li>
              <li>Pitch acceptance by recipients</li>
              <li>Specific response rates or success metrics</li>
              <li>Freedom from errors or typos</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Your Responsibility</h3>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for reviewing and editing all generated content before sending. You must ensure pitches comply with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>UK marketing laws (CAN-SPAM equivalent)</li>
              <li>GDPR (if emailing EU contacts)</li>
              <li>Recipient's submission guidelines</li>
            </ul>
          </section>

          {/* Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitations of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by UK law:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>The Service is provided "as is" without warranties</li>
              <li>We are not liable for lost revenue, data loss, or indirect damages</li>
              <li>Our total liability is limited to the amount you paid in the last 12 months</li>
              <li>We are not responsible for third-party services (Stripe, Anthropic, etc.)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Nothing in these Terms excludes liability for:</strong> Death or personal injury caused by negligence,
              fraud, or misrepresentation, or any other liability that cannot be excluded under UK law.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Service Availability</h2>
            <p className="text-gray-600 leading-relaxed">
              We aim for 99.9% uptime but cannot guarantee uninterrupted service. We may:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Perform scheduled maintenance (with advance notice)</li>
              <li>Make emergency updates for security or performance</li>
              <li>Suspend service for abuse or non-payment</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Data Protection</h2>
            <p className="text-gray-600 leading-relaxed">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              We comply with GDPR and UK data protection laws.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 By You</h3>
            <p className="text-gray-600 leading-relaxed">
              You may delete your account anytime from account settings. All your data will be permanently deleted within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 By Us</h3>
            <p className="text-gray-600 leading-relaxed">
              We may terminate your account if you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Abuse the Service (spamming, scraping, etc.)</li>
              <li>Fail to pay subscription fees</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We will provide 14 days' notice unless immediate termination is required for legal or security reasons.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms from time to time. Material changes will be notified via email 30 days before they take effect.
              Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Dispute Resolution</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of England and Wales. Any disputes will be resolved in the courts of England and Wales.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Before initiating legal proceedings, we encourage you to contact us at <a href="mailto:legal@totalaudiopromo.com" className="text-blue-600 hover:underline">legal@totalaudiopromo.com</a> to resolve the issue amicably.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms:
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Email:</strong> <a href="mailto:legal@totalaudiopromo.com" className="text-blue-600 hover:underline">legal@totalaudiopromo.com</a><br />
              <strong>Subject:</strong> Pitch Generator - Terms Inquiry
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.
            </p>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-xl border-2 border-blue-500 bg-blue-50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to start?</h3>
          <p className="text-sm text-gray-600 mb-4">
            By signing up, you agree to these Terms of Service and our Privacy Policy. Try 5 free pitches, no credit card required.
          </p>
          <Link href="/auth/signin" className="cta-button inline-flex">
            Start Free Trial →
          </Link>
        </div>
      </div>
    </div>
  );
}
