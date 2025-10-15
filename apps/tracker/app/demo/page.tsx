import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-2xl font-black text-gray-900">Tracker</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-semibold">
                Home
              </Link>
              <Link href="/signup" className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors">
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Tracker Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See how campaign intelligence works in practice
          </p>
          <Link 
            href="/signup"
            className="inline-block bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-amber-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Start Tracking Free
          </Link>
        </div>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Demo Coming Soon</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're building an interactive demo to show you exactly how Tracker's campaign intelligence works.
          </p>
          <p className="text-gray-600">
            In the meantime, you can start tracking your campaigns right now with our free tier.
          </p>
        </div>
      </main>
    </div>
  );
}