// This file provides hardcoded data in case the server fails to respond
// The real application will use the server routes to fetch data

import { User, Conversation, Message } from '@/types';

// Sample users
export const mockUsers: User[] = [
  { 
    id: 1, 
    username: 'fabian', 
    displayName: 'Fabian', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80', 
    lastSeen: new Date() 
  },
  { 
    id: 2, 
    username: 'peter', 
    displayName: 'Peter Drucker', 
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80', 
    lastSeen: new Date(Date.now() - 3600000) 
  },
  { 
    id: 3, 
    username: 'madeleine', 
    displayName: 'Madeleine Ythu', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80', 
    lastSeen: new Date(Date.now() - 86400000) 
  },
  { 
    id: 4, 
    username: 'nicolas', 
    displayName: 'Nicolas Domenech', 
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80', 
    lastSeen: new Date(Date.now() - 3600000 * 2) 
  },
  { 
    id: 5, 
    username: 'currentUser', 
    displayName: 'Current User', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80', 
    lastSeen: new Date() 
  }
];

// Current user (always user with ID 5)
export const currentUser: User = mockUsers[4];

// Sample conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    lastMessageAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
    participants: [mockUsers[0]],
    lastMessage: {
      id: 12,
      conversationId: 1,
      senderId: 5,
      type: 'text',
      content: "Actuellement à XXXX qui s'est avancé la donc il semble que c'est toujours très mélangé. Je comprendre la distinction between 3236 pour AMB people.",
      createdAt: new Date(Date.now() - 3600000 * 1),
      status: 'read'
    }
  },
  {
    id: 2,
    lastMessageAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    participants: [mockUsers[1]],
    lastMessage: {
      id: 13,
      conversationId: 2,
      senderId: 5,
      type: 'text',
      content: "Management is doing things right...",
      createdAt: new Date(Date.now() - 86400000 * 2),
      status: 'read'
    }
  },
  {
    id: 3,
    lastMessageAt: new Date(Date.now() - 86400000), // 1 day ago
    participants: [mockUsers[2]],
    lastMessage: {
      id: 14,
      conversationId: 3,
      senderId: 3,
      type: 'text',
      content: "Shall we meet tomorrow for coffee?",
      createdAt: new Date(Date.now() - 86400000),
      status: 'read'
    }
  },
  {
    id: 4,
    lastMessageAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    participants: [mockUsers[3]],
    lastMessage: {
      id: 15,
      conversationId: 4,
      senderId: 4,
      type: 'text',
      content: "I finished the report - check it out",
      createdAt: new Date(Date.now() - 86400000 * 3),
      status: 'read'
    }
  }
];

// Sample messages for conversation 1 (Fabian)
export const mockFabianMessages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "Acha question. Nicolas était un employeur avec Arnaud et ils ont discuté d'une idée que ai modifiée la semaine. Nicolas a suggéré à Arnaud d'utiliser les consultants directs chez ABS France et ABS jhi d'explorer la comptabilité d'utiliser des consultants qui sont dans les entreprises partenaires.",
    createdAt: new Date(Date.now() - 3600000 * 2 - 840000), // 2 hours and 14 minutes ago
    status: 'read'
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 5, // Current user
    type: 'text',
    content: "I ain't reading all that\nI'm happy for u tho\nor sorry that happened",
    metadata: { isQuote: true },
    createdAt: new Date(Date.now() - 3600000 * 2 - 600000), // 2 hours and 10 minutes ago
    status: 'read'
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "J'espère hahah que tu reaction ne sera pas celle-là",
    createdAt: new Date(Date.now() - 3600000 * 2 - 480000), // 2 hours and 8 minutes ago
    status: 'read'
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 5, // Current user
    type: 'image',
    content: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    metadata: { caption: "Les gens qui font du queue de plus de 2 heures simplement pour ce nourriture que je trouve dégoûtante (mais ce n'est que mon avis). Par où a été pris cette photo? Je suis curieux d'ailleurs..." },
    createdAt: new Date(Date.now() - 3600000 * 2 - 180000), // 2 hours and 3 minutes ago
    status: 'read'
  },
  {
    id: 5,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "Non.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 900000), // 1 hour and 15 minutes ago
    status: 'read'
  },
  {
    id: 6,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "Encore Fabian, Nicolas était un employeur avec Arnaud et ils ont discuté d'une idée que ai modifiée la semaine. Arnaud a contacté chez ABS, café-resto business. Ils disaient que \"bien remarquable\" par rapport à la réception pour problèmes de RNY. Nicolas m'a suggéré d'arrêter avec des exemples de tarifs sans différence entre les offres de base village pour une appli de points de ventes aux.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 899000), // 1 hour, 14 minutes and 59 seconds ago
    status: 'read'
  },
  {
    id: 7,
    conversationId: 1,
    senderId: 5, // Current user
    type: 'audio',
    content: "/assets/audio/message1.mp3", // Placeholder for an audio file
    metadata: { duration: 42 }, // Duration in seconds
    createdAt: new Date(Date.now() - 3600000 * 1 - 780000), // 1 hour and 13 minutes ago
    status: 'read'
  },
  {
    id: 8,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "La problème avec cette approche c'est qu'elle est très centrée de recrutement.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 720000), // 1 hour and 12 minutes ago
    status: 'read'
  },
  {
    id: 9,
    conversationId: 1,
    senderId: 5, // Current user
    type: 'text',
    content: "Ok mais je n'avais pas du tout anticipé cette directive. J'ai vu que l'offre n'était pas mal, et ensuite quand jai vu la maniere l'homme le gars et ca fille qui étaient.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 600000), // 1 hour and 10 minutes ago
    status: 'read'
  },
  {
    id: 10,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "Ce n'était de parler de client que l'essentiel. De toute façon on est partis dans 2 mois, mais jai voulu apparemment pas le dire. J'étais à plein co-fête sur le chasm.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 540000), // 1 hour and 9 minutes ago
    status: 'read'
  },
  {
    id: 11,
    conversationId: 1,
    senderId: 1, // Fabian
    type: 'text',
    content: "Encore question. Nicolas était un employeur avec Arnaud et lui ont décidé d'une idée que ai modifiée la semaine. Nicolas a suggéré à Arnaud d'utiliser les consultants directs chez ABS France et ABS jhu d'explorer la compta. Arnaud lui a proposé après une première discussion sur la stratégie technique qui lui a pris des chiffres qui parle comme une pour bien. Gabriel \"Hot Coffee\" another themis McDowell. Lots de la guerre en irak, a provoé and then Pierre Rivière est venu.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 420000), // 1 hour and 7 minutes ago
    status: 'read'
  },
  {
    id: 12,
    conversationId: 1,
    senderId: 5, // Current user
    type: 'text',
    content: "Actuellement à XXXX qui s'est avancé la donc il semble que c'est toujours très mélangé. Je comprendre la distinction between 3236 pour AMB people.",
    createdAt: new Date(Date.now() - 3600000 * 1 - 300000), // 1 hour and 5 minutes ago
    status: 'read'
  }
];

// Function to get messages for a conversation
export function getMockMessagesForConversation(conversationId: number): Message[] {
  if (conversationId === 1) {
    return mockFabianMessages;
  }
  
  // For other conversations, return a simple set of messages
  return [
    {
      id: conversationId * 100 + 1,
      conversationId,
      senderId: conversationId,
      type: 'text',
      content: "Hello there!",
      createdAt: new Date(Date.now() - 86400000 * 5),
      status: 'read'
    },
    {
      id: conversationId * 100 + 2,
      conversationId,
      senderId: 5, // Current user
      type: 'text',
      content: "Hi, how are you?",
      createdAt: new Date(Date.now() - 86400000 * 4),
      status: 'read'
    },
    {
      id: conversationId * 100 + 3,
      conversationId,
      senderId: conversationId,
      type: 'text',
      content: mockConversations.find(c => c.id === conversationId)?.lastMessage?.content || "This is a message",
      createdAt: new Date(Date.now() - 86400000 * 3),
      status: 'read'
    }
  ];
}
