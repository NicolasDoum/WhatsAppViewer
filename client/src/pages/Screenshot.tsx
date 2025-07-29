import React, { useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ScreenshotChatView from '@/components/screenshot/ScreenshotChatView';
import { Conversation, User } from '@/types';

const Screenshot: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const parsedId = parseInt(conversationId || '1', 10);

  // Use direct file-based API
  const baseApiUrl = '/api/direct';

  // Fetch current user data
  const { data: currentUser } = useQuery<User>({
    queryKey: [baseApiUrl + '/me'],
    queryFn: async () => {
      const res = await fetch(baseApiUrl + '/me');
      if (!res.ok) throw new Error('Failed to fetch current user');
      return await res.json();
    }
  });

  // Fetch conversation with messages
  const { data: conversation, isLoading } = useQuery<Conversation>({
    queryKey: [baseApiUrl + '/conversations', parsedId],
    queryFn: async () => {
      const res = await fetch(`${baseApiUrl}/conversations/${parsedId}`);
      if (!res.ok) throw new Error('Failed to fetch conversation');
      return await res.json();
    },
    enabled: !!parsedId
  });

  // Set body class for screenshot mode
  useEffect(() => {
    document.body.classList.add('screenshot-mode');
    return () => {
      document.body.classList.remove('screenshot-mode');
    };
  }, []);

  if (isLoading || !currentUser || !conversation) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screenshot-container min-h-screen bg-gray-100">
      <div className="mx-auto" style={{ maxWidth: '600px' }}>
        <ScreenshotChatView
          conversation={conversation}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default Screenshot;