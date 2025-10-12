import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Support | Audio Intel',
  description: 'Get help with Audio Intel. Contact support, report issues, or provide feedback. Fast response times from real music industry professionals.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <div className="glass-panel px-8 py-12 sm:px-12">
        <h1 className="mb-6 text-4xl font-bold">Contact & Support</h1>

        <p className="mb-8 text-lg text-gray-700">
          Need help with Audio Intel? We're here to support you. Get responses from real music industry professionals who understand your workflow.
        </p>

        {/* Primary Contact */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Get in Touch</h2>

          <div className="mb-6 rounded-lg border-2 border-blue-400 bg-blue-50 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-3 text-xl font-bold text-gray-900">Email Support</h3>
            <p className="mb-4 text-gray-700">
              For all support requests, questions, or feedback:
            </p>
            <a
              href="mailto:support@totalaudiopromo.com"
              className="inline-block rounded-lg border-2 border-gray-900 bg-white px-8 py-4 text-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              support@totalaudiopromo.com
            </a>
            <p className="mt-4 text-sm font-semibold text-gray-600">
              📧 Response time: Within 48 hours during UK business hours (Monday-Friday, 9am-6pm GMT)
            </p>
          </div>
        </section>

        {/* What We Can Help With */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">What We Can Help With</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Technical Support */}
            <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-3 text-xl font-bold text-purple-600">🛠️ Technical Support</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Upload or enrichment issues</li>
                <li>• Export problems (CSV/Excel)</li>
                <li>• Account access difficulties</li>
                <li>• Payment or subscription questions</li>
                <li>• Bug reports</li>
              </ul>
            </div>

            {/* Account Management */}
            <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-3 text-xl font-bold text-blue-600">👤 Account Management</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Subscription upgrades/downgrades</li>
                <li>• Billing enquiries</li>
                <li>• Account cancellation</li>
                <li>• Usage limit questions</li>
                <li>• Plan recommendations</li>
              </ul>
            </div>

            {/* Product Questions */}
            <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-3 text-xl font-bold text-green-600">💡 Product Questions</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• How to use specific features</li>
                <li>• Best practices for contact research</li>
                <li>• Data accuracy questions</li>
                <li>• Feature requests</li>
                <li>• Integration suggestions</li>
              </ul>
            </div>

            {/* Feedback */}
            <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-3 text-xl font-bold text-orange-600">📣 Feedback</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• User experience improvements</li>
                <li>• New feature ideas</li>
                <li>• Success stories</li>
                <li>• Design feedback</li>
                <li>• General suggestions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Response Times */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Response Times</h2>

          <div className="space-y-4">
            <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Standard Support (Free & Professional Plans)</h3>
              <p className="text-gray-700">
                <strong>Within 48 hours</strong> during UK business hours (Monday-Friday, 9am-6pm GMT)
              </p>
            </div>

            <div className="rounded-lg border-2 border-purple-400 bg-purple-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Priority Support (Agency Plan)</h3>
              <p className="text-gray-700">
                <strong>Within 24 hours</strong> during UK business hours (Monday-Friday, 9am-6pm GMT)
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Includes direct access to senior support staff and faster bug resolution.
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-400 bg-red-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Critical Issues</h3>
              <p className="text-gray-700">
                For service outages or critical payment issues affecting multiple users, we aim to respond <strong>within 4 hours</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Before You Contact Us */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Before You Contact Us</h2>

          <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Save Time - Check These First:</h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>📚 Documentation:</strong> Check our{' '}
                <Link href="/docs" className="font-bold text-blue-600 hover:underline">
                  documentation
                </Link>{' '}
                for setup guides and tutorials
              </li>
              <li>
                <strong>💳 Billing:</strong> Manage your subscription directly from your{' '}
                <Link href="/dashboard/settings" className="font-bold text-blue-600 hover:underline">
                  account settings
                </Link>
              </li>
              <li>
                <strong>🔐 Password Reset:</strong> Use the{' '}
                <Link href="/auth/reset-password" className="font-bold text-blue-600 hover:underline">
                  password reset
                </Link>{' '}
                feature on the login page
              </li>
              <li>
                <strong>📊 Usage Limits:</strong> Check your current usage in your{' '}
                <Link href="/dashboard" className="font-bold text-blue-600 hover:underline">
                  dashboard
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* When Contacting Support */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">When Contacting Support</h2>

          <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-4 text-lg font-bold text-gray-900">To Help Us Help You Faster, Please Include:</h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>✅ Your account email address</strong>
                <br />
                <span className="text-sm text-gray-600">(So we can locate your account quickly)</span>
              </li>
              <li>
                <strong>✅ Your subscription plan</strong>
                <br />
                <span className="text-sm text-gray-600">(Free Beta, Professional, or Agency)</span>
              </li>
              <li>
                <strong>✅ Detailed description of the issue</strong>
                <br />
                <span className="text-sm text-gray-600">(What happened? What were you trying to do?)</span>
              </li>
              <li>
                <strong>✅ Steps to reproduce the problem</strong>
                <br />
                <span className="text-sm text-gray-600">(Help us recreate the issue on our end)</span>
              </li>
              <li>
                <strong>✅ Screenshots or error messages</strong>
                <br />
                <span className="text-sm text-gray-600">(Visual context speeds up diagnosis)</span>
              </li>
              <li>
                <strong>✅ Device and browser information</strong>
                <br />
                <span className="text-sm text-gray-600">(e.g., Chrome on Windows, Safari on iPhone)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Other Ways to Stay Updated */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Stay Updated</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-3 text-xl font-bold text-gray-900">📧 Newsletter</h3>
              <p className="mb-4 text-gray-700">
                Get product updates, music industry insights, and promotion tips with <strong>&quot;The Unsigned Advantage&quot;</strong>.
              </p>
              <a
                href="https://totalaudiopromo.com/newsletter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border-2 border-gray-900 bg-purple-100 px-6 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Subscribe Free
              </a>
            </div>

            <div className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-3 text-xl font-bold text-gray-900">🐦 Social Media</h3>
              <p className="mb-4 text-gray-700">Follow us for real-time updates, tips, and industry insights.</p>
              <div className="space-y-2">
                <a
                  href="https://x.com/totalaudiopromo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-bold text-blue-600 hover:underline"
                >
                  X (Twitter): @totalaudiopromo
                </a>
                <a
                  href="https://www.linkedin.com/company/total-audio-promo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-bold text-blue-600 hover:underline"
                >
                  LinkedIn: Total Audio Promo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Business Information</h2>

          <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="mb-2 text-gray-700">
              <strong>Company Name:</strong> Total Audio Promo Ltd
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Location:</strong> United Kingdom
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Support Email:</strong>{' '}
              <a href="mailto:support@totalaudiopromo.com" className="font-bold text-blue-600 hover:underline">
                support@totalaudiopromo.com
              </a>
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Website:</strong>{' '}
              <a href="https://intel.totalaudiopromo.com" className="font-bold text-blue-600 hover:underline">
                intel.totalaudiopromo.com
              </a>
            </p>
          </div>
        </section>

        {/* Legal & Privacy */}
        <section className="border-t-2 border-gray-200 pt-8">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">Legal & Privacy</h3>
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
              href="/terms"
              className="rounded-lg border-2 border-gray-900 bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Terms of Service
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <div className="mt-12 rounded-lg border-2 border-blue-400 bg-blue-50 p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">Ready to Get Started?</h3>
          <p className="mb-6 text-gray-700">
            Audio Intel is built by music industry professionals for music industry professionals. Let&apos;s save you time on contact research.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/beta"
              className="rounded-lg border-2 border-gray-900 bg-purple-200 px-8 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Join Beta (Free)
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border-2 border-gray-900 bg-white px-8 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
