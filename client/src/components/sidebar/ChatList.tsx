import React from 'react';
import ChatListItem from './ChatListItem';
import { Conversation } from '@/types';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
  currentUserId: number;
}

const ChatList: React.FC<ChatListProps> = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation,
  currentUserId
}) => {
  return (
    <div className="overflow-y-auto flex-1 scrollbar-custom">
      {conversations.map(conversation => (
        <ChatListItem
          key={conversation.id}
          conversation={conversation}
          isActive={activeConversationId === conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default ChatList;
