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
    console.log('API endpoint:', networkConfig.api.robotStateUrl);

    const fetchState = async () => {
      try {
        console.log('Fetching robot state...');
        console.log('Request URL:', networkConfig.api.robotStateUrl);

        const response = await fetch(networkConfig.api.robotStateUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        try {
          // First check if we get a valid JSON response
          const contentType = response.headers.get('content-type') || '';
          console.log('Response Content-Type:', contentType);

          if (!contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response received:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
            throw new Error('Server returned non-JSON response');
          }

          const data = await response.json();
          console.log('Response data:', data);
          
          // Validate the response shape
          if (typeof data !== 'object' || data === null) {
            throw new Error('Invalid response format: Expected a JSON object');
          }

          // Check if we have all required fields
          if (!('online' in data) || !('batteryLevel' in data) || !('gpsLocation' in data)) {
            console.error('Missing required fields in response:', data);
            throw new Error('Invalid response format: Missing required fields');
          }

          setRobotState(data as RobotState);
        } catch (error) {
          const responseText = await response.text();
          console.error('Response details:', {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
          });
          
          if (response.status === 401) {
            setError('Unauthorized: Invalid API key');
          } else if (response.status === 404) {
            setError('Not Found: The requested resource does not exist');
          } else {
            setError(`Error: ${error instanceof Error ? error.message : 'Failed to fetch robot state'}`);
          }
        }
      } catch (error: unknown) {
        console.error('Error details:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          type: error instanceof Error ? 'Error' : 'Unknown'
        });
        
        // Handle specific error cases
        if (error instanceof TypeError && error.message.includes('NetworkError')) {
          setError('Network error: Could not connect to server. Check your internet connection and try again.');
        } else if (error instanceof Error && error.message.includes('404')) {
          setError('Not Found: The requested resource does not exist');
        } else {
          setError(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        }
      }
    };

    // Fetch initial state
    fetchState();

    // Poll every 5 seconds
    const interval = setInterval(fetchState, 5000);

    return () => clearInterval(interval);
  });

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
