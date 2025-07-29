import React, { useEffect, useRef } from 'react';
import MessageBubble from '../chat/MessageBubble';
import { Message, User } from '@/types';
import { format } from 'date-fns';

interface ScreenshotMessagesProps {
  messages: Message[];
  currentUserId: number;
  participants: User[];
}

const ScreenshotMessages: React.FC<ScreenshotMessagesProps> = ({ 
  messages, 
  currentUserId, 
  participants 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Disabled auto-scroll to ensure date is visible
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
  //   }
  // }, [messages]);

  const findSender = (senderId: number): User | undefined => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-8 pb-6 relative">
      {/* Group messages by date */}
      {(() => {
        let lastDate = '';
        
        return messages.map((message) => {
          const messageDate = format(new Date(message.createdAt), 'MMM d, yyyy');
          const showDateDivider = messageDate !== lastDate;
          lastDate = messageDate;
          
          return (
            <React.Fragment key={message.id}>
              {showDateDivider && (
                <div className="flex justify-center my-6 first:mt-0">
                  <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                    {messageDate}
                  </div>
                </div>
              )}
              
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
      
      {/* Bottom padding */}
      <div className="h-8"></div>
    </div>
  );
};

export default ScreenshotMessages;