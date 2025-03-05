import { 
  users, type User, type InsertUser,
  conversations, type Conversation, type InsertConversation,
  participants, type Participant, type InsertParticipant,
  messages, type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationsByUserId(userId: number): Promise<Conversation[]>;
  
  // Participants
  addParticipant(participant: InsertParticipant): Promise<Participant>;
  getParticipantsByConversationId(conversationId: number): Promise<Participant[]>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  updateMessageStatus(messageId: number, status: string): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private participants: Map<number, Participant>;
  private messages: Map<number, Message>;
  
  private userId: number = 1;
  private conversationId: number = 1;
  private participantId: number = 1;
  private messageId: number = 1;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.participants = new Map();
    this.messages = new Map();
    
    // Initialize with some sample data
    this.initSampleData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, lastSeen: now };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const now = new Date();
    const conversation: Conversation = { ...insertConversation, id, lastMessageAt: now };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    const userParticipations = Array.from(this.participants.values())
      .filter(p => p.userId === userId)
      .map(p => p.conversationId);
    
    return Array.from(this.conversations.values())
      .filter(c => userParticipations.includes(c.id))
      .sort((a, b) => {
        // Sort by latest message
        const aTime = a.lastMessageAt?.getTime() || 0;
        const bTime = b.lastMessageAt?.getTime() || 0;
        return bTime - aTime; // Descending order (newest first)
      });
  }

  async addParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const id = this.participantId++;
    const participant: Participant = { ...insertParticipant, id };
    this.participants.set(id, participant);
    return participant;
  }

  async getParticipantsByConversationId(conversationId: number): Promise<Participant[]> {
    return Array.from(this.participants.values())
      .filter(p => p.conversationId === conversationId);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    const message: Message = { ...insertMessage, id, createdAt: now };
    this.messages.set(id, message);
    
    // Update the conversation's lastMessageAt time
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessageAt = now;
      this.conversations.set(conversation.id, conversation);
    }
    
    return message;
  }

  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => {
        // Sort by creation time
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return aTime - bTime; // Ascending order (oldest first)
      });
  }

  async updateMessageStatus(messageId: number, status: string): Promise<Message | undefined> {
    const message = this.messages.get(messageId);
    if (message) {
      const updatedMessage = { ...message, status };
      this.messages.set(messageId, updatedMessage);
      return updatedMessage;
    }
    return undefined;
  }
  
  // Initialize with sample data to simulate WhatsApp
  private initSampleData() {
    // Create some users
    const users = [
      { id: this.userId++, username: 'fabian', displayName: 'Fabian', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', lastSeen: new Date() },
      { id: this.userId++, username: 'peter', displayName: 'Peter Drucker', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', lastSeen: new Date(Date.now() - 3600000) }, // 1 hour ago
      { id: this.userId++, username: 'madeleine', displayName: 'Madeleine Ythu', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', lastSeen: new Date(Date.now() - 86400000) }, // 1 day ago
      { id: this.userId++, username: 'nicolas', displayName: 'Nicolas Domenech', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', lastSeen: new Date(Date.now() - 3600000 * 2) }, // 2 hours ago
      { id: this.userId++, username: 'currentUser', displayName: 'Current User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', lastSeen: new Date() }
    ];
    
    users.forEach(user => this.users.set(user.id, user));
    
    // Create conversations
    const conversations = [
      { id: this.conversationId++, lastMessageAt: new Date() }, // Fabian conversation
      { id: this.conversationId++, lastMessageAt: new Date(Date.now() - 3600000) }, // Peter conversation
      { id: this.conversationId++, lastMessageAt: new Date(Date.now() - 86400000) }, // Madeleine conversation
      { id: this.conversationId++, lastMessageAt: new Date(Date.now() - 3600000 * 2) }, // Nicolas conversation
    ];
    
    conversations.forEach(conversation => this.conversations.set(conversation.id, conversation));
    
    // Add participants to conversations
    for (let i = 0; i < 4; i++) {
      // Add the contact user to the conversation
      this.participants.set(this.participantId++, {
        id: this.participantId,
        userId: i + 1, // Contact user
        conversationId: i + 1
      });
      
      // Add the current user to all conversations
      this.participants.set(this.participantId++, {
        id: this.participantId,
        userId: 5, // Current user
        conversationId: i + 1
      });
    }
    
    // Add messages to the Fabian conversation (id: 1)
    const fabianMessages = [
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "Acha question. Nicolas était un employeur avec Arnaud et ils ont discuté d'une idée que ai modifiée la semaine. Nicolas a suggéré à Arnaud d'utiliser les consultants directs chez ABS France et ABS jhi d'explorer la comptabilité d'utiliser des consultants qui sont dans les entreprises partenaires.",
        createdAt: new Date(Date.now() - 3600000 * 2 - 840000), // 2 hours and 14 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 5, // Current user
        type: 'text',
        content: "I ain't reading all that\nI'm happy for u tho\nor sorry that happened",
        metadata: { isQuote: true },
        createdAt: new Date(Date.now() - 3600000 * 2 - 600000), // 2 hours and 10 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "J'espère hahah que tu reaction ne sera pas celle-là",
        createdAt: new Date(Date.now() - 3600000 * 2 - 480000), // 2 hours and 8 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 5, // Current user
        type: 'image',
        content: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
        metadata: { caption: "Les gens qui font du queue de plus de 2 heures simplement pour ce nourriture que je trouve dégoûtante (mais ce n'est que mon avis). Par où a été pris cette photo? Je suis curieux d'ailleurs..." },
        createdAt: new Date(Date.now() - 3600000 * 2 - 180000), // 2 hours and 3 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "Non.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 900000), // 1 hour and 15 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "Encore Fabian, Nicolas était un employeur avec Arnaud et ils ont discuté d'une idée que ai modifiée la semaine. Arnaud a contacté chez ABS, café-resto business. Ils disaient que \"bien remarquable\" par rapport à la réception pour problèmes de RNY. Nicolas m'a suggéré d'arrêter avec des exemples de tarifs sans différence entre les offres de base village pour une appli de points de ventes aux.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 900000 + 1000), // 1 hour, 14 minutes and 59 seconds ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 5, // Current user
        type: 'audio',
        content: "/assets/audio/message1.mp3", // This would be the audio file path
        metadata: { duration: 42 }, // Duration in seconds
        createdAt: new Date(Date.now() - 3600000 * 1 - 780000), // 1 hour and 13 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "La problème avec cette approche c'est qu'elle est très centrée de recrutement.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 720000), // 1 hour and 12 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 5, // Current user
        type: 'text',
        content: "Ok mais je n'avais pas du tout anticipé cette directive. J'ai vu que l'offre n'était pas mal, et ensuite quand jai vu la maniere l'homme le gars et ca fille qui étaient.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 600000), // 1 hour and 10 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "Ce n'était de parler de client que l'essentiel. De toute façon on est partis dans 2 mois, mais jai voulu apparemment pas le dire. J'étais à plein co-fête sur le chasm.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 540000), // 1 hour and 9 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 1, // Fabian
        type: 'text',
        content: "Encore question. Nicolas était un employeur avec Arnaud et lui ont décidé d'une idée que ai modifiée la semaine. Nicolas a suggéré à Arnaud d'utiliser les consultants directs chez ABS France et ABS jhu d'explorer la compta. Arnaud lui a proposé après une première discussion sur la stratégie technique qui lui a pris des chiffres qui parle comme une pour bien. Gabriel \"Hot Coffee\" another themis McDowell. Lots de la guerre en irak, a provoé and then Pierre Rivière est venu.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 420000), // 1 hour and 7 minutes ago
        status: 'read'
      },
      {
        id: this.messageId++,
        conversationId: 1,
        senderId: 5, // Current user
        type: 'text',
        content: "Actuellement à XXXX qui s'est avancé la donc il semble que c'est toujours très mélangé. Je comprendre la distinction between 3236 pour AMB people.",
        createdAt: new Date(Date.now() - 3600000 * 1 - 300000), // 1 hour and 5 minutes ago
        status: 'read'
      }
    ];
    
    // Add the messages
    fabianMessages.forEach(message => this.messages.set(message.id, message));
    
    // Add some messages to the other conversations too
    this.messages.set(this.messageId++, {
      id: this.messageId,
      conversationId: 2, // Peter
      senderId: 5, // Current user
      type: 'text',
      content: "Management is doing things right...",
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: 'read'
    });
    
    this.messages.set(this.messageId++, {
      id: this.messageId,
      conversationId: 3, // Madeleine
      senderId: 3, // Madeleine
      type: 'text',
      content: "Shall we meet tomorrow for coffee?",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      status: 'read'
    });
    
    this.messages.set(this.messageId++, {
      id: this.messageId,
      conversationId: 4, // Nicolas
      senderId: 4, // Nicolas
      type: 'text',
      content: "I finished the report - check it out",
      createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      status: 'read'
    });
  }
}

export const storage = new MemStorage();
