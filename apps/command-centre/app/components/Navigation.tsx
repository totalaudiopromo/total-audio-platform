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
    icon: '📊',
    description: 'Business overview and metrics'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: '📈',
    description: 'Deep dive into business metrics',
    status: 'active'
  },
  {
    id: 'social-posting',
    label: 'Social Media',
    href: '/social-posting',
    icon: '📱',
    description: 'Schedule posts across platforms'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: '📋',
    description: 'Business intelligence reports'
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: '👥',
    description: 'User management and permissions'
  },
  {
    id: 'beta-management',
    label: 'Beta Management',
    href: '/beta-management',
    icon: '🧪',
    description: 'Manage beta users and signups',
    status: 'beta'
  },
  {
    id: 'newsjacking',
    label: 'Content Review',
    href: '/newsjacking',
    icon: '📰',
    description: 'Review AI-generated content'
  },
  {
    id: 'marketing',
    label: 'Marketing Agent',
    href: '/marketing',
    icon: '🤖',
    description: 'Automated content generation',
    status: 'new'
  }
];

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'beta': return '#f59e0b';
      case 'new': return '#ef4444';
      default: return 'transparent';
    }
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: isCollapsed ? '80px' : '280px',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!isCollapsed && (
            <div>
              <h1 style={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Command Centre
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                margin: '0.25rem 0 0 0'
              }}>
                Total Audio Platform
              </p>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1rem 0' }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCollapsed ? '1rem' : '0.875rem 1rem',
                  margin: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: active ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  background: active ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: active ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }
                }}
              >
                {/* Status Indicator */}
                {item.status && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(item.status)
                  }} />
                )}

                <span style={{ 
                  fontSize: '1.5rem', 
                  marginRight: isCollapsed ? '0' : '0.75rem',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: active ? '600' : '500',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: '1.2'
                    }}>
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Active Indicator */}
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    bottom: '0',
                    width: '3px',
                    background: '#3b82f6',
                    borderRadius: '0 3px 3px 0'
                  }} />
                )}
              </a>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                margin: '0 0 0.75rem 0'
              }}>
                Quick Actions
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => window.location.href = '/system-restart'}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: '#fca5a5',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}
                >
                  🔄 Restart Services
                </button>
                
                <button
                  onClick={() => window.location.href = '/social-posting'}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: '#86efac',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500'
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
      <div style={{
        marginLeft: isCollapsed ? '80px' : '280px',
        flex: 1,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
}