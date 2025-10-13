import { SiteFooter as SharedSiteFooter } from '@/components/shared/SiteFooter';

export function SiteFooter() {
  return (
    <SharedSiteFooter
      toolName="Audio Intel"
      description="AI-powered contact enrichment for music promoters. Built by Total Audio Promo."
      productLinks={[
        { href: '/pricing', label: 'Pricing' },
        { href: '/demo', label: 'Dashboard' },
        { href: '/beta', label: 'Beta Access' },
      ]}
      accentColor="blue"
    />
  );
}
