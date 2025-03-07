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

  // Improved scroll handling for all devices
  useEffect(() => {
    if (!initialScrollDone && messagesEndRef.current) {
      // First attempt to scroll - default behavior
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      
      // Secondary attempt with a slight delay to ensure layout is complete
      const timer = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
          
          // For mobile specifically, try to scroll the container if needed
          if (isMobile && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
          
          setInitialScrollDone(true);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages, initialScrollDone, isMobile]);

  // Find a sender in the participants list
  const findSender = (senderId: number): User | undefined => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <div 
      ref={messagesContainerRef}
      className={`flex-1 overflow-y-auto ${isMobile ? 'px-3 -mx-1' : 'px-10'} py-3 scrollbar-custom h-full`} 
      id="chat-messages"
      style={{ WebkitOverflowScrolling: 'touch' }} // Smooth scrolling for iOS
    >
      {/* Spacer to ensure content is scrollable */}
      <div className="min-h-[40px]"></div>
      
      {/* Group messages by date for better organization */}
      {(() => {
        let lastDate = '';
        
        return messages.map((message, index) => {
          // Format the current message date
          const messageDate = format(new Date(message.createdAt), 'MMM d, yyyy');
          
          // Check if we need to show a date divider
          const showDateDivider = messageDate !== lastDate;
          
          // Update the last date
          lastDate = messageDate;
          
          return (
            <React.Fragment key={message.id}>
              {/* Show date divider if needed */}
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                    {messageDate}
                  </div>
                </div>
              )}
              
              {/* The actual message bubble */}
              <MessageBubble
                message={message}
                isCurrentUser={message.senderId === currentUserId}
                sender={findSender(message.senderId)}
              />
            </React.Fragment>
          );
        });
      })()}
      
      {/* End reference for scrolling */}
      <div ref={messagesEndRef} />
      
      {/* Bottom padding to ensure the last message isn't cut off */}
      <div className="h-16 md:h-24"></div>
    </div>
  );
};

export default ChatMessages;
