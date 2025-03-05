import React from 'react';
import { Conversation, User } from '@/types';
import { format } from 'date-fns';

interface ChatListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  currentUserId: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ 
  conversation, 
  isActive, 
  onClick,
  currentUserId
}) => {
  // Get the other participant (not the current user)
  const otherParticipant: User | undefined = conversation.participants?.[0];
  
  if (!otherParticipant) {
    return null;
  }

  // Format the last message time
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If the message is from today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'HH:mm');
    }
    
    // If the message is from this week, show day
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(messageDate, 'EEE');
    }
    
    // Otherwise show date
    return format(messageDate, 'dd/MM/yyyy');
  };

  // Get last message preview text
  const getLastMessagePreview = () => {
    const lastMessage = conversation.lastMessage;
    if (!lastMessage) return '';
    
    if (lastMessage.type === 'text') {
      return lastMessage.content.slice(0, 40) + (lastMessage.content.length > 40 ? '...' : '');
    } else if (lastMessage.type === 'image') {
      return '📷 Photo';
    } else if (lastMessage.type === 'audio') {
      return '🎵 Audio message';
    }
    
    return '';
  };

  // Determine if the message is unread (just for demonstration - in a real app we'd track this)
  const hasUnreadMessages = Math.random() > 0.7; // Randomly show unread messages
  const unreadCount = hasUnreadMessages ? Math.floor(Math.random() * 3) + 1 : 0;

  return (
    <div 
      className={`chat-list-item px-3 py-3 flex items-center cursor-pointer hover:bg-gray-100 border-b border-gray-100 ${isActive ? 'bg-gray-100' : ''}`}
      onClick={onClick}
    >
      <img 
        src={otherParticipant.avatar}
        className="rounded-full w-12 h-12 mr-3"
        alt={`${otherParticipant.displayName} profile`}
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-md font-semibold text-gray-800">{otherParticipant.displayName}</h3>
          <span className="text-xs text-gray-500">
            {conversation.lastMessageAt ? formatMessageTime(conversation.lastMessageAt) : ''}
          </span>
        </div>
        <div className="flex items-center">
          {conversation.lastMessage?.senderId === currentUserId && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34B7F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
          )}
          <div className="text-sm text-gray-500 truncate w-52">{getLastMessagePreview()}</div>
          {unreadCount > 0 && (
            <div className="flex justify-end ml-1">
              <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
