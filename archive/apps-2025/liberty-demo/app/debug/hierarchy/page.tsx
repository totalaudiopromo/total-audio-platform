'use client';

export default function HierarchyDebugPage() {
  return (
    <div className="p-12 space-y-16 bg-tap-bg min-h-screen">
      {/* Page Title */}
      <h1 className="font-heading font-normal tracking-tight text-4xl text-tap-text">
        Liberty — Visual Hierarchy Debug
      </h1>

      {/* Section 1: Heading System */}
      <section className="bg-tap-panel p-10 rounded-xl border border-tap-line space-y-6">
        <h2 className="font-heading font-normal tracking-tight text-2xl">
          1. Headings & Page Sections
        </h2>

        <div className="space-y-4">
          <h1 className="font-heading font-normal tracking-tight text-4xl">H1 — Page Title</h1>
          <h2 className="font-heading font-normal tracking-tight text-2xl">H2 — Section Title</h2>
          <h3 className="font-heading font-normal tracking-tight text-xl">H3 — Subsection</h3>
          <h4 className="font-heading font-normal tracking-tight text-lg">H4 — Block Label</h4>
          <h5 className="font-heading font-normal tracking-tight text-base">H5 — Internal Label</h5>
        </div>

        <p className="font-sans text-sm text-tap-muted">
          Check spacing between headings — should be descending by scale, not equal.
        </p>
      </section>

      {/* Section 2: Card Density */}
      <section className="bg-tap-panel p-10 rounded-xl border border-tap-line space-y-8">
        <h2 className="font-heading font-normal tracking-tight text-2xl">
          2. Card Density & Vertical Rhythm
        </h2>

        <div className="grid grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-tap-line bg-white">
            <p className="font-sans text-sm text-tap-muted">Light Density</p>
            <p className="font-mono text-4xl">209</p>
            <p className="font-sans text-sm text-tap-muted">total outreach</p>
          </div>

          <div className="p-8 rounded-xl border border-tap-line bg-white">
            <p className="font-sans text-sm text-tap-muted">Medium Density</p>
            <p className="font-mono text-4xl">209</p>
            <p className="font-sans text-sm text-tap-muted">total outreach</p>
          </div>

          <div className="p-10 rounded-xl border border-tap-line bg-white">
            <p className="font-sans text-sm text-tap-muted">High Density</p>
            <p className="font-mono text-4xl">209</p>
            <p className="font-sans text-sm text-tap-muted">total outreach</p>
          </div>
        </div>

        <p className="font-sans text-sm text-tap-muted">
          Compare padding: p-6 vs p-8 vs p-10. Liberty should standardise to p-8 for information
          cards.
        </p>
      </section>

      {/* Section 3: Spacing Scale */}
      <section className="bg-tap-panel p-10 rounded-xl border border-tap-line space-y-8">
        <h2 className="font-heading font-normal tracking-tight text-2xl">3. Spacing Scale Audit</h2>

        <div className="space-y-6">
          <div className="h-4 bg-green-300 rounded"></div>
          <p className="font-mono text-sm">gap-4</p>

          <div className="h-6 bg-green-400 rounded"></div>
          <p className="font-mono text-sm">gap-6</p>

          <div className="h-8 bg-green-500 rounded"></div>
          <p className="font-mono text-sm">gap-8</p>

          <div className="h-10 bg-green-600 rounded"></div>
          <p className="font-mono text-sm">gap-10</p>
        </div>

        <p className="font-sans text-sm text-tap-muted">
          Liberty default spacing should be mainly gap-6 and gap-8. Avoid gap-4 unless
          metadata-only.
        </p>
      </section>

      {/* Section 4: Metadata Weighting */}
      <section className="bg-tap-panel p-10 rounded-xl border border-tap-line space-y-8">
        <h2 className="font-heading font-normal tracking-tight text-2xl">
          4. Metadata & Label Balance
        </h2>

        <div className="space-y-4">
          <p className="font-sans text-sm text-tap-muted">Muted label</p>
          <p className="font-sans text-sm text-tap-text">Normal label</p>
          <p className="font-sans text-base text-tap-text">Body</p>
          <p className="font-mono text-sm text-tap-muted">Metadata → 12 Feb, 13:42</p>
          <p className="font-mono text-xs text-tap-muted">Small metadata → 5 days ago</p>
        </div>

        <p className="font-sans text-sm text-tap-muted">
          Check that metadata does not overpower section headings or key metrics.
        </p>
      </section>

      {/* Section 5: Grid Alignment Check */}
      <section className="bg-tap-panel p-10 rounded-xl border border-tap-line space-y-6">
        <h2 className="font-heading font-normal tracking-tight text-2xl">5. Grid Alignment</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-white border border-tap-line rounded-xl"></div>
          <div className="h-32 bg-white border border-tap-line rounded-xl"></div>
          <div className="h-32 bg-white border border-tap-line rounded-xl"></div>
          <div className="h-32 bg-white border border-tap-line rounded-xl"></div>
          <div className="h-32 bg-white border border-tap-line rounded-xl"></div>
        </div>

        <p className="font-sans text-sm text-tap-muted">
          This grid ensures all cards on Overview, CRM, Ops Hub, Asset Hub align consistently.
        </p>
      </section>
    </div>
  );
}
