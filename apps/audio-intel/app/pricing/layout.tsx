import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Audio Intel – Contact Enrichment for Music Promotion',
  description:
    'Simple pricing in £GBP for independent artists, PR agencies, and labels. Free beta, Professional £19.99/mo, Agency £39.99/mo.',
  openGraph: {
    url: 'https://intel.totalaudiopromo.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
