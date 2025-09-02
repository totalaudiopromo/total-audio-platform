'use client';

import { useEffect } from 'react';

interface LocationTrackerProps {
  email?: string;
  page?: string;
}

export default function LocationTracker({ email, page = 'unknown' }: LocationTrackerProps) {
  useEffect(() => {
    const trackLocation = async () => {
      try {
        // Generate or retrieve session ID
        let sessionId = sessionStorage.getItem('audio-intel-session-id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('audio-intel-session-id', sessionId);
        }

        // Track this page visit with geolocation
        const response = await fetch('/api/analytics/geolocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            page,
            email: email || null,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.location?.city) {
            console.log(`📍 Location tracked: ${data.location.city}, ${data.location.country}`);
            
            // Store location in sessionStorage for potential future use
            sessionStorage.setItem('user-location', JSON.stringify(data.location));
          }
        }
      } catch (error) {
        // Silently fail - geolocation is nice to have, not essential
        console.log('Location tracking failed:', error);
      }
    };

    // Track immediately
    trackLocation();

    // Track again when email is provided (e.g., after beta signup)
    if (email) {
      setTimeout(() => trackLocation(), 1000);
    }
  }, [email, page]);

  // This component renders nothing
  return null;
}