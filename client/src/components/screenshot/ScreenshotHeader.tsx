import React from 'react';
import { User } from '@/types';

interface ScreenshotHeaderProps {
  participant: User;
}

const ScreenshotHeader: React.FC<ScreenshotHeaderProps> = ({ participant }) => {
  return (
    <div className="bg-whatsapp-green text-white p-3 flex items-center">
      <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
        <img 
          src={participant.avatar} 
          alt={participant.displayName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h2 className="font-bold text-xl">{participant.displayName}</h2>
      </div>

      <div className="flex items-center space-x-5">
        {/* Video call icon */}
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
        
        {/* Phone call icon */}
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      </div>
    </div>
  );
};

export default ScreenshotHeader;