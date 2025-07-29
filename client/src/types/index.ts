// Chat types
export interface User {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  lastSeen: Date;
  phoneNumber?: string;
}

export interface Conversation {
  id: number;
  lastMessageAt: Date;
  participant: User;       // Direct conversation format with single participant
  messages: Message[];     // Direct conversations include messages directly
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
  // This interface extends Conversation with the same structure
  // Maintained for explicit type naming
}
