// Chat types
export interface User {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  lastSeen: Date;
}

export interface Conversation {
  id: number;
  lastMessageAt: Date;
  lastMessage?: Message;
  participants?: User[];
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  type: 'text' | 'image' | 'audio';
  content: string;
  metadata?: {
    duration?: number;
    caption?: string;
    isQuote?: boolean;
  };
  createdAt: Date;
  status: 'sent' | 'delivered' | 'read';
}

// UI and state types
export interface ActiveConversation extends Conversation {
  messages: Message[];
}
