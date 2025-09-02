import { NextRequest, NextResponse } from 'next/server';

interface LocationData {
  ip?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  org?: string;
  as?: string;
}

interface UserSession {
  sessionId: string;
  userAgent: string;
  timestamp: string;
  page: string;
  location?: LocationData;
  email?: string; // If user provides email (beta signup, etc.)
}

// Simple in-memory storage for demo (in production, use Redis/Database)
const userSessions = new Map<string, UserSession>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, email, userAgent } = body;

    // Get real IP from headers (works with Vercel, Netlify, etc.)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0].trim() || realIP || '127.0.0.1';

    console.log(`📍 Geolocation request from IP: ${ip}`);

    let locationData: LocationData = {};

    // Only attempt geolocation for real IPs (not localhost)
    if (ip !== '127.0.0.1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        // Use ip-api.com for free IP geolocation (100 requests/minute free tier)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,org,as,query`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          
          if (geoData.status === 'success') {
            locationData = {
              ip: geoData.query,
              country: geoData.country,
              countryCode: geoData.countryCode,
              region: geoData.region,
              regionName: geoData.regionName,
              city: geoData.city,
              zip: geoData.zip,
              lat: geoData.lat,
              lon: geoData.lon,
              timezone: geoData.timezone,
              org: geoData.org,
              as: geoData.as
            };
            
            console.log(`✅ Geolocation success: ${geoData.city}, ${geoData.country}`);
          } else {
            console.log(`❌ Geolocation failed: ${geoData.message}`);
          }
        }
      } catch (geoError) {
        console.error('Geolocation API error:', geoError);
      }
    } else {
      // For localhost/development, use Brighton as default
      locationData = {
        ip: ip,
        country: 'United Kingdom',
        countryCode: 'GB',
        city: 'Brighton',
        lat: 50.8225,
        lon: -0.1372,
        timezone: 'Europe/London'
      };
      console.log('🏠 Using localhost default: Brighton, UK');
    }

    // Store session data
    const session: UserSession = {
      sessionId,
      userAgent: userAgent || request.headers.get('user-agent') || 'Unknown',
      timestamp: new Date().toISOString(),
      page,
      location: locationData,
      email
    };

    userSessions.set(sessionId, session);

    // Also send to Command Centre if this is a beta user interaction
    if (email) {
      try {
        await fetch(`${process.env.COMMAND_CENTRE_URL || 'http://localhost:3005'}/api/user-location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            location: locationData,
            timestamp: session.timestamp,
            source: 'audio-intel'
          })
        });
      } catch (syncError) {
        console.error('Failed to sync location to Command Centre:', syncError);
      }
    }

    return NextResponse.json({
      success: true,
      location: locationData,
      message: 'Location tracked successfully'
    });

  } catch (error) {
    console.error('Geolocation tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track location' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return aggregated location data for analytics
  const sessions = Array.from(userSessions.values());
  
  const locationStats = sessions.reduce((acc, session) => {
    if (!session.location?.city) return acc;
    
    const key = `${session.location.city}, ${session.location.country}`;
    if (!acc[key]) {
      acc[key] = {
        city: session.location.city,
        country: session.location.country,
        countryCode: session.location.countryCode,
        coordinates: {
          lat: session.location.lat || 0,
          lng: session.location.lon || 0
        },
        users: [],
        count: 0
      };
    }
    
    acc[key].count++;
    if (session.email && !acc[key].users.includes(session.email)) {
      acc[key].users.push(session.email);
    }
    
    return acc;
  }, {} as Record<string, any>);

  return NextResponse.json({
    totalSessions: sessions.length,
    uniqueLocations: Object.keys(locationStats).length,
    locations: Object.values(locationStats),
    recentSessions: sessions.slice(-10).map(s => ({
      timestamp: s.timestamp,
      city: s.location?.city,
      country: s.location?.country,
      page: s.page,
      hasEmail: !!s.email
    }))
  });
}