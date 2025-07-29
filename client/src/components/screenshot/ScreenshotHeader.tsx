import React from 'react';
import { User } from '@/types';
import { format } from 'date-fns';

interface ScreenshotHeaderProps {
  participant: User;
}

const ScreenshotHeader: React.FC<ScreenshotHeaderProps> = ({ participant }) => {
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const lastSeenDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'online';
    if (diffInMinutes < 60) return `last seen ${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `last seen today at ${format(lastSeenDate, 'HH:mm')}`;
    return `last seen ${format(lastSeenDate, 'MMM d')} at ${format(lastSeenDate, 'HH:mm')}`;
  };

  return (
    <div className="bg-whatsapp-green text-white p-3 flex items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
        <img 
          src={participant.avatar} 
          alt={participant.displayName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h2 className="font-medium text-base">{participant.displayName}</h2>
        <p className="text-xs opacity-90">{formatLastSeen(participant.lastSeen)}</p>
      </div>

      <div className="flex items-center space-x-4">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906.896.896 0 01.18.692l-.97 4.844 4.881-.916a.896.896 0 01.696.188A6.75 6.75 0 1015.75 1.5z"/>
        </svg>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.9 14.3H15l-.35-.35a8.2 8.2 0 002-5.45A8.5 8.5 0 108.5 17a8.2 8.2 0 005.45-2l.35.35v.9l5.2 5.2 1.5-1.5-5.1-5.2zm-7.4 0A5.5 5.5 0 013 8.5 5.5 5.5 0 018.5 3 5.5 5.5 0 0114 8.5a5.5 5.5 0 01-5.5 5.8z"/>
        </svg>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="12" cy="6" r="1.5"/>
          <circle cx="12" cy="18" r="1.5"/>
        </svg>
      </div>
    </div>
  );
};

export default ScreenshotHeader;