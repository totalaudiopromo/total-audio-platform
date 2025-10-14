import { SiteFooter as SharedSiteFooter } from './SharedSiteFooter';

export function SiteFooter() {
  return (
    <SharedSiteFooter
      toolName="Pitch Generator"
      description="AI-powered music PR pitches that get responses. Built by Total Audio Promo."
      productLinks={[
        { href: '/pricing', label: 'Pricing' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/blog', label: 'Blog' },
      ]}
      accentColor="purple"
    />
  );
}
