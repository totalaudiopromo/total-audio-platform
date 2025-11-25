'use client';

export default function TypographyDebugPage() {
  return (
    <div className="p-12 space-y-12 bg-tap-bg text-tap-text">
      <h1 className="font-heading font-normal tracking-tight text-4xl">
        Liberty — Typography Debug View
      </h1>

      {/* Serif Headings */}
      <section className="bg-tap-panel p-8 rounded-xl border border-tap-line">
        <h2 className="font-heading font-normal tracking-tight text-2xl">
          Serif Headings (EB Garamond)
        </h2>
        <h1 className="font-heading font-normal tracking-tight text-4xl">
          H1 — The Ladybird Campaign
        </h1>
        <h2 className="font-heading font-normal tracking-tight text-2xl">H2 — Artist Overview</h2>
        <h3 className="font-heading font-normal tracking-tight text-xl">
          H3 — Timeline & Coverage
        </h3>
        <h4 className="font-heading font-normal tracking-tight text-lg">H4 — Intake & Assets</h4>
      </section>

      {/* Sans Body Text */}
      <section className="bg-tap-panel p-8 rounded-xl border border-tap-line">
        <h2 className="font-heading font-normal tracking-tight text-2xl">Sans Body Text (Inter)</h2>
        <p className="font-sans text-base">
          This is standard body text. Liberty uses Inter for all body copy, interface elements,
          labels and descriptions.
        </p>
        <p className="font-sans text-base">Slightly larger paragraph for expanded UI sections.</p>
        <p className="font-sans text-sm">
          Smaller metadata body text for labels and subtle UI moments.
        </p>
      </section>

      {/* Mono Numbers / Metadata */}
      <section className="bg-tap-panel p-8 rounded-xl border border-tap-line">
        <h2 className="font-heading font-normal tracking-tight text-2xl">
          Mono Numbers & Metadata (JetBrains Mono)
        </h2>

        <p className="font-mono text-3xl">88</p>
        <p className="font-mono text-xl">58%</p>
        <p className="font-mono text-xl">£52k</p>
        <p className="font-mono text-3xl">209</p>
        <p className="font-mono text-sm">31 Jan 2025 — 14:22</p>
      </section>

      {/* Components */}
      <section className="bg-tap-panel p-8 rounded-xl border border-tap-line space-y-6">
        <h2 className="font-heading font-normal tracking-tight text-2xl">Component Simulation</h2>

        {/* KPI Card */}
        <div className="p-6 rounded-xl border border-tap-line bg-white">
          <p className="font-sans text-sm text-tap-muted">TOTAL OUTREACH</p>
          <p className="font-mono text-3xl leading-none">209</p>
          <p className="font-mono text-sm text-green-600 leading-none">+15%</p>
        </div>

        {/* Campaign Card Title */}
        <div className="p-6 rounded-xl border border-tap-line bg-white">
          <h3 className="font-heading font-normal tracking-tight text-xl">
            Ladybird — Single Campaign
          </h3>
          <p className="font-sans text-sm text-tap-muted">KYARA</p>
        </div>

        {/* Intake Row */}
        <div className="p-6 rounded-xl border border-tap-line bg-white flex justify-between">
          <div>
            <p className="font-sans text-sm font-medium">Concerta</p>
            <p className="font-mono text-sm text-tap-muted">5 Feb, 11:47</p>
          </div>
          <p className="font-mono text-xl leading-none">61%</p>
        </div>

        {/* Automation Node */}
        <div className="p-6 rounded-xl border border-tap-line bg-white">
          <p className="font-heading font-normal tracking-tight text-lg">Trigger: Coverage Found</p>
          <p className="font-mono text-sm text-tap-muted">WARM / CoverageBook</p>
        </div>
      </section>
    </div>
  );
}
