import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import ChatList from './ChatList';
import { User, Conversation } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => {
    return convo.participant.displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/4 max-w-xs'} border-r border-gray-200 flex flex-col bg-whatsapp-sidebar-bg h-full overflow-y-auto`}>
      <SidebarHeader currentUser={currentUser} />
      <SearchBar onSearch={setSearchTerm} />
      <ChatList 
        conversations={filteredConversations} 
        activeConversationId={activeConversationId} 
        onSelectConversation={onSelectConversation}
        currentUserId={currentUser.id}
        readConversations={readConversations}
      />
    </div>
  );
};

export default Sidebar;
