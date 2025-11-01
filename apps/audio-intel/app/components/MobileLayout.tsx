'use client';

import { useEffect, useState } from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`mobile-optimized-layout ${isMobile ? 'is-mobile' : 'is-desktop'}`}>
      <style jsx global>{`
        /* Mobile-first CSS overrides */
        @media (max-width: 767px) {
          /* Header optimizations */
          .header-container {
            padding: 1rem !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(10px) !important;
          }

          .logo-container {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }

          .logo-text {
            font-size: 1.5rem !important;
            font-weight: 900 !important;
          }

          .beta-badge {
            font-size: 0.75rem !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 12px !important;
          }

          /* Hero section mobile optimization */
          .hero-section {
            padding: 2rem 1rem !important;
            text-align: center !important;
          }

          .hero-title {
            font-size: 2rem !important;
            line-height: 1.2 !important;
            margin-bottom: 1rem !important;
          }

          .hero-subtitle {
            font-size: 1rem !important;
            line-height: 1.5 !important;
            margin-bottom: 2rem !important;
          }

          /* Button optimizations */
          .cta-button,
          .primary-button {
            width: 100% !important;
            padding: 1rem 1.5rem !important;
            font-size: 1.125rem !important;
            min-height: 56px !important;
            border-radius: 16px !important;
            margin-bottom: 1rem !important;
          }

          .secondary-button {
            width: 100% !important;
            padding: 1rem 1.5rem !important;
            font-size: 1rem !important;
            min-height: 56px !important;
            border-radius: 12px !important;
          }

          /* Card optimizations */
          .card,
          .pricing-card {
            margin: 1rem 0 !important;
            padding: 1.5rem !important;
            border-radius: 20px !important;
            width: 100% !important;
            max-width: none !important;
          }

          .pricing-title {
            font-size: 1.5rem !important;
            margin-bottom: 0.5rem !important;
          }

          .pricing-price {
            font-size: 2.5rem !important;
            margin-bottom: 1rem !important;
          }

          /* Form optimizations */
          .form-input,
          input[type='text'],
          input[type='email'],
          textarea {
            width: 100% !important;
            padding: 1rem !important;
            font-size: 1rem !important;
            min-height: 56px !important;
            border-radius: 12px !important;
            margin-bottom: 1rem !important;
          }

          /* Demo section */
          .demo-section {
            padding: 2rem 1rem !important;
            margin: 2rem 0 !important;
            border-radius: 24px !important;
          }

          .demo-title {
            font-size: 1.5rem !important;
            margin-bottom: 1rem !important;
          }

          /* Feature grid */
          .feature-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            margin: 2rem 0 !important;
          }

          .feature-card {
            padding: 1.5rem !important;
            border-radius: 20px !important;
            text-align: center !important;
          }

          .feature-icon {
            width: 60px !important;
            height: 60px !important;
            margin: 0 auto 1rem auto !important;
            border-radius: 20px !important;
          }

          /* Text optimizations */
          .section-title {
            font-size: 1.75rem !important;
            line-height: 1.3 !important;
            margin-bottom: 1rem !important;
            text-align: center !important;
          }

          .section-subtitle {
            font-size: 0.95rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1.5rem !important;
            text-align: center !important;
          }

          /* Navigation fixes */
          .nav-menu {
            display: none !important;
          }

          .mobile-menu-button {
            display: block !important;
          }

          /* Spacing fixes */
          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .section {
            padding: 2rem 0 !important;
          }

          /* Typography hierarchy */
          h1 {
            font-size: 2rem !important;
            line-height: 1.2 !important;
          }
          h2 {
            font-size: 1.75rem !important;
            line-height: 1.3 !important;
          }
          h3 {
            font-size: 1.5rem !important;
            line-height: 1.3 !important;
          }
          h4 {
            font-size: 1.25rem !important;
            line-height: 1.4 !important;
          }
          h5 {
            font-size: 1.125rem !important;
            line-height: 1.4 !important;
          }

          p {
            font-size: 1rem !important;
            line-height: 1.6 !important;
          }

          /* Hide desktop-only elements */
          .desktop-only {
            display: none !important;
          }

          /* Show mobile-only elements */
          .mobile-only {
            display: block !important;
          }

          /* Touch-friendly spacing */
          .touchable {
            min-height: 44px !important;
            min-width: 44px !important;
          }

          /* Prevent horizontal scroll */
          body {
            overflow-x: hidden !important;
          }

          .container,
          .wrapper {
            max-width: 100% !important;
            overflow-x: hidden !important;
          }

          /* Improve tab/accordion mobile UX */
          .tabs-list {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }

          .tabs-trigger {
            flex: 1 !important;
            min-width: auto !important;
            padding: 0.75rem 1rem !important;
            font-size: 0.875rem !important;
          }

          /* Modal/dialog mobile optimization */
          .modal-content {
            width: calc(100vw - 2rem) !important;
            max-width: none !important;
            margin: 1rem !important;
            border-radius: 20px !important;
          }

          /* Table responsive */
          .table-container {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }

          table {
            min-width: 600px !important;
          }

          /* Badge/tag optimizations */
          .badge,
          .tag {
            font-size: 0.75rem !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 12px !important;
          }

          /* Animation optimizations for mobile */
          .animate-in {
            animation-duration: 0.3s !important;
          }

          /* Reduce motion for better mobile performance */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        }

        /* Tablet optimizations */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-title {
            font-size: 3rem !important;
          }

          .hero-subtitle {
            font-size: 1.25rem !important;
          }

          .feature-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .cta-button,
          .primary-button {
            width: auto !important;
            max-width: 320px !important;
          }
        }
      `}</style>

      {children}
    </div>
  );
}
