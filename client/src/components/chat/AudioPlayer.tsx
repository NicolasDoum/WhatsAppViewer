import React, { useState, useEffect } from 'react';
import useAudioPlayer from '@/hooks/useAudioPlayer';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { isPlaying, currentTime, progress, togglePlayPause, audioRef } = useAudioPlayer({
    audioUrl,
    duration,
  });

  // Format audio URL to ensure it works correctly
  const formattedAudioUrl = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;

  // Check if audio is loadable when component mounts
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setError(true);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Try loading the audio
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, formattedAudioUrl]);

  // Generate waveform bars
  const bars = [];
  const barCount = 30;
  
  for (let i = 0; i < barCount; i++) {
    // Generate a random height for demonstration
    const randomHeight = Math.floor(Math.random() * 20) + 5;
    
    // Calculate the bar's color based on progress
    const barPosition = (i / barCount) * 100;
    const isPlayed = barPosition <= progress;
    
    bars.push(
      <div 
        key={i}
        className={`waveform-bar rounded-sm ${isPlayed ? 'bg-green-500' : 'bg-gray-300'}`}
        style={{
          height: `${randomHeight}px`,
          width: '3px',
          margin: '0 1px',
        }}
      />
    );
  }

  // If there's an error loading the audio
  if (error) {
    return (
      <div className="audio-player-error flex items-center p-2 rounded-md bg-gray-100 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span className="text-sm">Audio unavailable</span>
      </div>
    );
  }

  return (
    <div className="audio-player-container flex items-center w-full">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={formattedAudioUrl} preload="metadata" />
      
      {/* Play/pause button */}
      <button 
        className="play-button bg-green-600 hover:bg-green-700 text-white rounded-full w-9 h-9 flex items-center justify-center mr-2 focus:outline-none"
        onClick={togglePlayPause}
        disabled={!isLoaded}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>
      
      {/* Waveform visualization */}
      <div className="audio-waveform flex items-center h-8 flex-grow">
        {bars}
      </div>
      
      {/* Duration display */}
      <span className="text-xs text-gray-500 ml-2">
        {formatTime(isPlaying ? currentTime : duration)}
      </span>
    </div>
  );
};

export default AudioPlayer;
