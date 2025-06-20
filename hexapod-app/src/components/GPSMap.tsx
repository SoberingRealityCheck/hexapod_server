'use client';

import { useState, useEffect } from 'react';
import { theme } from '@/styles/theme';

interface Props {
  location: {
    latitude: number;
    longitude: number;
  };
  className?: string;
}

// Only load LeafletMap on the client side
let LeafletMap: any;

if (typeof window !== 'undefined') {
  LeafletMap = require('./LeafletMap').default;
}

export default function GPSMap({ location, className }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [latestLocation, setLatestLocation] = useState({
    latitude: 20.7247,
    longitude: -156.3311
  });

  useEffect(() => {
    setIsClient(true);

    // Update location every 5 minutes
    const intervalId = setInterval(() => {
      setLatestLocation(location);
    }, 5 * 60 * 1000);

    // Initial update
    setLatestLocation(location);

    return () => {
      clearInterval(intervalId);
    };
  }, [location]);

  if (!isClient) {
    return (
      <div className={`h-64 ${theme.borderRadius} ${theme.surface} ${className || ''}`}>
        <div className="h-full"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <div className={`${theme.borderRadius} ${theme.surface}`}>
        <div className="h-64">
          <LeafletMap 
            latitude={latestLocation.latitude} 
            longitude={latestLocation.longitude}
          />
          {!latestLocation.latitude && !latestLocation.longitude ? (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-white font-semibold">
                <p className="text-lg">No GPS signal</p>
                <p className="text-sm">Showing default position (Hawaii)</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
