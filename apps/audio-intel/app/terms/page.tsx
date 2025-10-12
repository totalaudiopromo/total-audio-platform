import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Audio Intel',
  description: 'Terms of service and user agreement for Audio Intel contact enrichment platform.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <div className="glass-panel px-8 py-12 sm:px-12">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>

        <p className="mb-6 text-sm text-gray-600">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing and using Audio Intel (&quot;Service&quot;, &quot;Platform&quot;), operated by Total Audio Promo Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            <p>
              If you do not agree with any part of these terms, you may not access or use the Service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Service Description</h2>
            <p className="mb-4">
              Audio Intel provides AI-powered contact enrichment services for music industry professionals. The Service allows you to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Upload contact lists for automated research and enrichment</li>
              <li>Access enhanced contact information including email addresses, social media profiles, and industry intelligence</li>
              <li>Export enriched contact data in CSV/Excel formats</li>
              <li>Manage subscription plans and usage limits</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. User Accounts and Responsibilities</h2>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">3.1 Account Creation</h3>
            <p className="mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information to keep it accurate and current</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
            </ul>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">3.2 Account Security</h3>
            <p>
              You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to maintain account security.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Acceptable Use Policy</h2>
            <p className="mb-4">You agree NOT to use the Service to:</p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Upload malicious code, viruses, or harmful software</li>
              <li>Harvest or collect contact information for spam or unsolicited marketing</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the Service or servers/networks connected to the Service</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Use automated systems (bots, scrapers) without our prior written consent</li>
              <li>Resell or redistribute the Service or enriched contact data without permission</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate this Acceptable Use Policy without refund.
            </p>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Subscription Plans and Payment</h2>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">5.1 Subscription Tiers</h3>
            <p className="mb-4">Audio Intel offers multiple subscription tiers:</p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li><strong>Free Beta:</strong> Limited enrichments per month (currently 10)</li>
              <li><strong>Professional Plan (£19/month):</strong> Unlimited enrichments with advanced features</li>
              <li><strong>Agency Plan (£79/month):</strong> Unlimited enrichments with team collaboration and priority support</li>
            </ul>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">5.2 Billing and Renewal</h3>
            <p className="mb-4">
              Subscriptions are billed monthly via Stripe. Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date.
            </p>
            <p className="mb-4">
              All payments are processed in GBP (£). Prices are subject to change with 30 days notice to existing subscribers.
            </p>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">5.3 Refund Policy</h3>
            <p className="mb-4">
              Refunds are provided on a case-by-case basis within 14 days of purchase if:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>The Service failed to deliver promised functionality due to our technical issues</li>
              <li>You experienced significant service disruption beyond reasonable downtime</li>
            </ul>
            <p>
              Refunds are not provided for change of mind, lack of use, or if you violate these Terms.
            </p>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">5.4 Cancellation</h3>
            <p>
              You may cancel your subscription at any time from your account dashboard. Cancellations take effect at the end of the current billing period. No partial refunds are provided for unused time.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Intellectual Property Rights</h2>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">6.1 Our IP</h3>
            <p className="mb-4">
              The Service, including all content, features, functionality, software, and design, is owned by Total Audio Promo Ltd and is protected by UK and international copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">6.2 Your Content</h3>
            <p className="mb-4">
              You retain all rights to the contact data you upload. By using the Service, you grant us a limited licence to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Process your uploaded contact data to provide enrichment services</li>
              <li>Store your data temporarily as necessary to deliver the Service</li>
              <li>Use aggregated, anonymised data to improve the Service</li>
            </ul>
            <p>
              We do not claim ownership of your uploaded contacts or enriched data.
            </p>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">6.3 Enriched Data</h3>
            <p>
              Enriched contact data provided by the Service is for your use only. You may not:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Resell, redistribute, or sublicense enriched data to third parties</li>
              <li>Create competing contact enrichment services using our data</li>
              <li>Reverse-engineer our enrichment processes or algorithms</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Data Protection and Privacy</h2>
            <p className="mb-4">
              Your use of the Service is subject to our{' '}
              <Link href="/privacy" className="font-bold text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , which explains how we collect, use, and protect your personal information in compliance with UK GDPR.
            </p>
            <p className="mb-4">
              When using the Service, you acknowledge that:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>You are responsible for ensuring you have lawful basis to process contact data you upload</li>
              <li>You must comply with UK GDPR and data protection laws when using enriched contact data</li>
              <li>We process data as a data processor on your behalf when providing enrichment services</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">8. Disclaimers and Warranties</h2>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">8.1 Service Availability</h3>
            <p className="mb-4">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Uninterrupted or error-free operation of the Service</li>
              <li>100% accuracy of enriched contact data</li>
              <li>Availability of specific contact information for all queries</li>
              <li>That the Service will meet your specific requirements</li>
            </ul>

            <h3 className="mb-3 mt-4 text-xl font-semibold text-gray-900">8.2 Data Accuracy</h3>
            <p>
              While we strive to provide accurate and up-to-date contact information, we cannot guarantee the accuracy, completeness, or reliability of enriched data. Contact information may change, become outdated, or be unavailable. You are responsible for verifying information before use.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by UK law, Total Audio Promo Ltd shall not be liable for:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Service interruptions or data loss</li>
              <li>Damages resulting from use or inability to use the Service</li>
              <li>Actions you take based on enriched contact data</li>
            </ul>
            <p className="mb-4">
              Our total liability for any claim arising from your use of the Service is limited to the amount you paid us in the 12 months preceding the claim.
            </p>
            <p>
              Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded under UK law.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Total Audio Promo Ltd, its directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights, including data protection rights</li>
              <li>Your use of enriched contact data in violation of applicable laws</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">11. Termination</h2>
            <p className="mb-4">
              We may suspend or terminate your account and access to the Service immediately, without prior notice, if:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>You breach these Terms of Service</li>
              <li>You violate our Acceptable Use Policy</li>
              <li>We are required to do so by law</li>
              <li>Your account shows signs of fraudulent or abusive activity</li>
            </ul>
            <p className="mb-4">
              Upon termination:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Your right to access and use the Service immediately ceases</li>
              <li>We will delete your uploaded contact data within 30 days (subject to legal retention requirements)</li>
              <li>You remain liable for any outstanding payments</li>
              <li>No refunds will be provided for prepaid subscription fees</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">12. Changes to These Terms</h2>
            <p className="mb-4">
              We may update these Terms of Service from time to time. When we make material changes, we will:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Update the &quot;Last Updated&quot; date at the top of this page</li>
              <li>Notify you by email (if you have an account)</li>
              <li>Provide 30 days notice for changes that materially affect your rights</li>
            </ul>
            <p>
              Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">13. Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              These Terms are governed by the laws of England and Wales, without regard to conflict of law principles.
            </p>
            <p>
              Any disputes arising from these Terms or your use of the Service will be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision will be modified to reflect the parties&apos; intention or eliminated to the minimum extent necessary. The remaining provisions will continue in full force and effect.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">15. Contact Information</h2>
            <p className="mb-4">
              For questions, concerns, or disputes regarding these Terms of Service, please contact us:
            </p>
            <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="mb-2">
                <strong>Total Audio Promo Ltd</strong>
              </p>
              <p className="mb-2">
                Email:{' '}
                <a href="mailto:support@totalaudiopromo.com" className="font-bold text-blue-600 hover:underline">
                  support@totalaudiopromo.com
                </a>
              </p>
              <p className="mb-2">
                Website:{' '}
                <a href="https://intel.totalaudiopromo.com" className="font-bold text-blue-600 hover:underline">
                  intel.totalaudiopromo.com
                </a>
              </p>
              <p className="text-sm text-gray-600">
                We aim to respond to all enquiries within 48 hours during UK business hours.
              </p>
            </div>
          </section>

          {/* Agreement */}
          <section className="mt-12 rounded-lg border-2 border-purple-400 bg-purple-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-gray-900">
              By using Audio Intel, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>

          {/* Quick Links */}
          <section className="mt-8 border-t-2 border-gray-200 pt-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Related Legal Documents</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="rounded-lg border-2 border-gray-900 bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="rounded-lg border-2 border-gray-900 bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Cookie Policy
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border-2 border-gray-900 bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
