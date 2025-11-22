'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description: string;
  status?: 'active' | 'beta' | 'new';
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: 'BarChart3',
    description: 'Business overview and metrics',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: 'TrendingUp',
    description: 'Deep dive into business metrics',
    status: 'active',
  },
  {
    id: 'radio-promo',
    label: 'Radio Promo',
    href: '/radio-promo',
    icon: 'Radio',
    description: 'Liberty Music PR workflow verification',
    status: 'new',
  },
  {
    id: 'social-media-hub',
    label: 'Social Media Hub',
    href: '/social-media-hub',
    icon: 'Share',
    description: 'Multi-platform content creation and scheduling',
    status: 'new',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: 'FileText',
    description: 'Business intelligence reports',
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: 'Users',
    description: 'User management and permissions',
  },
  {
    id: 'beta-management',
    label: 'Beta Management',
    href: '/beta-management',
    icon: 'FlaskConical',
    description: 'Manage beta users and signups',
    status: 'beta',
  },
  {
    id: 'newsjacking',
    label: 'Content Review',
    href: '/newsjacking',
    icon: 'Newspaper',
    description: 'Review AI-generated content',
  },
  {
    id: 'marketing',
    label: 'Marketing Agent',
    href: '/marketing',
    icon: 'Bot',
    description: 'Automated content generation',
    status: 'new',
  },
];

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'beta':
        return '#f59e0b';
      case 'new':
        return '#ef4444';
      default:
        return 'transparent';
    }
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div
        style={{
          width: isCollapsed ? '100px' : '320px',
          background: 'white',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          border: '4px solid #2563eb',
          borderRadius: '0 24px 24px 0',
          boxShadow: '12px 12px 0px 0px rgba(0, 0, 0, 1)',
          margin: '1rem 0 1rem 1rem',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '2rem 1.5rem',
            borderBottom: '3px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '0 20px 0 0',
            margin: '-4px -4px 0 -4px',
          }}
        >
          {!isCollapsed && (
            <div>
              <h1
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  margin: 0,
                  textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                }}
              >
                Command Centre
              </h1>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem',
                  margin: '0.25rem 0 0 0',
                  fontWeight: '600',
                }}
              >
                Total Audio Platform
              </p>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'white',
              border: '3px solid rgba(0, 0, 0, 1)',
              borderRadius: '12px',
              padding: '0.75rem',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0, 0, 0, 1)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(0, 0, 0, 1)';
            }}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.5rem 1rem' }}>
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1.5rem',
                  margin: '0.75rem 0',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: active ? '#1d4ed8' : '#374151',
                  background: active ? '#dbeafe' : 'white',
                  border: active ? '4px solid #2563eb' : '3px solid #e5e7eb',
                  boxShadow: active
                    ? '8px 8px 0px 0px rgba(37, 99, 235, 0.3)'
                    : '6px 6px 0px 0px rgba(229, 231, 235, 0.8)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  fontWeight: active ? '700' : '600',
                }}
                onMouseOver={e => {
                  if (!active) {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.color = '#1f2937';
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '8px 8px 0px 0px rgba(229, 231, 235, 1)';
                  }
                }}
                onMouseOut={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(229, 231, 235, 0.8)';
                  }
                }}
              >
                {/* Status Indicator */}
                {item.status && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      background: getStatusColor(item.status),
                      border: '2px solid rgba(0, 0, 0, 0.8)',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      color: 'white',
                      textTransform: 'uppercase',
                      boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {item.status}
                  </div>
                )}

                <div
                  style={{
                    fontSize: '2rem',
                    marginRight: isCollapsed ? '0' : '1rem',
                    minWidth: '32px',
                    textAlign: 'center',
                    filter: 'drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.2))',
                  }}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: active ? '800' : '700',
                        fontSize: '1rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: active ? '#1e40af' : '#6b7280',
                        lineHeight: '1.3',
                        fontWeight: '500',
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '3px solid #e5e7eb',
                boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: '#1f2937',
                  fontSize: '1rem',
                  fontWeight: '800',
                  margin: '0 0 1rem 0',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.1)',
                }}
              >
                Quick Actions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => (window.location.href = '/system-restart')}
                  style={{
                    background: '#fee2e2',
                    border: '3px solid #ef4444',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    boxShadow: '4px 4px 0px 0px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(239, 68, 68, 0.5)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  🔄 Restart Services
                </button>

                <button
                  onClick={() => (window.location.href = '/social-posting')}
                  style={{
                    background: '#dcfce7',
                    border: '3px solid #22c55e',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: '#16a34a',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    boxShadow: '4px 4px 0px 0px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(34, 197, 94, 0.5)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(34, 197, 94, 0.3)';
                  }}
                >
                  📱 Quick Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: isCollapsed ? '120px' : '340px',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          padding: '2rem',
          background: '#f8fafc',
        }}
      >
        {children}
      </div>
    </div>
  );
}
