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

  // Find a sender in the participants list
  const findSender = (senderId: number): User | undefined => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <div className="flex-1 chat-background overflow-y-auto px-10 py-3 scrollbar-custom" id="chat-messages">
      {/* Messages */}
      {messages.map(message => (
        <MessageBubble
          key={message.id}
          message={message}
          isCurrentUser={message.senderId === currentUserId}
          sender={findSender(message.senderId)}
        />
      ))}
      
      {/* Typing indicator removed */}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
