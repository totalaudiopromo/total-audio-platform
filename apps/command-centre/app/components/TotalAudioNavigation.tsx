'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Share2, 
  Radio, 
  Newspaper, 
  DollarSign, 
  Settings, 
  Menu, 
  X,
  Zap
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3, tool: 'command-centre' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, tool: 'audio-intel' },
  { name: 'Business', href: '/business-dashboard', icon: DollarSign, tool: 'success-predict' },
  { name: 'Marketing', href: '/marketing', icon: Share2, tool: 'content-clone' },
  { name: 'Reports', href: '/reports', icon: FileText, tool: 'trend-track' },
  { name: 'Social Hub', href: '/social-media-hub', icon: Share2, tool: 'playlist-pulse' },
  { name: 'Newsjacking', href: '/newsjacking', icon: Newspaper, tool: 'release-radar' },
  { name: 'Revenue', href: '/revenue-intelligence', icon: TrendingUp, tool: 'success-predict' },
  { name: 'Beta Users', href: '/beta-management', icon: Users, tool: 'audio-intel' },
  { name: 'System', href: '/system-status', icon: Settings, tool: 'command-centre' },
];

export default function TotalAudioNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="tap-nav hidden md:block">
        <div className="tap-nav-container">
          <Link href="/" className="tap-nav-brand">
            <div className="audio-mascot" />
            <span>Command Centre</span>
          </Link>
          
          <div className="tap-nav-links">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`tap-nav-link ${isActive ? 'active' : ''} ${item.tool}`}
                  onClick={() => {
                    // Activate Audio mascot for this tool
                    const mascot = document.querySelector('.audio-mascot');
                    if (mascot) {
                      mascot.classList.add('activated');
                      setTimeout(() => mascot.classList.remove('activated'), 1000);
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="tap-nav md:hidden">
        <div className="tap-nav-container">
          <Link href="/" className="tap-nav-brand">
            <div className="audio-mascot" />
            <span>Command Centre</span>
          </Link>
          
          <button
            onClick={toggleMobileMenu}
            className="tap-button tap-button-secondary tap-p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="tap-p-4 tap-border-t tap-border-gray-200">
            <div className="tap-grid tap-grid-2 tap-gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`tap-button tap-button-secondary tap-flex tap-items-center tap-gap-2 tap-justify-center ${
                      isActive ? 'active' : ''
                    } ${item.tool}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      // Activate Audio mascot for this tool
                      const mascot = document.querySelector('.audio-mascot');
                      if (mascot) {
                        mascot.classList.add('activated');
                        setTimeout(() => mascot.classList.remove('activated'), 1000);
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}


