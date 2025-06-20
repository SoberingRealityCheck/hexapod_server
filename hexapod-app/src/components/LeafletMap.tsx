'use client';

import { useEffect, useRef } from 'react';
import { theme } from '@/styles/theme';
import 'leaflet/dist/leaflet.css';

// Only load Leaflet on the client side
let L: any;

if (typeof window !== 'undefined') {
  L = require('leaflet');
  
  // Fix icon images
  L.Icon.Default.imagePath = '/';
  L.Icon.Default.prototype.options.iconUrl = '/marker-icon.png';
  L.Icon.Default.prototype.options.shadowUrl = '/marker-shadow.png';
} else {
  // Provide a mock implementation for server-side rendering
  L = {
    map: () => ({
      setView: () => {},
      addLayer: () => {},
      remove: () => {}
    }),
    tileLayer: () => ({
      addTo: () => {}
    }),
    marker: () => ({
      addTo: () => {},
      bindPopup: () => {}
    }),
    circle: () => ({
      addTo: () => {}
    })
  };
}

interface Props {
  latitude: number;
  longitude: number;
}

export default function LeafletMap({ latitude, longitude }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Remove any existing map
      const existingMap = mapRef.current.querySelector('.leaflet-container');
      if (existingMap) {
        existingMap.remove();
      }

      // Create new map
      const leafletMap = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
        center: [20.7247, -156.3311],
        zoom: 8
      });

      // Add tile layer from OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMap);

      // Add marker
      const marker = L.marker([latitude, longitude]).addTo(leafletMap);

      // Add popup
      marker.bindPopup(
        `<div class="text-center">
          <h3 class="font-semibold">Robot Location</h3>
          <p class="text-sm">
            Latitude: ${latitude.toFixed(6)}<br />
            Longitude: ${longitude.toFixed(6)}
          </p>
        </div>`
      );

      // Add circle
      L.circle([latitude, longitude], {
        radius: 500,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.2
      }).addTo(leafletMap);

      // Cleanup on unmount
      return () => {
        if (leafletMap) {
          leafletMap.remove();
        }
      };
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapRef} 
      className={`${theme.borderRadius} ${theme.border} ${theme.surface} h-full w-full`}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
}
