import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import ChatList from './ChatList';
import { User, Conversation } from '@/types';

interface SidebarProps {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
  readConversations: Set<number>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  conversations, 
  activeConversationId, 
  onSelectConversation,
  readConversations
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => {
    const participant = convo.participants?.[0];
    if (!participant) return false;
    
    return participant.displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col bg-whatsapp-sidebar-bg">
      <SidebarHeader currentUser={currentUser} />
      <SearchBar onSearch={setSearchTerm} />
      <ChatList 
        conversations={filteredConversations} 
        activeConversationId={activeConversationId} 
        onSelectConversation={onSelectConversation}
        currentUserId={currentUser.id}
      />
    </div>
  );
};

export default Sidebar;
