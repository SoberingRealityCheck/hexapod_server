'use client';

import { useState, useEffect } from 'react';
import LeafletMap from './LeafletMap.client';

import { Location } from '@/types';

interface Props {
  location: Location;
  className?: string;
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
      <div className={`h-64 rounded-lg bg-gray-800 ${className || ''}`}>
        <div className="h-full"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <div className="rounded-lg bg-gray-800">
        <div className="h-64">
          <LeafletMap 
            location={{ latitude: latestLocation.latitude, longitude: latestLocation.longitude }} 
          />
        </div>
        {!latestLocation.latitude && !latestLocation.longitude ? (
          <div className="mt-2 px-4 py-2 bg-gray-700 rounded-b-lg text-white font-semibold">
            <p className="text-lg">No GPS signal</p>
            <p className="text-sm">Showing default position (Hawaii)</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
