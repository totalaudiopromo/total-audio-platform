import Link from 'next/link';

const featureHighlights = [
  {
    title: 'Styled like intel.totalaudiopromo.com',
    description: 'Typography, gradients, and glass surfaces matched to the live Audio Intel experience so every new tool shares the same visual language.',
    metric: 'Brand parity in minutes',
  },
  {
    title: 'Postcraft component patterns',
    description: 'Navigation, hero shells, and panel layouts tuned for storytelling-first landing pages with embedded call-to-actions.',
    metric: '3 pre-styled surfaces',
  },
  {
    title: 'Guarded dashboards',
    description: 'Protected routes, session awareness, and a signed-in workspace scaffold that is ready for feature modules.',
    metric: 'OAuth-ready from the start',
  },
];

const timeline = [
  {
    label: 'Clone template',
    detail: 'Copy the directory or run the bootstrap script to start a fresh micro-tool.',
  },
  {
    label: 'Update copy & branding',
    detail: 'Swap hero messaging, pricing tiers, and CTA text in a single file per surface.',
  },
  {
    label: 'Ship your unique feature',
    detail: 'Drop new routes/components into the protected area—auth state and layout already exist.',
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <section className="glass-panel overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="badge-postcraft">Total Audio Promo · SaaS Micro Tool Factory</span>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Launch every mini tool with
              <span className="block bg-gradient-to-r from-brand-iris via-brand-magenta to-brand-amber bg-clip-text text-transparent">Postcraft polish</span>
            </h1>
            <p className="max-w-xl text-base text-white/70 sm:text-lg">
              This template mirrors the intel.totalaudiopromo.com look and feel. It ships with marketing pages, pricing flows, Stripe checkout, and guarded dashboards so you can focus on the differentiator, not the boilerplate.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/pricing" className="cta-button">Review pricing flow</Link>
              <Link href="/auth/signin" className="subtle-button">Preview sign-in experience</Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-brand-iris/35 via-brand-magenta/25 to-brand-amber/25 blur-2xl" aria-hidden />
              <div className="relative glass-panel px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">Template snapshot</p>
                <h2 className="mt-4 text-2xl font-bold">Included surfaces</h2>
                <ul className="mt-6 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-iris shadow-[0_0_12px_rgba(76,92,246,0.45)]" />
                    <span>Marketing hero, feature grid, and CTA blocks styled with Postcraft gradients.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-magenta shadow-[0_0_12px_rgba(201,84,247,0.4)]" />
                    <span>Stripe-enabled pricing screen with ready-to-wire plan cards.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-amber shadow-[0_0_12px_rgba(255,200,87,0.45)]" />
                    <span>Protected profile and settings areas with OAuth guard.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureHighlights.map(feature => (
          <div key={feature.title} className="glass-panel h-full px-6 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">{feature.metric}</p>
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-3 text-sm text-white/70">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/40">Build ritual</p>
            <h2 className="text-3xl font-semibold">Clone, customise, ship</h2>
            <p className="text-sm text-white/70">
              Every checklist in this template mirrors the path you use to spin up new ideas. Swap the descriptive copy, drop in product screenshots, and push to Vercel. The guardrails keep the presentation consistent.
            </p>
          </div>
          <div className="flex-1">
            <ol className="space-y-4">
              {timeline.map((step, index) => (
                <li key={step.label} className="glass-panel flex items-start gap-4 px-5 py-5 sm:px-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/80">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/40">{step.label}</p>
                    <p className="mt-1 text-sm text-white/70">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Ready to drop your next experiment?</h2>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Duplicate this template, wire your API calls, and roll out another Total Audio Promo experience in a single sprint.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/pricing" className="cta-button">Test checkout flow</Link>
            <Link href="/profile" className="subtle-button">View authenticated area</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
