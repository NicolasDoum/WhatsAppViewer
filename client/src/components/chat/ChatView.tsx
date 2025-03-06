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
  // Get the participant (always stored in the participant field)
  const otherParticipant: User = activeConversation.participant;

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader participant={otherParticipant} />
      
      <ChatMessages 
        messages={activeConversation.messages}
        currentUserId={currentUser.id}
        participants={[activeConversation.participant, currentUser]}
      />
    </div>
  );
};

export default ChatView;
