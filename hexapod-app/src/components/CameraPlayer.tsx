import { useRef } from 'react';
import CameraFeed from './CameraFeed';
import CameraControls from './CameraControls';
import { networkConfig } from '@/config/network';

interface CameraPlayerProps {
  className?: string;
  onError?: (error: Error) => void;
}

export default function CameraPlayer({ className, onError }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const config = networkConfig.camera.cloudflare;
  
  const getStreamUrl = () => {
    if (config.enabled) {
      return `${config.baseUrl}/${config.streamId}/video.m3u8${config.token ? `?token=${config.token}` : ''}`;
    }
    return networkConfig.camera.streamUrl;
  };

  return (
    <div className={`relative ${className || ''}`}>
      <CameraFeed
        streamUrl={getStreamUrl()}
        className={className}
        onError={onError}
      />
      <CameraControls className={className} />
    </div>
  );
}
