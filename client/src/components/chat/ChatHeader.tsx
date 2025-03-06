import React from 'react';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';

interface ChatHeaderProps {
  participant: User;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ participant }) => {
  // Format the last seen time
  const formatLastSeen = (date: Date) => {
    const lastSeenDate = new Date(date);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get formatted time from our util function
    const formattedTime = formatDate(lastSeenDate);
    
    // Same day
    if (lastSeenDate.toDateString() === now.toDateString()) {
      return `last seen today at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Yesterday
    if (lastSeenDate.toDateString() === yesterday.toDateString()) {
      return `last seen yesterday at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Within the last 7 days
    const daysDiff = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return `last seen ${lastSeenDate.toLocaleDateString([], { weekday: 'long' })} at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Older last seen
    return `last seen ${formattedTime}`;
  };

  return (
    <div className="h-16 bg-whatsapp-sidebar-bg flex items-center justify-between px-4 border-b border-gray-200">
      <div className="flex items-center">
        <img 
          src={participant.avatar}
          className="rounded-full w-10 h-10 mr-3"
          alt={`${participant.displayName} profile`}
        />
        <div>
          <h3 className="font-semibold text-gray-800">{participant.displayName}</h3>
          <p className="text-xs text-gray-500">{formatLastSeen(participant.lastSeen)}</p>
        </div>
      </div>
      <div className="flex text-gray-500 space-x-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </div>
    </div>
  );
};

export default ChatHeader;
