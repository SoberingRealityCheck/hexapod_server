import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../styles/theme';

interface CameraFeedProps {
  streamUrl?: string;
  className?: string;
  onError?: (error: Error) => void;
}

export default function CameraFeed({ streamUrl, className, onError }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set up event listeners
    video.addEventListener('loadeddata', () => {
      setIsLoading(false);
      setError(null);
    });

    video.addEventListener('error', (e) => {
      const error = e.target as HTMLVideoElement;
      setError('Failed to load camera feed');
      if (onError) {
        onError(new Error('Camera feed failed to load'));
      }
    });

    // Clean up event listeners
    return () => {
      video.removeEventListener('loadeddata', () => {});
      video.removeEventListener('error', () => {});
    };
  }, [onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && streamUrl) {
      video.src = streamUrl;
      video.play().catch((error) => {
        setError('Failed to play camera feed');
        if (onError) {
          onError(error);
        }
      });
    }
  }, [streamUrl, onError]);

  if (error) {
    return (
      <div className="relative aspect-video rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center bg-red-100">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-red-800">Camera feed failed to load</h3>
            <p className="mt-1 text-sm text-red-700">
              Please try refreshing the page or check your internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`relative aspect-video ${theme.borderRadius} ${className || ''}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.border }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video ${className || ''}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        onError={(e) => {
          const video = e.target as HTMLVideoElement;
          const errorMessage = video.error?.message || 'Failed to load camera feed';
          setError(errorMessage);
          if (onError) {
            onError(new Error(errorMessage));
          }
        }}
      />
    </div>
  );
}
