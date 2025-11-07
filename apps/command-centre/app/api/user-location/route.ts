import { NextRequest, NextResponse } from 'next/server';

interface LocationUpdate {
  email: string;
  location: {
    ip?: string;
    country?: string;
    countryCode?: string;
    city?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
  };
  timestamp: string;
  source: string;
}

// Simple in-memory storage for user locations (in production, use database)
const userLocations = new Map<string, LocationUpdate>();

export async function POST(request: NextRequest) {
  try {
    const body: LocationUpdate = await request.json();
    const { email, location, timestamp, source } = body;

    if (!email || !location) {
      return NextResponse.json({ error: 'Email and location are required' }, { status: 400 });
    }

    // Store or update user location
    const existingLocation = userLocations.get(email);

    // Only update if this is newer data or we don't have location data yet
    if (!existingLocation || new Date(timestamp) > new Date(existingLocation.timestamp)) {
      userLocations.set(email, {
        email,
        location,
        timestamp,
        source,
      });

      console.log(
        `📍 Updated location for ${email}: ${location.city}, ${location.country} (from ${source})`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
    });
  } catch (error) {
    console.error('User location update error:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (email) {
      // Return specific user location
      const location = userLocations.get(email);
      return NextResponse.json({
        success: true,
        location: location || null,
      });
    }

    // Return all user locations for the map
    const locations = Array.from(userLocations.values());

    // Group by location for clustering
    const locationClusters = locations.reduce((acc, userLoc) => {
      if (!userLoc.location.city) return acc;

      const key = `${userLoc.location.lat}-${userLoc.location.lon}`;
      if (!acc[key]) {
        acc[key] = {
          location: {
            country: userLoc.location.country,
            city: userLoc.location.city,
            countryCode: userLoc.location.countryCode,
            coordinates: {
              lat: userLoc.location.lat || 0,
              lng: userLoc.location.lon || 0,
            },
          },
          users: [],
          lastUpdated: userLoc.timestamp,
        };
      }

      acc[key].users.push({
        email: userLoc.email,
        source: userLoc.source,
        timestamp: userLoc.timestamp,
      });

      // Update last updated time if this is more recent
      if (new Date(userLoc.timestamp) > new Date(acc[key].lastUpdated)) {
        acc[key].lastUpdated = userLoc.timestamp;
      }

      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      totalUsers: locations.length,
      clusters: Object.values(locationClusters),
      recentUpdates: locations
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10),
    });
  } catch (error) {
    console.error('Get user locations error:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
