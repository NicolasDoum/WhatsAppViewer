import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { ActiveConversation, User, Message } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatViewProps {
  activeConversation: ActiveConversation;
  currentUser: User;
  onSendMessage?: (content: string) => void;
  onBackClick?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  activeConversation, 
  currentUser,
  onSendMessage,
  onBackClick
}) => {
  const isMobile = useIsMobile();
  
  // Get the participant (always stored in the participant field)
  const otherParticipant: User = activeConversation.participant;

  // Mock send message function for now
  const handleSendMessage = (content: string) => {
    if (onSendMessage) {
      onSendMessage(content);
    } else {
      console.log('Message sent:', content);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatHeader 
        participant={otherParticipant} 
        onBackClick={isMobile ? onBackClick : undefined}
      />
      
      <div className="flex-1 overflow-hidden chat-background">
        <ChatMessages 
          messages={activeConversation.messages}
          currentUserId={currentUser.id}
          participants={[activeConversation.participant, currentUser]}
        />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatView;
