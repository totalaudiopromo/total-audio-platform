import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-8 lg:px-0">
      <div className="glass-panel px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand Section */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-gray-900">Audio Intel</p>
            <p className="mt-2 max-w-xs text-sm text-gray-600">
              AI-powered contact enrichment for music promoters. Built by Total Audio Promo.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/pricing" className="text-sm text-gray-600 transition hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-sm text-gray-600 transition hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/beta" className="text-sm text-gray-600 transition hover:text-blue-600">
                    Beta Access
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Other Tools</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="https://tracker.totalaudiopromo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 transition hover:text-blue-600"
                  >
                    Tracker
                  </a>
                </li>
                <li>
                  <a
                    href="https://pitch.totalaudiopromo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 transition hover:text-blue-600"
                  >
                    Pitch Generator
                  </a>
                </li>
                <li>
                  <a
                    href="https://totalaudiopromo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 transition hover:text-blue-600"
                  >
                    Total Audio Promo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Newsletter</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="https://totalaudiopromo.com/newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    The Unsigned Advantage
                  </a>
                </li>
                <li>
                  <p className="text-xs text-gray-500">
                    Weekly insights for independent artists
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t-2 border-gray-200 pt-6">
          <div className="flex flex-col gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-xs">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Cookie Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Contact & Support
              </Link>
            </div>
            {/* Copyright */}
            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Total Audio Promo Ltd. Built for music industry professionals.</p>
              <p className="text-gray-400">Made with focus in the UK 🇬🇧</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
