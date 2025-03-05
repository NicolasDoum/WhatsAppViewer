import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatView from '@/components/chat/ChatView';
import { User, Conversation, ActiveConversation } from '@/types';
import { mockUsers, mockConversations, getMockMessagesForConversation, currentUser as mockCurrentUser } from '@/data/mockData';

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  // Track which conversations have been read in this session
  const [readConversations, setReadConversations] = useState<Set<number>>(new Set());

  // Function to handle conversation selection and mark as read
  const handleSelectConversation = (conversationId: number) => {
    setActiveConversationId(conversationId);
    setReadConversations(prev => {
      const newSet = new Set(prev);
      newSet.add(conversationId);
      return newSet;
    });
  };

  // Fetch current user data
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/me'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Failed to fetch current user');
        return await res.json();
      } catch (error) {
        console.error('Error fetching current user:', error);
        return mockCurrentUser; // Fallback to mock data
      }
    }
  });

  // Fetch all conversations
  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/conversations');
        if (!res.ok) throw new Error('Failed to fetch conversations');
        return await res.json();
      } catch (error) {
        console.error('Error fetching conversations:', error);
        return mockConversations; // Fallback to mock data
      }
    }
  });

  // Fetch active conversation with messages
  const { data: activeConversation } = useQuery<ActiveConversation>({
    queryKey: ['/api/conversations', activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) {
        throw new Error('No conversation selected');
      }
      
      try {
        const res = await fetch(`/api/conversations/${activeConversationId}`);
        if (!res.ok) throw new Error('Failed to fetch conversation');
        return await res.json();
      } catch (error) {
        console.error('Error fetching conversation:', error);
        
        // Fallback to mock data
        const conversation = mockConversations.find(c => c.id === activeConversationId);
        if (!conversation) throw new Error('Conversation not found');
        
        return {
          ...conversation,
          messages: getMockMessagesForConversation(activeConversationId)
        };
      }
    },
    enabled: !!activeConversationId
  });

  // Removed message sending functionality for browse-only mode

  // Set the first conversation as active on initial load
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Handle loading state
  if (!currentUser || !conversations) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading WhatsApp Web...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        currentUser={currentUser}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        readConversations={readConversations}
      />
      
      {activeConversation ? (
        <ChatView
          activeConversation={activeConversation}
          currentUser={currentUser}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Home;
