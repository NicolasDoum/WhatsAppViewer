import { useState, useRef, useEffect } from 'react';

interface UseAudioPlayerProps {
  audioUrl?: string;
  duration?: number;
}

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  progress: number;
  togglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export default function useAudioPlayer({ audioUrl, duration = 0 }: UseAudioPlayerProps): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Update time and progress as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const current = audio.currentTime;
      setCurrentTime(current);
      
      // Calculate progress percentage
      const audioDuration = audio.duration || duration;
      if (audioDuration > 0) {
        setProgress((current / audioDuration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    // Set up event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    // Clean up
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  return {
    isPlaying,
    currentTime,
    progress,
    togglePlayPause,
    audioRef
  };
}
