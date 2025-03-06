import React from 'react';
import { Conversation, User } from '@/types';
import { format } from 'date-fns';

interface ChatListItemProps {
  conversation: Conversation;
  isActive: boolean;
  isRead: boolean;
  onClick: () => void;
  currentUserId: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ 
  conversation, 
  isActive,
  isRead,
  onClick,
  currentUserId
}) => {
  // Get the other participant (not the current user)
  // Handle both formats: direct conversations with a single participant property
  // and regular conversations with an array of participants
  const otherParticipant: User | undefined = conversation.participant || conversation.participants?.[0];
  
  if (!otherParticipant) {
    return null;
  }

  // Format the last message time - always show as today's time
  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    
    // Just show the time (hours:minutes)
    return format(messageDate, 'HH:mm');
  };

  // Get last message preview text
  const getLastMessagePreview = () => {
    // Handle both formats: direct conversations with messages array
    // and regular conversations with lastMessage property
    const lastMessage = conversation.lastMessage || 
      (conversation.messages && conversation.messages.length > 0 
        ? conversation.messages[conversation.messages.length - 1] 
        : null);
        
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

  // Determine unread count based on conversation id - consistent value per conversation
  const getUnreadCount = (id: number): number => {
    switch (id) {
      case 1: return 2;
      case 2: return 4;
      case 3: return 1;
      case 4: return 3;
      default: return 0;
    }
  };
  
  // Only show unread count if the conversation is not active and not previously read
  const unreadCount = isActive || isRead ? 0 : getUnreadCount(conversation.id);

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
