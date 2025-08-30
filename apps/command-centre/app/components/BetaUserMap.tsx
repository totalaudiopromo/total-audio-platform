'use client';

import { useMemo } from 'react';

interface BetaUser {
  id: string;
  email: string;
  name?: string;
  location?: {
    country: string;
    city: string;
    countryCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'active' | 'idle' | 'offline';
  engagement: {
    contactsEnriched: number;
    emailsValidated: number;
  };
}

interface BetaUserMapProps {
  users: BetaUser[];
}

export default function BetaUserMap({ users }: BetaUserMapProps) {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const toSVGCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  // Group users by location for clustering
  const locationClusters = useMemo(() => {
    const clusters = new Map();
    
    users.forEach(user => {
      if (!user.location?.coordinates) return; // Skip users without location data
      
      const key = `${user.location.coordinates.lat}-${user.location.coordinates.lng}`;
      if (!clusters.has(key)) {
        clusters.set(key, {
          location: user.location,
          users: [],
          coordinates: toSVGCoordinates(user.location.coordinates.lat, user.location.coordinates.lng)
        });
      }
      clusters.get(key).users.push(user);
    });
    
    return Array.from(clusters.values());
  }, [users]);

  // If no valid location data, show a message
  if (locationClusters.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '900', 
          color: '#1a202c', 
          margin: '0 0 1rem 0',
          letterSpacing: '-0.025em'
        }}>
          🗺️ Global Beta User Map
        </h3>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Loading user location data... This map will show where your beta users are located worldwide.
        </p>
      </div>
    );
  }

  const getClusterColor = (users: BetaUser[]) => {
    const activeCount = users.filter(u => u.status === 'active').length;
    const total = users.length;
    const activeRatio = activeCount / total;
    
    if (activeRatio > 0.6) return '#10b981'; // Green for highly active
    if (activeRatio > 0.3) return '#f59e0b'; // Orange for moderately active
    return '#6b7280'; // Gray for low activity
  };

  const getClusterSize = (userCount: number) => {
    if (userCount > 3) return 16;
    if (userCount > 1) return 12;
    return 8;
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '2rem' 
      }}>
        <h3 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '900', 
          color: '#1a202c', 
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          🗺️ Global Beta User Distribution
        </h3>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#10b981',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
              High Activity
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#f59e0b',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
              Moderate Activity
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#6b7280',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
              Low Activity
            </span>
          </div>
        </div>
      </div>

      {/* World Map */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
        borderRadius: '16px',
        padding: '1rem',
        border: '2px solid #e0f2fe',
        overflow: 'hidden'
      }}>
        <svg
          viewBox="0 0 800 400"
          style={{
            width: '100%',
            height: '400px',
            display: 'block'
          }}
        >
          {/* Simplified world map background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          
          {/* Grid background */}
          <rect width="800" height="400" fill="url(#grid)" />
          
          {/* Simplified continent shapes */}
          {/* North America */}
          <path
            d="M 50 80 L 200 70 L 280 90 L 290 160 L 220 180 L 180 200 L 80 190 L 60 140 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* South America */}
          <path
            d="M 200 200 L 250 180 L 280 220 L 270 300 L 230 320 L 200 300 L 190 250 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Europe */}
          <path
            d="M 380 60 L 460 50 L 480 90 L 450 120 L 400 110 L 370 80 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Africa */}
          <path
            d="M 400 120 L 480 110 L 520 160 L 510 250 L 480 280 L 430 270 L 410 200 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Asia */}
          <path
            d="M 480 50 L 680 40 L 720 80 L 700 140 L 650 160 L 580 150 L 500 120 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Australia */}
          <path
            d="M 620 250 L 720 240 L 730 280 L 680 290 L 630 285 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* User location markers */}
          {locationClusters.map((cluster, index) => {
            const color = getClusterColor(cluster.users);
            const size = getClusterSize(cluster.users.length);
            
            return (
              <g key={index}>
                {/* Pulse animation for active locations */}
                {cluster.users.some(u => u.status === 'active') && (
                  <circle
                    cx={cluster.coordinates.x}
                    cy={cluster.coordinates.y}
                    r={size * 1.5}
                    fill={color}
                    opacity="0.3"
                    style={{
                      animation: 'pulse 2s infinite'
                    }}
                  />
                )}
                
                {/* Main marker */}
                <circle
                  cx={cluster.coordinates.x}
                  cy={cluster.coordinates.y}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                    cursor: 'pointer'
                  }}
                />
                
                {/* User count label for clusters */}
                {cluster.users.length > 1 && (
                  <text
                    x={cluster.coordinates.x}
                    y={cluster.coordinates.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {cluster.users.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Location Statistics */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {locationClusters
          .sort((a, b) => b.users.length - a.users.length)
          .slice(0, 6)
          .map((cluster, index) => {
            const totalEngagement = cluster.users.reduce((sum, user) => 
              sum + user.engagement.contactsEnriched, 0
            );
            const activeUsers = cluster.users.filter(u => u.status === 'active').length;
            
            return (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: getClusterColor(cluster.users),
                      borderRadius: '50%'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      {cluster.location.city}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    {cluster.users.length} user{cluster.users.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  {cluster.location.country}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem'
                }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    {activeUsers} active
                  </span>
                  <span style={{ color: '#8b5cf6', fontWeight: '600' }}>
                    {totalEngagement.toLocaleString()} contacts
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}