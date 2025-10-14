import Link from "next/link"
import { Home, Sparkles, FileText, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">

        {/* 404 Message */}
        <div className="mb-8">
          <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Pitch Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or the URL could be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white font-black text-lg px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all hover:bg-amber-600"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>

          <Link
            href="/pitch/generate"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 font-black text-lg px-8 py-4 border-2 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Generate Pitch
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="glass-panel p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6">
            Looking for something specific?
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3 text-left">
              <Link href="/pitch/generate" className="block text-amber-600 hover:text-amber-700 font-bold text-lg transition-colors hover:translate-x-1 duration-200">
                → Generate New Pitch
              </Link>
              <Link href="/pitch/history" className="block text-amber-600 hover:text-amber-700 font-bold text-lg transition-colors hover:translate-x-1 duration-200">
                → View Pitch History
              </Link>
              <Link href="/pitch/templates" className="block text-amber-600 hover:text-amber-700 font-bold text-lg transition-colors hover:translate-x-1 duration-200">
                → Browse Templates
              </Link>
            </div>
            <div className="space-y-3 text-left">
              <Link href="/pricing" className="block text-amber-600 hover:text-amber-700 font-bold text-lg transition-colors hover:translate-x-1 duration-200">
                → View Pricing Plans
              </Link>
              <Link href="/blog" className="block text-amber-600 hover:text-amber-700 font-bold text-lg transition-colors hover:translate-x-1 duration-200">
                → Read Our Blog
              </Link>
              <Link href="/" className="block text-amber-600 hover:text-amber-700 font-bold text-lg transition-colors hover:translate-x-1 duration-200">
                → Back to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-medium">
            Still can't find what you need?
            <a href="mailto:support@totalaudiopromo.com" className="text-amber-600 hover:text-amber-700 ml-1 font-bold transition-colors">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
