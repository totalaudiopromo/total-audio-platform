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
  accentColor?: 'purple' | 'blue' | 'amber' | 'teal';
}

const defaultProductLinks: SiteFooterLink[] = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/blog', label: 'Blog' },
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
  amber: 'hover:text-teal-600',
  teal: 'hover:text-teal-600',
};

export function SiteFooter({
  toolName,
  description = 'Built by Total Audio Promo for music industry professionals.',
  productLinks = defaultProductLinks,
  accentColor = 'teal',
}: SiteFooterProps) {
  const hoverClass = accentHover[accentColor];

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-8 lg:px-0">
      <div className="glass-panel px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand Section */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-gray-900">{toolName}</p>
            <p className="mt-2 max-w-xs text-sm text-gray-600">{description}</p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product</p>
              <ul className="mt-3 space-y-2">
                {productLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={`text-sm text-gray-600 transition ${hoverClass}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Other Tools</p>
              <ul className="mt-3 space-y-2">
                {otherTools.map(tool => (
                  <li key={tool.href}>
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm text-gray-600 transition ${hoverClass}`}
                    >
                      {tool.label}
                    </a>
                  </li>
                ))}
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
                    className={`text-sm font-medium transition ${hoverClass}`}
                  >
                    The Unsigned Advantage
                  </a>
                </li>
                <li>
                  <a
                    href="https://totalaudiopromo.com/newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm text-gray-600 transition ${hoverClass}`}
                  >
                    Subscribe
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t-2 border-gray-200 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Total Audio Promo. Built for music industry professionals.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className={`text-xs text-gray-500 transition ${hoverClass}`}>
              Privacy
            </Link>
            <Link href="/terms" className={`text-xs text-gray-500 transition ${hoverClass}`}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


