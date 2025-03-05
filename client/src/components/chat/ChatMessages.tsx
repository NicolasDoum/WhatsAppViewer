import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Message, User } from '@/types';
import { format } from 'date-fns';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: number;
  participants: User[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId, participants }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date - always show as today
  const messagesByDate: { [date: string]: Message[] } = {};
  
  // Get today's formatted date
  const today = format(new Date(), 'EEE dd MMM');
  
  // Put all messages under today's date
  messagesByDate[today] = [...messages];

  // Find a sender in the participants list
  const findSender = (senderId: number): User | undefined => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <div className="flex-1 chat-background overflow-y-auto px-10 py-3 scrollbar-custom" id="chat-messages">
      {/* Render message groups by date */}
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date indicator */}
          <div className="flex justify-center my-4">
            <div className="bg-white rounded-lg px-3 py-1 text-xs text-gray-500 shadow-sm">
              {date}
            </div>
          </div>

          {/* Messages for this date */}
          {dateMessages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
              sender={findSender(message.senderId)}
            />
          ))}
        </div>
      ))}
      
      {/* Typing indicator - for demonstration */}
      {Math.random() > 0.7 && (
        <div className="flex">
          <div className="message-incoming rounded-lg px-4 py-3 max-w-[70%] shadow-sm">
            <div className="flex space-x-1">
              <div className="bg-gray-300 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="bg-gray-300 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="bg-gray-300 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
