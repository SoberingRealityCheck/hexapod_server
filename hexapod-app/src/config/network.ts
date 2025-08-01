import { env } from "process";

console.log('Network configuration loading...');

export const networkConfig = {
  // Camera Stream Configuration
  camera: {
    // Direct stream URL (if not using Cloudflare)
    streamUrl: process.env.NEXT_PUBLIC_CAMERA_STREAM_URL,
    
    // Cloudflare Stream Configuration
    cloudflare: {
      enabled: process.env.NEXT_PUBLIC_USE_CLOUDFLARE_STREAM === 'true',
      baseUrl: 'https://cloudflarestream.com',
      streamId: process.env.NEXT_PUBLIC_CAMERA_STREAM_ID,
      token: process.env.NEXT_PUBLIC_CAMERA_STREAM_TOKEN,
    }
  },

  // API Configuration
  api: {
    // Base URL for the actual backend API
    baseUrl: (() => {
      const envUrl = process.env.NEXT_PUBLIC_HEXAPOD_API_URL || process.env.HEXAPOD_API_URL || 'http://localhost:3000';
      // Remove trailing slashes
      return envUrl.replace(/\/+$/, '');
    })(),
    
    // URL for the robot state endpoint (will be proxied through Next.js API route)
    get robotStateUrl() {
      if (typeof window === 'undefined') {
        // Server-side: use direct URL
        return `${this.baseUrl}/api/robot-state`;
      }
      // Client-side: use relative URL to proxy
      return '/api/robot/state';
    },
    
    // Timeout for API requests (in milliseconds)
    timeout: 10000, // 10 seconds
  },

  // WebSocket Configuration
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
    reconnectAttempts: 3,
    reconnectDelay: 2000, // 2 seconds
  },

  // Map Configuration
  map: {
    // Default location (Hawaii)
    defaultLocation: {
      latitude: 20.7247,
      longitude: -156.3311
    },
    zoom: 8,
    
    // Map provider configuration
    provider: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  }
};

// Type definitions
export type NetworkConfig = typeof networkConfig;
export type CameraConfig = typeof networkConfig.camera;
export type APIConfig = typeof networkConfig.api;
export type WebSocketConfig = typeof networkConfig.websocket;
export type MapConfig = typeof networkConfig.map;
