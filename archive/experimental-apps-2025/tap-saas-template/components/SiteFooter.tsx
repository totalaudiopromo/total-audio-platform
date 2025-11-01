export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-8 lg:px-0">
      <div className="glass-panel flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-gray-500">
            Postcraft Framework
          </p>
          <p className="text-sm text-gray-600">
            A reusable starter for Total Audio Promo micro-tools.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Total Audio Promo</span>
          <span className="hidden h-4 w-px bg-gray-300 sm:inline" aria-hidden />
          <span>Built for rapid audio SaaS launches</span>
        </div>
      </div>
    </footer>
  );
}
