import Link from 'next/link';

export interface SiteFooterLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface SiteFooterProps {
  /** Tool name (e.g., "Audio Intel", "Tracker") */
  toolName: string;
  /** Tool description for branding section */
  description?: string;
  /** Product-specific links (pricing, dashboard, etc.) */
  productLinks?: SiteFooterLink[];
  /** Accent color for hover effects */
  accentColor?: 'purple' | 'blue' | 'amber';
}

const defaultProductLinks: SiteFooterLink[] = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
];

const otherTools = [
  { href: 'https://tracker.totalaudiopromo.com', label: 'Tracker', external: true },
  { href: 'https://pitch.totalaudiopromo.com', label: 'Pitch Generator', external: true },
  { href: 'https://intel.totalaudiopromo.com', label: 'Audio Intel', external: true },
  { href: 'https://totalaudiopromo.com', label: 'Total Audio Promo', external: true },
];

const accentHover = {
  purple: 'hover:text-purple-600',
  blue: 'hover:text-blue-600',
  amber: 'hover:text-amber-600',
};

export function SiteFooter({
  toolName,
  description = 'Built by Total Audio Promo for music industry professionals.',
  productLinks = defaultProductLinks,
  accentColor = 'purple',
}: SiteFooterProps) {
  const hoverClass = accentHover[accentColor];

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-8 lg:px-0">
      <div className="glass-panel px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand Section */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-gray-900">{toolName}</p>
            <p className="mt-2 max-w-xs text-sm text-gray-600">{description}</p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Product
              </p>
              <ul className="mt-3 space-y-1">
                {productLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`inline-block py-2 text-sm text-gray-600 transition ${hoverClass} min-h-[44px] flex items-center`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Other Tools
              </p>
              <ul className="mt-3 space-y-1">
                {otherTools.map(tool => (
                  <li key={tool.href}>
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block py-2 text-sm text-gray-600 transition ${hoverClass} min-h-[44px] flex items-center`}
                    >
                      {tool.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Newsletter
              </p>
              <ul className="mt-3 space-y-1">
                <li>
                  <a
                    href="https://totalaudiopromo.com/newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block py-2 text-sm font-medium transition ${hoverClass} min-h-[44px] flex items-center`}
                  >
                    The Unsigned Advantage
                  </a>
                </li>
                <li>
                  <p className="text-xs text-gray-500">Weekly insights for independent artists</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t-2 border-gray-200 pt-6">
          <div className="flex flex-col gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Link
                href="/privacy"
                className={`inline-flex items-center py-2 px-2 text-gray-600 font-medium transition ${hoverClass} min-h-[44px]`}
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className={`inline-flex items-center py-2 px-2 text-gray-600 font-medium transition ${hoverClass} min-h-[44px]`}
              >
                Cookie Policy
              </Link>
              <Link
                href="/terms"
                className={`inline-flex items-center py-2 px-2 text-gray-600 font-medium transition ${hoverClass} min-h-[44px]`}
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center py-2 px-2 text-gray-600 font-medium transition ${hoverClass} min-h-[44px]`}
              >
                Contact & Support
              </Link>
            </div>
            {/* Copyright */}
            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Total Audio Promo Ltd. Built for music industry
                professionals.
              </p>
              <p className="text-gray-400">Made with focus in the UK 🇬🇧</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
