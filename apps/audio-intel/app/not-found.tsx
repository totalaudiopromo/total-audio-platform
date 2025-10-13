import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Error State Dog Logo */}
        <div className="mb-8">
          <Image 
            src="/assets/loading-states/error-state.png"
            alt="Audio Intel mascot looking confused - page not found"
            width={200}
            height={200}
            className="mx-auto mb-6"
            priority
          />
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h1 className="text-8xl font-black text-gray-300 mb-4">404</h1>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl font-bold text-gray-600 mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist.
            It might have been moved, deleted, or the link might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link href="/demo">
            <Button variant="outline" size="lg" className="font-bold text-lg px-8 py-4 border-2 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <Search className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white p-6 rounded-2xl border-4 border-gray-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black text-gray-900 mb-4">
            Looking for something specific?
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Link href="/demo" className="block text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
                → Try Audio Intel Demo
              </Link>
              <Link href="/beta" className="block text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
                → Join Beta Program
              </Link>
              <Link href="/pricing" className="block text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
                → View Pricing Plans
              </Link>
            </div>
            <div className="space-y-3">
              <Link href="/documentation" className="block text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
                → Read Documentation
              </Link>
              <Link href="/about" className="block text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
                → About Audio Intel
              </Link>
              <Link href="/blog" className="block text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
                → Music Industry Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-bold">
            Still can't find what you need? 
            <a href="mailto:support@totalaudiopromo.com" className="text-blue-600 hover:text-blue-700 ml-1 transition-colors">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}