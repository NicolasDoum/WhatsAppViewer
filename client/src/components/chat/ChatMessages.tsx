import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Message, User } from '@/types';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: number;
  participants: User[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId, participants }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // Initial scroll to bottom without animation
  useEffect(() => {
    if (!initialScrollDone && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone]);

  // Find a sender in the participants list
  const findSender = (senderId: number): User | undefined => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <div 
      ref={messagesContainerRef}
      className={`flex-1 overflow-y-auto ${isMobile ? 'px-3' : 'px-10'} py-3 scrollbar-custom h-full`} 
      id="chat-messages"
    >
      {/* Spacer to ensure content is scrollable */}
      <div className="min-h-[20px]"></div>
      
      {/* Messages */}
      {messages.map(message => (
        <MessageBubble
          key={message.id}
          message={message}
          isCurrentUser={message.senderId === currentUserId}
          sender={findSender(message.senderId)}
        />
      ))}
      
      {/* End reference for scrolling */}
      <div ref={messagesEndRef} />
      
      {/* Bottom padding to ensure the last message isn't cut off */}
      <div className="h-4 md:h-8"></div>
    </div>
  );
};

export default ChatMessages;
