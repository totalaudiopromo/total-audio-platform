import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Shield, UploadCloud } from 'lucide-react';
import SpreadsheetUploader from '@/components/SpreadsheetUploader';

export const metadata: Metadata = {
  title: 'Contact Upload | Audio Intel',
  description:
    'Upload your contact spreadsheets and let Audio Intel clean, validate, and enrich every record in minutes.',
};

export default function UploadPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
          <UploadCloud className="h-4 w-4" aria-hidden="true" />
          Upload Workflow
        </p>
        <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">
          Upload Contacts for Enrichment
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Bring your CSV or Excel files and Audio Intel will clean, dedupe, and enrich every contact
          with submission-ready intelligence.
        </p>
      </header>

      <form aria-label="Upload contacts form" className="space-y-8">
        <fieldset className="space-y-8">
          <legend className="sr-only">Upload your contact spreadsheet</legend>
          <SpreadsheetUploader />
        </fieldset>
      </form>

      <section className="glass-panel border-blue-500 bg-gradient-to-br from-blue-50 to-white text-left">
        <h2 className="text-2xl font-bold text-gray-900">Mobile-friendly guidance</h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
            <span>
              Tap the <strong>“Upload contact spreadsheet”</strong> button above to open the native
              file picker on iOS, Android, or tablet devices.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
            <span>
              Supported formats include <strong>.csv</strong>, <strong>.xlsx</strong>, and{' '}
              <strong>.xls</strong>. Drag-and-drop also works on desktop browsers.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
            <span>
              Your files never leave Audio Intel’s secure processors—nothing is stored after
              enrichment completes.
            </span>
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="subtle-button w-full sm:w-auto">
            ← Back to homepage
          </Link>
          <Link href="/pricing" className="cta-button w-full sm:w-auto">
            View pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
