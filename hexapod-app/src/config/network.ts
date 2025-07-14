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
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    robotStateUrl: 'https://arachne-1.claysawesomewebsite.uk/api/robot-state',
    apiKey: process.env.NEXT_PUBLIC_API_KEY || env.NEXT_PUBLIC_API_KEY,
    // Log API key (redacted for security)
    _apiKeyDebug: process.env.NEXT_PUBLIC_API_KEY ? 'API key loaded from NEXT_PUBLIC_API_KEY' : 
                    env.NEXT_PUBLIC_API_KEY ? 'API key loaded from env.NEXT_PUBLIC_API_KEY' : 
                    'No API key configured',
    timeout: 30000, // 30 seconds
    cors: {
      origin: process.env.NEXT_PUBLIC_API_CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'X-API-Key']
    }
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
