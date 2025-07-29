import React from 'react';
import ScreenshotHeader from './ScreenshotHeader';
import ScreenshotMessages from './ScreenshotMessages';
import { Conversation, User } from '@/types';

interface ScreenshotChatViewProps {
  conversation: Conversation;
  currentUser: User;
}

const ScreenshotChatView: React.FC<ScreenshotChatViewProps> = ({ 
  conversation, 
  currentUser 
}) => {
  const otherParticipant = conversation.participant;

  return (
    <div className="flex flex-col h-screen bg-white shadow-lg">
      <ScreenshotHeader participant={otherParticipant} />
      
      <div className="flex-1 overflow-y-auto chat-background">
        <ScreenshotMessages 
          messages={conversation.messages}
          currentUserId={currentUser.id}
          participants={[conversation.participant, currentUser]}
        />
      </div>
    </div>
  );
};

export default ScreenshotChatView;