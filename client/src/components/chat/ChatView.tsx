import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import { ActiveConversation, User, Message } from '@/types';

interface ChatViewProps {
  activeConversation: ActiveConversation;
  currentUser: User;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  activeConversation, 
  currentUser
}) => {
  // Get the other participant (not the current user)
  const otherParticipant: User | undefined = 
    activeConversation.participants?.find(p => p.id !== currentUser.id);
  
  if (!otherParticipant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader participant={otherParticipant} />
      
      <ChatMessages 
        messages={activeConversation.messages}
        currentUserId={currentUser.id}
        participants={activeConversation.participants || []}
      />
    </div>
  );
};

export default ChatView;
