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
  // Support both formats: direct conversation with participant property
  // and regular conversation with participants array
  const otherParticipant: User | undefined = 
    activeConversation.participant || // Direct conversation format
    activeConversation.participants?.find(p => p.id !== currentUser.id); // Original format
  
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
        participants={
          // Handle both formats: if participants array exists, use it
          // otherwise create an array with just the participant and current user
          activeConversation.participants || 
          (activeConversation.participant ? [activeConversation.participant, currentUser] : [])
        }
      />
    </div>
  );
};

export default ChatView;
