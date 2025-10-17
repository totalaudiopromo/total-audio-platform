import { SiteFooter } from '@/components/shared/SiteFooter';

export function TrackerFooter() {
  return (
    <SiteFooter
      toolName="Tracker"
      description="Simple campaign tracking for indie artists and radio promoters. Stop using spreadsheets."
      accentColor="teal"
      productLinks={[
        { href: '/pricing', label: 'Pricing' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/blog', label: 'Blog' },
      ]}
    />
  );
}


