import React from 'react';
import { Message, User } from '@/types';
import { format } from 'date-fns';
import AudioPlayer from './AudioPlayer';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  sender?: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser, sender }) => {
  const formatMessageTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  // Determine message content based on type
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        // Check if the message is a quote (special formatting)
        if (message.metadata?.isQuote) {
          return (
            <div className="flex flex-col space-y-2">
              <div className="bg-black rounded-lg p-3 text-white">
                {message.content.split('\n').map((line, index) => (
                  <div key={index} className="mb-2 last:mb-0">{line}</div>
                ))}
              </div>
            </div>
          );
        }
        // Regular text message
        return (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        );
      
      case 'image':
        return (
          <>
            <img 
              src={message.content}
              className="rounded-md w-full max-w-xs mb-1"
              alt="Image message"
            />
            {message.metadata?.caption && (
              <p className="text-sm mt-1">{message.metadata.caption}</p>
            )}
          </>
        );
      
      case 'audio':
        return (
          <AudioPlayer 
            audioUrl={message.content} 
            duration={message.metadata?.duration || 0} 
          />
        );
      
      default:
        return <p className="text-sm">Unsupported message type</p>;
    }
  };

  // Render message status indicators for outgoing messages
  const renderMessageStatus = () => {
    if (!isCurrentUser) return null;
    
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#34B7F1" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="ml-1"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    );
  };

  return (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : ''}`}>
      <div 
        className={`
          ${isCurrentUser ? 'message-outgoing bg-whatsapp-light-green' : 'message-incoming bg-white'} 
          rounded-lg p-3 max-w-[70%] shadow-sm relative
        `}
      >
        {renderMessageContent()}
        <div className="flex justify-end items-center mt-1">
          <span className="text-xs text-gray-500 mr-1">
            {formatMessageTime(message.createdAt)}
          </span>
          {renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
