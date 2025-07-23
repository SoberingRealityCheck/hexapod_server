'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
import { theme } from '@/styles/theme';
import { RobotState } from '@/lib/robot-state';
import { networkConfig } from '@/config/network';
import CameraFeed from '@/components/CameraFeed';
import BatteryIndicator from '@/components/BatteryIndicator';
import GPSMap from '@/components/GPSMap';
import StatusIndicator from '@/components/StatusIndicator';
import MessageLog from '@/components/MessageLog';
import MusicPlayer from '@/components/MusicPlayer';
import RobotStateDisplay from '@/components/RobotStateDisplay';

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
    // Only initialize WebSocket if the URL is properly configured
    if (!networkConfig.websocket.url || networkConfig.websocket.url.includes('YOUR_')) {
      console.warn('WebSocket URL not properly configured. Please set NEXT_PUBLIC_WS_URL in your environment variables.');
      return;
    }

    console.log('Connecting to WebSocket:', networkConfig.websocket.url);
    const socket = io(networkConfig.websocket.url, {
      reconnectionAttempts: networkConfig.websocket.reconnectAttempts,
      reconnectionDelay: networkConfig.websocket.reconnectDelay,
      autoConnect: true,
      transports: ['websocket'],
    });
    
    socket.on('connect', () => {
      console.log('Connected to robot state via WebSocket');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('stateUpdate', (state: RobotState) => {
      console.log('Received state update:', state);
      setRobotState(state);
    });

    return () => {
      console.log('Disconnecting WebSocket');
      socket.disconnect();
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${theme.background}`}>
      <header className={`${theme.border} ${theme.borderSecondary}`}>
        <div className="flex items-center justify-between p-4">
          <button 
            className={`${theme.accent} ${theme.accentHover} ${theme.transition} font-semibold`}
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Image 
              src="/hexapod-logo.svg" 
              alt="Hexapod Logo" 
              width={48} 
              height={48} 
              style={{ fill: `${theme.text}`, stroke: `${theme.text}`}}
            />
            <h1 className={`text-4xl font-bold ${theme.text} text-center`}>
              Totally Radical Hexapod Central Dashboard
            </h1>
          </div>
        </div>
      </header>
      <MusicPlayer />
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`${theme.surface} p-4 rounded-lg border ${theme.border}`}>
            <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>what&apos;s it seeing?</h2>
            <CameraFeed />
          </div>

          <div className={`${theme.surface} p-4 rounded-lg border ${theme.border}`}>
            <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>how&apos;s it doing?</h2>
            <div className="space-y-4">
              <StatusIndicator online={robotState.online} />
              <BatteryIndicator level={robotState.batteryLevel} />
            </div>
          </div>

          <div className={`${theme.surface} p-4 rounded-lg border ${theme.border}`}>
            <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>where is it?</h2>
            <GPSMap location={robotState.gpsLocation} />
          </div>
        </div>

        <div className={`${theme.surface} p-4 ${theme.borderRadius} ${theme.border} mt-4`}>
          <RobotStateDisplay />
        </div>

        <div className={`${theme.surface} p-4 ${theme.borderRadius} ${theme.border} mt-4`}>
          <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>deep thoughts with hexapod.</h2>
          <MessageLog messages={robotState.messages} />
        </div>
      </main>
    </div>
  );
}
