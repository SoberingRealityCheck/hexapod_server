'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
import { theme } from '@/styles/theme';
import { RobotState } from '@/lib/robot-state';
import CameraFeed from '@/components/CameraFeed';
import BatteryIndicator from '@/components/BatteryIndicator';
import GPSMap from '@/components/GPSMap';
import StatusIndicator from '@/components/StatusIndicator';
import MessageLog from '@/components/MessageLog';


export default function Dashboard() {
  const [robotState, setRobotState] = useState<RobotState>({
    online: false,
    batteryLevel: 0,
    gpsLocation: {
      latitude: 0,
      longitude: 0
    },
    messages: []
  });

  useEffect(() => {
    const socket = io('YOUR_CLOUDFLARE_URL');
    
    socket.on('connect', () => {
      console.log('Connected to robot state');
    });

    socket.on('stateUpdate', (state: RobotState) => {
      setRobotState(state);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className={`${theme.border} ${theme.borderSecondary}`}>
        <div className="flex items-center p-4">
          <button 
            className={`${theme.textSecondary} ${theme.accentHover} ${theme.transition}`}
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Image 
              src="/hexapod-logo.svg" 
              alt="Hexapod Logo" 
              width={32} 
              height={32} 
              style={{ fill: 'gray-100', stroke: 'gray-100' }}
            />
            <h1 className="text-3xl font-bold text-gray-100">Hexapod Monitoring Dashboard</h1>
          </div>
        </div>
      </header>
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Camera Feed</h2>
            <CameraFeed />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Status</h2>
            <div className="space-y-4">
              <StatusIndicator online={robotState.online} />
              <BatteryIndicator level={robotState.batteryLevel} />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Location</h2>
            <GPSMap location={robotState.gpsLocation} />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-4">
          <h2 className="text-lg font-semibold text-gray-400 mb-2">Message Log</h2>
          <MessageLog messages={robotState.messages} />
        </div>
      </main>
    </div>
  );
}
