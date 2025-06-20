import { useState } from 'react';
import { useTheme } from '../styles/theme';

interface CameraControlsProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  className?: string;
}

export default function CameraControls({ videoRef, className }: CameraControlsProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const theme = useTheme();

  const handlePlayPause = () => {
    if (!videoRef?.current) return;
    const video = videoRef.current;
    if (video.paused) {
      video.play().catch(console.error);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef?.current) return;
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 p-4 ${className || ''}`}>
      <div className="flex justify-between items-center bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isPlaying ? (
              <path d="M12 2v20M8 6h8M8 12h8M8 18h8" />
            ) : (
              <path d="M14 6l-4 4m0 0l-4-4m4 4v11" />
            )}
          </svg>
        </button>

        <button
          onClick={handleFullscreen}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
            <path d="M6 4v16M12 4v16M18 4v16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
