import { SiteFooter as SharedSiteFooter } from '@total-audio/ui';

export function SiteFooter() {
  return (
    <SharedSiteFooter
      toolName="Tracker"
      description="AI-powered campaign tracking for music promoters. Built by Total Audio Promo."
      productLinks={[
        { href: '/pricing', label: 'Pricing' },
        { href: '/dashboard', label: 'Dashboard' },
      ]}
      accentColor="amber"
    />
  );
}
