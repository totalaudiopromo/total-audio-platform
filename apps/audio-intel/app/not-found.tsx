import Link from 'next/link';

/**
 * Simple 404 page for static generation compatibility
 * Note: Kept minimal to avoid RSC serialisation issues with process.env
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-blue-50 to-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-5xl font-black text-blue-600">404</span>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl">Page Not Found</h1>

          <p className="mt-4 text-lg text-gray-700">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-4 border-black bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-blue-700"
            >
              Go Home
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
