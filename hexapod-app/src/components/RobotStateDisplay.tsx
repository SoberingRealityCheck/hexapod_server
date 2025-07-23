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

// Default robot state values
const defaultRobotState: RobotState = {
  online: false,
  batteryLevel: 0,
  gpsLocation: {
    latitude: 0,
    longitude: 0
  },
  messages: ['Connecting to robot...']
};

export default function RobotStateDisplay() {
  const [robotState, setRobotState] = useState<RobotState>(defaultRobotState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('RobotStateDisplay mounting/Updating...');
    console.log('API endpoint:', networkConfig.api.robotStateUrl);

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2; // Maximum number of retry attempts
    const retryDelay = 3000; // Initial delay of 3 seconds
    let retryTimeout: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    // Function to handle retry with exponential backoff
    const scheduleRetry = (errorMessage: string) => {
      if (!isMounted || retryCount >= maxRetries) {
        console.error('Max retries reached. Giving up.');
        setError(`Connection failed: ${errorMessage}. Using offline mode.`);
        setIsLoading(false);
        return;
      }

      const delay = retryDelay * Math.pow(2, retryCount);
      console.log(`Retry ${retryCount + 1}/${maxRetries} in ${delay}ms...`);
      
      retryTimeout = setTimeout(() => {
        if (isMounted) {
          fetchState();
        }
      }, delay);
      
      retryCount++;
    };

    const fetchState = async () => {
      if (!isMounted) return;
      
      try {
        console.log('Fetching robot state...');
        console.log('Request URL:', networkConfig.api.robotStateUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          // First try without credentials
          let response;
          try {
            response = await fetch(networkConfig.api.robotStateUrl, {
              method: 'GET',
              mode: 'cors',
              credentials: 'omit', // First try without credentials
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              signal: controller.signal,
              cache: 'no-cache',
              redirect: 'follow',
              referrerPolicy: 'no-referrer'
            });
          } catch (error) {
            // If first attempt fails, try with credentials if this is a CORS error
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
              console.log('Initial CORS attempt failed, trying with credentials...');
              response = await fetch(networkConfig.api.robotStateUrl, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                signal: controller.signal,
                cache: 'no-cache',
                redirect: 'follow',
                referrerPolicy: 'no-referrer'
              });
            } else {
              throw error; // Re-throw if it's not a CORS error
            }
          }

          // Check if the response is OK (status 200-299)
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          clearTimeout(timeoutId);
          console.log('Response status:', response.status);

          // Reset retry count and start polling on successful response
          retryCount = 0;
          if (isMounted) {
            startPolling();
          }

          // Clone the response for error handling
          const responseClone = response.clone();
          
          try {
            const data = await response.json() as Partial<RobotState>;
            if (isMounted) {
              const newState: RobotState = {
                online: data.online ?? defaultRobotState.online,
                batteryLevel: data.batteryLevel ?? defaultRobotState.batteryLevel,
                messages: data.messages ?? defaultRobotState.messages,
                gpsLocation: {
                  latitude: data.gpsLocation?.latitude ?? defaultRobotState.gpsLocation.latitude,
                  longitude: data.gpsLocation?.longitude ?? defaultRobotState.gpsLocation.longitude,
                },
                // Add any other fields from RobotState here
              };
              setRobotState(newState);
              setError(null);
              setIsLoading(false);
            }
          } catch (parseError) {
            const responseText = await responseClone.text();
            console.error('Failed to parse response:', {
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
              body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
            });
            throw new Error('Failed to parse server response');
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        console.error('Fetch error:', error);
        if (isMounted) {
          setError(`Error: ${error instanceof Error ? error.message : 'Connection error'}`);
          
          // Schedule a retry with exponential backoff
          const errorMessage = error instanceof Error ? error.message : 'Connection failed';
          scheduleRetry(errorMessage);
        }
      }
    };

    // Fetch initial state
    // Initial fetch
    fetchState();

    // Set up polling only after successful initial connection
    const startPolling = () => {
      if (!isMounted) return;
      // Clear any existing interval
      if (pollInterval) clearInterval(pollInterval);
      // Start polling every 10 seconds
      pollInterval = setInterval(fetchState, 10000);
    };

    // Cleanup function
    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  if (error) {
    return (
      <div className={`${theme.surface} p-4 rounded-lg border ${theme.border} space-y-2`}>
        <div className="text-red-500 font-medium">Connection Error</div>
        <div className="text-sm text-gray-400">{error}</div>
        <div className="text-sm text-gray-500">Showing last known state:</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${theme.surface} p-4 rounded-lg border ${theme.border} text-gray-400`}>
        <div className="animate-pulse space-y-2">
          <div>Connecting to robot...</div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
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
