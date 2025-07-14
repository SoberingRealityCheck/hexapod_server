import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const PLAYLIST = [
  '/audio/mainframe.mp3',
  '/audio/squirrel_song.mp3',
  '/audio/the_system.mp3',
  '/audio/above_clouds.mp3',
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load saved progress on component mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('musicPlayer_currentIndex');
    const savedTime = localStorage.getItem('musicPlayer_currentTime');
    
    if (savedIndex !== null) {
      setCurrentSongIndex(parseInt(savedIndex, 10));
    }

    const audio = audioRef.current;
    if (audio && savedTime !== null) {
      audio.currentTime = parseFloat(savedTime);
    }
  }, []);

  // Save progress whenever time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      localStorage.setItem('musicPlayer_currentTime', audio.currentTime.toString());
      localStorage.setItem('musicPlayer_currentIndex', currentSongIndex.toString());
    };

    const handleEnded = () => {
      // Move to next song
      const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
      setCurrentSongIndex(nextIndex);
      localStorage.setItem('musicPlayer_currentIndex', nextIndex.toString());
      localStorage.setItem('musicPlayer_currentTime', '0');
      
      // Auto-play next song if currently playing
      if (isPlaying) {
        setTimeout(() => {
          audio.play().catch(error => {
            console.error('Error playing next audio:', error);
          });
        }, 100);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, isPlaying]);

  // Update audio source when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const savedTime = localStorage.getItem('musicPlayer_currentTime');
      audio.currentTime = savedTime ? parseFloat(savedTime) : 0;
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Extract song name from file path
  const getCurrentSongName = () => {
    const filePath = PLAYLIST[currentSongIndex];
    const fileName = filePath.split('/').pop() || '';
    return fileName.replace('.mp3', '');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex flex-col items-center">
        <button 
          onClick={togglePlay}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
        >
          <Image
            src="/music-note.svg"
            alt="Music Player"
            width={24}
            height={24}
            className={`transition-transform ${isPlaying ? 'scale-110' : 'scale-100'}`}
          />
        </button>
        <div className="mt-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white max-w-[120px] text-center">
         {getCurrentSongName()}
        </div>
      </div>
      <audio
        ref={audioRef}
        src={PLAYLIST[currentSongIndex]}
        preload="metadata"
      />
    </div>
  );
}
