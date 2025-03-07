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
    <div className={`flex-1 flex flex-col h-full ${isMobile ? 'absolute inset-0 z-10' : ''} overflow-hidden`}>
      <ChatHeader 
        participant={otherParticipant} 
        onBackClick={onBackClick}
      />
      
      <div className="flex-1 overflow-y-auto chat-background">
        <ChatMessages 
          messages={activeConversation.messages}
          currentUserId={currentUser.id}
          participants={[activeConversation.participant, currentUser]}
        />
      </div>
      
      {/* Scroll hint indicator for mobile */}
      {isMobile && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 rounded-full p-2 shadow-md animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      )}
      
      {/* Message input removed for read-only experience */}
    </div>
  );
};

export default ChatView;
