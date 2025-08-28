import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/assets/totalaudiopromo-dog-logo.jpg" alt="Total Audio Promo Logo" width={48} height={48} className="rounded-lg shadow-sm" />
              <span className="text-xl font-bold text-gray-700">Total Audio Promo</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
              <Link href="/contacts" className="text-gray-600 hover:text-gray-900 font-medium">Contacts</Link>
              <Link href="/campaigns" className="text-gray-600 hover:text-gray-900 font-medium">Campaigns</Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium">Reports</Link>
              <Link href="/integrations" className="text-gray-600 hover:text-gray-900 font-medium">Integrations</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] flex items-center justify-center" style={{ backgroundImage: 'url(/assets/Luma Gradients/DRS_4K_Luma Gradient_35.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/assets/DRS - Paper - Black 01.jpg)', opacity: 0.15, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="flex justify-center mb-8">
            <div className="rounded-full shadow-xl bg-white/80 p-6">
              <Image
                src="/assets/dog-logo.png"
                alt="Total Audio Promo Mascot"
                width={120}
                height={120}
                priority
                className="drop-shadow-lg"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            Total Audio Promo
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            No-BS radio promo. Automation that feels human.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/dashboard" 
              className="bg-yellow-500 text-gray-900 rounded-lg px-8 py-4 text-lg font-bold shadow-lg hover:bg-yellow-600 transition-all hover:scale-105 border-2 border-yellow-700"
            >
              Demo Login
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white rounded-lg px-8 py-4 text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/contacts" 
              className="bg-gray-900 text-white rounded-lg px-8 py-4 text-lg font-semibold shadow-lg hover:bg-gray-800 transition-all hover:scale-105"
            >
              View Contacts Database
            </Link>
            <Link 
              href="/campaigns" 
              className="bg-green-600 text-white rounded-lg px-8 py-4 text-lg font-semibold shadow-lg hover:bg-green-700 transition-all hover:scale-105"
            >
              Start Campaign
            </Link>
          </div>
        </div>
      </div>

      {/* Brand Positioning */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Built by an artist, for artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency over hype</h3>
                <p className="text-gray-600">Real results, no fluff</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real relationships, real results</h3>
                <p className="text-gray-600">Personal approach at scale</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart systems that save time</h3>
                <p className="text-gray-600">Automation that feels human</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Total Audio Promo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon="📊"
            title="Proven Results with Real Data"
            description="Track response rates, engagement metrics, and campaign performance with detailed analytics."
          />
          <FeatureCard 
            icon="💰"
            title="DIY-Friendly Tools and Pricing"
            description="Affordable pricing with powerful tools that don't require a full agency team."
          />
          <FeatureCard 
            icon="🎵"
            title="Built from Real Industry Experience"
            description="Created by someone who's been in your shoes - an artist who understands the industry."
          />
          <FeatureCard 
            icon="📱"
            title="Smart Contact Management"
            description="Organize journalists, DJs, and influencers with advanced filtering and search."
          />
          <FeatureCard 
            icon="📈"
            title="Campaign Automation"
            description="Automate outreach while maintaining personal touch and relationship building."
          />
          <FeatureCard 
            icon="🔗"
            title="Seamless Integrations"
            description="Connect with Airtable, Mailchimp, and other tools you already use."
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Get Started Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard 
              title="Dashboard"
              description="View your overview and quick actions"
              href="/dashboard"
              icon="📊"
            />
            <QuickActionCard 
              title="Manage Contacts"
              description="Organize your PR contacts and journalist database"
              href="/contacts"
              icon="👥"
            />
            <QuickActionCard 
              title="Create Campaigns"
              description="Launch targeted PR campaigns with automation"
              href="/campaigns"
              icon="📢"
            />
            <QuickActionCard 
              title="View Analytics"
              description="Track performance and response rates"
              href="/analytics"
              icon="📈"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Audio Promo</h3>
              <p className="text-gray-400">No-BS radio promo. Automation that feels human.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contacts" className="hover:text-white">Contacts</Link></li>
                <li><Link href="/campaigns" className="hover:text-white">Campaigns</Link></li>
                <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Total Audio Promo. Built by an artist, for artists.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function QuickActionCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: string }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all hover:scale-105">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
} 