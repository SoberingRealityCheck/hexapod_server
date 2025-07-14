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
    const fetchState = async () => {
      try {
        const response = await fetch(networkConfig.api.robotStateUrl, {
          headers: {
            'Authorization': `Bearer ${networkConfig.api.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRobotState(data as RobotState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch robot state');
      }
    };

    // Fetch initial state
    fetchState();

    // Poll every 5 seconds
    const interval = setInterval(fetchState, 5000);

    return () => clearInterval(interval);
  }, []);

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
