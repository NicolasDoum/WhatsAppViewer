import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatView from '@/components/chat/ChatView';
import { User, Conversation, ActiveConversation } from '@/types';
import { mockUsers, mockConversations, getMockMessagesForConversation, currentUser as mockCurrentUser } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  // Track which conversations have been read in this session
  const [readConversations, setReadConversations] = useState<Set<number>>(new Set());
  // For mobile view, track if we're showing sidebar or chat
  const [showingSidebar, setShowingSidebar] = useState(true);

  // Function to handle conversation selection and mark as read
  const handleSelectConversation = (conversationId: number) => {
    setActiveConversationId(conversationId);
    setReadConversations(prev => {
      const newSet = new Set(prev);
      newSet.add(conversationId);
      return newSet;
    });
    
    // On mobile, switch to chat view when selecting a conversation
    if (isMobile) {
      setShowingSidebar(false);
    }
  };

  // Use direct file-based API (optional feature flag)
  const USE_DIRECT_API = true;
  const baseApiUrl = USE_DIRECT_API ? '/api/direct' : '/api';

  // Fetch current user data
  const { data: currentUser } = useQuery<User>({
    queryKey: [baseApiUrl + '/me'],
    queryFn: async () => {
      try {
        // Try the direct API first
        const res = await fetch(baseApiUrl + '/me');
        if (!res.ok) throw new Error('Failed to fetch current user');
        return await res.json();
      } catch (error) {
        console.error('Error fetching current user:', error);
        
        // If direct API fails, try the regular API
        if (USE_DIRECT_API) {
          try {
            const fallbackRes = await fetch('/api/me');
            if (fallbackRes.ok) return fallbackRes.json();
          } catch {}
        }
        
        return mockCurrentUser; // Final fallback to mock data
      }
    }
  });

  // Fetch all conversations
  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: [baseApiUrl + '/conversations'],
    queryFn: async () => {
      try {
        // Try the direct API first
        const res = await fetch(baseApiUrl + '/conversations');
        if (!res.ok) throw new Error('Failed to fetch conversations');
        return await res.json();
      } catch (error) {
        console.error('Error fetching conversations:', error);
        
        // If direct API fails, try the regular API
        if (USE_DIRECT_API) {
          try {
            const fallbackRes = await fetch('/api/conversations');
            if (fallbackRes.ok) return fallbackRes.json();
          } catch {}
        }
        
        return mockConversations; // Final fallback to mock data
      }
    }
  });

  // Fetch active conversation with messages
  const { data: activeConversation } = useQuery<ActiveConversation>({
    queryKey: [baseApiUrl + '/conversations', activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) {
        throw new Error('No conversation selected');
      }
      
      try {
        // Try the direct API first
        const res = await fetch(`${baseApiUrl}/conversations/${activeConversationId}`);
        if (!res.ok) throw new Error('Failed to fetch conversation');
        return await res.json();
      } catch (error) {
        console.error('Error fetching conversation:', error);
        
        // If direct API fails, try the regular API
        if (USE_DIRECT_API) {
          try {
            const fallbackRes = await fetch(`/api/conversations/${activeConversationId}`);
            if (fallbackRes.ok) return fallbackRes.json();
          } catch {}
        }
        
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

  // Handle back button functionality for mobile
  const handleBackToList = () => {
    setShowingSidebar(true);
  };

  // Render the chat view with proper mobile support
  const renderChatView = () => {
    if (!activeConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatView
          activeConversation={activeConversation}
          currentUser={currentUser}
          onBackClick={isMobile ? handleBackToList : undefined}
          onSendMessage={(content) => console.log('Message sent:', content)}
        />
      </div>
    );
  };

  if (isMobile) {
    // On mobile, show either sidebar or chat view based on state
    return (
      <div className="flex h-screen overflow-hidden">
        <div className={`w-full transition-all duration-300 ${showingSidebar ? 'block' : 'hidden'}`}>
          <Sidebar
            currentUser={currentUser}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            readConversations={readConversations}
          />
        </div>
        <div className={`w-full transition-all duration-300 ${showingSidebar ? 'hidden' : 'block'}`}>
          {renderChatView()}
        </div>
      </div>
    );
  }

  // On desktop, show both sidebar and chat view with responsive widths
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar takes 25% of screen on medium screens, max width on large screens */}
      <div className="w-1/4 max-w-xs border-r border-gray-200">
        <Sidebar
          currentUser={currentUser}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          readConversations={readConversations}
        />
      </div>
      
      {/* Chat view takes remaining width */}
      <div className="flex-1 overflow-hidden">
        {renderChatView()}
      </div>
    </div>
  );
};

export default Home;
