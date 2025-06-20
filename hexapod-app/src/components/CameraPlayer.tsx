import { useRef } from 'react';
import CameraFeed from './CameraFeed';
import CameraControls from './CameraControls';
import { useTheme } from '../styles/theme';

interface CameraPlayerProps {
  streamUrl?: string;
  className?: string;
  onError?: (error: Error) => void;
}

export default function CameraPlayer({ streamUrl, className, onError }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theme = useTheme();

  return (
    <div className={`relative ${className || ''}`}>
      <CameraFeed
        streamUrl={streamUrl}
        className={className}
        onError={onError}
      />
      <CameraControls className={className} />
    </div>
  );
}
