import Link from 'next/image';
import Image from 'next/image';

interface PSEOPageWrapperProps {
  pageName: string;
  topic: string;
  searchVolume: number;
  tier: number;
  children: React.ReactNode;
}

export function PSEOPageWrapper({ pageName, topic, searchVolume, tier, children }: PSEOPageWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-brutal sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/images/total_audio_promo_logo_trans.png" 
                alt="Total Audio Promo Logo" 
                width={40} 
                height={40} 
                className="w-10 h-10" 
              />
              <span className="text-xl font-black text-gray-900">Tracker</span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-semibold hidden sm:inline">
                Home
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-semibold">
                Blog
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-gray-900 font-semibold hidden sm:inline">
                Demo
              </Link>
              <Link href="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Try Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src="/images/total_audio_promo_logo_trans.png" 
                  alt="Total Audio Promo Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 bg-white rounded p-1" 
                />
                <span className="font-black text-lg">Tracker</span>
              </div>
              <p className="text-gray-400 text-sm">
                Campaign intelligence for the music industry. Built by working radio promoters.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/blog/spotify-playlist-campaign-tracking" className="hover:text-white transition-colors">Spotify Campaign Guide</Link></li>
                <li><Link href="/blog/bbc-radio-1-campaign-tracking" className="hover:text-white transition-colors">BBC Radio 1 Tracking</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:info@totalaudiopromo.com" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="https://totalaudiopromo.com" className="hover:text-white transition-colors">Total Audio Promo</a></li>
                <li><a href="https://intel.totalaudiopromo.com" className="hover:text-white transition-colors">Audio Intel</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Tracker - Part of Total Audio Promo • Brighton, UK</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="mt-2 text-xs text-gray-600">
                PSEO: {pageName} | Topic: {topic} | Volume: {searchVolume}/mo | Tier: {tier}
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

