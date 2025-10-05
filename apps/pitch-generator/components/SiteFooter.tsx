import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-8 lg:px-0">
      <div className="glass-panel px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand Section */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-gray-900">Pitch Generator</p>
            <p className="mt-2 max-w-xs text-sm text-gray-600">
              AI-powered music PR pitches that get responses. Built by Total Audio Promo.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/pricing" className="text-sm text-gray-600 transition hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-600 transition hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Company</p>
              <ul className="mt-3 space-y-2">
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
                <li>
                  <a
                    href="https://intel.totalaudiopromo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 transition hover:text-blue-600"
                  >
                    Audio Intel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t-2 border-gray-200 pt-6">
          <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Total Audio Promo. Built for music industry professionals.</p>
            <p className="text-gray-400">Made with focus in the UK</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
