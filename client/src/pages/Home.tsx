import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatView from '@/components/chat/ChatView';
import { User, Conversation, Message, ActiveConversation } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { mockUsers, mockConversations, getMockMessagesForConversation, currentUser as mockCurrentUser } from '@/data/mockData';

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

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

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: Partial<Message>) => {
      try {
        return await apiRequest('POST', '/api/messages', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        // For mock purposes, return a fake success
        return { ok: true };
      }
    },
    onSuccess: () => {
      // Invalidate the conversation query to refetch with the new message
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', activeConversationId] });
    }
  });

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (!activeConversationId || !currentUser) return;
    
    // Create a new message
    const newMessage: Partial<Message> = {
      conversationId: activeConversationId,
      senderId: currentUser.id,
      type: 'text',
      content,
      status: 'sent'
    };
    
    // Use the mutation to send the message
    sendMessageMutation.mutate(newMessage);
    
    // Optimistic update for UI
    if (activeConversation) {
      const optimisticMessage: Message = {
        id: Math.floor(Math.random() * -1000), // Temporary negative ID
        conversationId: activeConversationId,
        senderId: currentUser.id,
        type: 'text',
        content,
        createdAt: new Date(),
        status: 'sent'
      };
      
      queryClient.setQueryData(['/api/conversations', activeConversationId], {
        ...activeConversation,
        messages: [...activeConversation.messages, optimisticMessage],
      });
    }
  };

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
        onSelectConversation={setActiveConversationId}
      />
      
      {activeConversation ? (
        <ChatView
          activeConversation={activeConversation}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
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
