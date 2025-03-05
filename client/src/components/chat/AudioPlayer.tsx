import React from 'react';
import useAudioPlayer from '@/hooks/useAudioPlayer';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
  const { isPlaying, currentTime, progress, togglePlayPause, audioRef } = useAudioPlayer({
    audioUrl,
    duration,
  });

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
        className={`waveform-bar rounded-sm ${isPlayed ? 'bg-green-500' : 'bg-gray-500'}`}
        style={{
          height: `${randomHeight}px`,
          width: '3px',
          margin: '0 1px',
        }}
      />
    );
  }

  return (
    <div className="audio-player-container flex items-center w-full">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/pause button */}
      <button 
        className="play-button bg-green-600 hover:bg-green-700 text-white rounded-full w-9 h-9 flex items-center justify-center mr-2 focus:outline-none"
        onClick={togglePlayPause}
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
