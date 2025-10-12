import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Tracker | Total Audio Promo',
  description: 'Terms of service for Tracker campaign tracking software. User rights, responsibilities, and service terms.',
  alternates: {
    canonical: 'https://tracker.totalaudiopromo.com/terms',
    languages: {
      'en-GB': 'https://tracker.totalaudiopromo.com/terms',
    }
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="glass-panel px-8 py-12">
        <h1 className="mb-6 text-4xl font-black">Terms of Service</h1>
        <p className="mb-8 text-sm text-gray-600">Last updated: October 2025</p>

        <div className="prose prose-lg max-w-none">
          {/* Acceptance of Terms */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">1. Acceptance of Terms</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              By accessing or using Tracker ("the Service"), operated by Total Audio Promo ("we", "our", or "us"),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not
              use the Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute a legally binding agreement between you and Total Audio Promo, governed by
              the laws of England and Wales.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">2. Service Description</h2>
            <p className="mb-3 text-gray-700">Tracker is a campaign tracking platform that provides:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Campaign management and response tracking</li>
              <li>AI-powered campaign intelligence and insights</li>
              <li>Industry benchmark comparisons</li>
              <li>Integration with third-party services (Google Sheets, Gmail, etc.)</li>
              <li>Export and reporting functionality</li>
            </ul>
            <p className="text-gray-700">
              The Service is currently in beta. Features may change, and we make no guarantee of uninterrupted availability.
            </p>
          </section>

          {/* Account Registration */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">3. Account Registration and Security</h2>
            <h3 className="mb-3 text-xl font-bold">3.1 Account Creation</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>You must be at least 16 years old to create an account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the confidentiality of your password</li>
              <li>One person or entity may not maintain multiple free accounts</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold">3.2 Account Security</h3>
            <p className="mb-4 text-gray-700">
              You are responsible for all activities that occur under your account. Notify us immediately of any
              unauthorised use at <a href="mailto:security@totalaudiopromo.com" className="text-purple-600 underline">security@totalaudiopromo.com</a>.
            </p>
          </section>

          {/* Subscription Plans and Billing */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">4. Subscription Plans and Billing</h2>
            <h3 className="mb-3 text-xl font-bold">4.1 Free Plan</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Limited to 3 campaigns</li>
              <li>Access to all AI intelligence features</li>
              <li>No credit card required</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold">4.2 Paid Plans (Professional and Agency)</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Billed monthly in GBP (£)</li>
              <li>Automatic renewal unless cancelled</li>
              <li>You can upgrade or downgrade at any time</li>
              <li>Refunds available within 14 days of initial purchase</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold">4.3 Payment Processing</h3>
            <p className="mb-4 text-gray-700">
              Payments are processed securely by Stripe. We do not store your credit card information. By providing
              payment information, you authorise us to charge your payment method for all fees incurred.
            </p>

            <h3 className="mb-3 text-xl font-bold">4.4 Cancellation and Refunds</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Cancel anytime from your dashboard settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>Full refund available within 14 days of initial subscription</li>
              <li>No partial refunds for mid-month cancellations</li>
            </ul>
          </section>

          {/* Acceptable Use Policy */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">5. Acceptable Use Policy</h2>
            <p className="mb-3 text-gray-700">You agree NOT to:</p>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorised access to our systems or other users' accounts</li>
              <li>Scrape, crawl, or reverse engineer the Service</li>
              <li>Use the Service to send spam or unsolicited communications</li>
              <li>Resell or redistribute the Service without our written permission</li>
              <li>Use the Service in a way that could damage, disable, or impair our systems</li>
              <li>Impersonate another person or entity</li>
            </ul>
            <p className="text-gray-700 font-bold">
              Violation of this policy may result in immediate account suspension or termination without refund.
            </p>
          </section>

          {/* User Content and Data */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">6. User Content and Data</h2>
            <h3 className="mb-3 text-xl font-bold">6.1 Your Data</h3>
            <p className="mb-4 text-gray-700">
              You retain all rights to the campaign data and content you upload to Tracker ("Your Data"). You grant
              us a licence to use Your Data solely to provide and improve the Service.
            </p>

            <h3 className="mb-3 text-xl font-bold">6.2 AI Processing</h3>
            <p className="mb-4 text-gray-700">
              By using AI-powered features, you consent to Your Data being processed by our AI service providers
              (e.g., Anthropic). Campaign insights are generated from anonymised, aggregated data.
            </p>

            <h3 className="mb-3 text-xl font-bold">6.3 Data Responsibility</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>You are responsible for the accuracy and legality of Your Data</li>
              <li>You must have the right to upload and share any contact information</li>
              <li>You must comply with GDPR and data protection laws when using our Service</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold">6.4 Data Export and Portability</h3>
            <p className="mb-4 text-gray-700">
              You can export Your Data at any time in CSV or PDF format. Upon account deletion, Your Data is
              permanently removed within 30 days.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">7. Intellectual Property</h2>
            <p className="mb-4 text-gray-700">
              The Service, including all software, design, text, graphics, and trademarks, is owned by Total Audio Promo
              and protected by UK and international copyright and trademark laws.
            </p>
            <p className="text-gray-700">
              You may not copy, modify, distribute, sell, or lease any part of our Service without our express
              written permission.
            </p>
          </section>

          {/* Third-Party Integrations */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">8. Third-Party Integrations</h2>
            <p className="mb-4 text-gray-700">
              Tracker integrates with third-party services (Google Sheets, Gmail, Airtable, Mailchimp, etc.).
              Your use of these integrations is subject to the respective third-party terms of service.
            </p>
            <p className="text-gray-700">
              We are not responsible for the availability, security, or functionality of third-party services.
            </p>
          </section>

          {/* Disclaimers and Limitations of Liability */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">9. Disclaimers and Limitations of Liability</h2>
            <h3 className="mb-3 text-xl font-bold">9.1 Service Provided "As Is"</h3>
            <p className="mb-4 text-gray-700">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or
              implied. We do not guarantee uninterrupted, error-free, or secure operation.
            </p>

            <h3 className="mb-3 text-xl font-bold">9.2 Limitation of Liability</h3>
            <p className="mb-4 text-gray-700">
              To the maximum extent permitted by UK law, Total Audio Promo shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
            <p className="text-gray-700">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim,
              or £100, whichever is greater.
            </p>

            <h3 className="mb-3 text-xl font-bold">9.3 AI-Generated Insights</h3>
            <p className="mb-4 text-gray-700">
              AI-generated campaign insights are provided for informational purposes only. We do not guarantee the
              accuracy or completeness of AI-generated content. You are responsible for verifying all insights
              before making business decisions.
            </p>
          </section>

          {/* Term and Termination */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">10. Term and Termination</h2>
            <h3 className="mb-3 text-xl font-bold">10.1 Termination by You</h3>
            <p className="mb-4 text-gray-700">
              You may cancel your account at any time from dashboard settings. Your subscription will remain active
              until the end of the current billing period.
            </p>

            <h3 className="mb-3 text-xl font-bold">10.2 Termination by Us</h3>
            <p className="mb-4 text-gray-700">
              We may suspend or terminate your account immediately if you breach these Terms, engage in fraudulent
              activity, or for any other reason at our sole discretion. We will provide notice when possible.
            </p>

            <h3 className="mb-3 text-xl font-bold">10.3 Effect of Termination</h3>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Your access to the Service will be immediately revoked</li>
              <li>Your Data will be permanently deleted within 30 days</li>
              <li>You will not receive refunds for unused subscription time (except within 14-day refund period)</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">11. Changes to These Terms</h2>
            <p className="text-gray-700">
              We may update these Terms from time to time. We will notify you of material changes via email or
              dashboard notification at least 30 days before they take effect. Your continued use of the Service
              after changes constitute acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law and Dispute Resolution */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">12. Governing Law and Dispute Resolution</h2>
            <p className="mb-4 text-gray-700">
              These Terms are governed by the laws of England and Wales. Any disputes shall be resolved exclusively
              in the courts of England and Wales.
            </p>
            <p className="text-gray-700">
              Before initiating legal proceedings, you agree to first attempt to resolve the dispute by contacting
              us at <a href="mailto:legal@totalaudiopromo.com" className="text-purple-600 underline">legal@totalaudiopromo.com</a>.
            </p>
          </section>

          {/* General Provisions */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">13. General Provisions</h2>
            <ul className="mb-4 list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect</li>
              <li><strong>No Waiver:</strong> Our failure to enforce any right does not waive that right</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign our rights freely</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-black">14. Contact Us</h2>
            <p className="mb-3 text-gray-700">For questions about these Terms:</p>
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <p className="font-bold mb-2">Total Audio Promo</p>
              <p className="text-gray-700">Email: <a href="mailto:legal@totalaudiopromo.com" className="text-purple-600 underline">legal@totalaudiopromo.com</a></p>
              <p className="text-gray-700">Support: <a href="mailto:info@totalaudiopromo.com" className="text-purple-600 underline">info@totalaudiopromo.com</a></p>
              <p className="text-gray-700">Location: Brighton, United Kingdom</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
