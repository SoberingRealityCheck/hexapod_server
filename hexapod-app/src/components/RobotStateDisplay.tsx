'use client';

import { useEffect, useState } from 'react';
import { networkConfig } from '@/config/network';
import { theme } from '@/styles/theme';

interface RobotState {
  online: boolean;
  batteryLevel: number;
  gpsLocation: {
    latitude: number;
    longitude: number;
  };
  messages: string[];
  // Add other state properties as needed
}

export default function RobotStateDisplay() {
  const [robotState, setRobotState] = useState<RobotState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('RobotStateDisplay mounting/Updating...');
    console.log('Current API key status:', networkConfig.api._apiKeyDebug);
    console.log('API endpoint:', networkConfig.api.robotStateUrl);

    const fetchState = async () => {
      try {
        console.log('Fetching robot state...');
        console.log('Request URL:', networkConfig.api.robotStateUrl);
        console.log('API key:', networkConfig.api.apiKey ? 'API key present' : 'No API key');
        if (!networkConfig.api.apiKey) {
          throw new Error('API key is not configured');
        }

        // Handle CORS preflight request
        if (window.location.origin !== networkConfig.api.robotStateUrl) {
          console.log('Making CORS request to:', networkConfig.api.robotStateUrl);
          console.log('Origin:', window.location.origin);
        }

        const response = await fetch(networkConfig.api.robotStateUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            'X-API-Key': `${networkConfig.api.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }
        setRobotState(data as RobotState);
      } catch (err) {
        console.error('Error details:', {
          error: err,
          message: err?.message,
          stack: err?.stack,
          type: err instanceof Error ? 'Error' : 'Unknown'
        });
        
        // Handle specific error cases
        if (err instanceof TypeError && err.message.includes('NetworkError')) {
          setError('Network error: Could not connect to server. Check your internet connection and try again.');
        } else if (err instanceof TypeError && err.message.includes('CORS')) {
          setError('CORS error: The server is not configured to accept requests from this origin. Please check your server configuration.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch robot state');
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch robot state');
      }
    };

    // Fetch initial state
    fetchState();

    // Poll every 5 seconds
    const interval = setInterval(fetchState, 5000);

    return () => clearInterval(interval);
  }, [networkConfig.api.apiKey]);

  if (error) {
    return (
      <div className={`${theme.surface} p-4 rounded-lg border ${theme.border} text-red-500`}>{error}</div>
    );
  }

  if (!robotState) {
    return (
      <div className={`${theme.surface} p-4 rounded-lg border ${theme.border} text-gray-400`}>Loading robot state...</div>
    );
  }

  return (
    <div className={`${theme.surface} p-4 rounded-lg border ${theme.border}`}>
      <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>Robot Status</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="w-32">Online:</span>
          <span className={robotState.online ? 'text-green-500' : 'text-red-500'}>
            {robotState.online ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32">Battery:</span>
          <span className="text-yellow-500">{robotState.batteryLevel}%</span>
        </div>
        <div className="flex items-center">
          <span className="w-32">Location:</span>
          <span>
            {robotState.gpsLocation.latitude.toFixed(6)}, {robotState.gpsLocation.longitude.toFixed(6)}
          </span>
        </div>
        {robotState.messages.length > 0 && (
          <div>
            <h3 className="font-semibold mt-2">Messages:</h3>
            <ul className="list-disc list-inside">
              {robotState.messages.map((message, index) => (
                <li key={index} className="text-gray-300">{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
