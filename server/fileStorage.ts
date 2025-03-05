import fs from 'fs/promises';
import path from 'path';
import { 
  User, InsertUser, 
  Conversation, InsertConversation, 
  Participant, InsertParticipant, 
  Message, InsertMessage 
} from '@shared/schema';
import { IStorage } from './storage';

// Define paths
const DATA_DIR = path.join(process.cwd(), 'data');
const CONVERSATIONS_DIR = path.join(DATA_DIR, 'conversations');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PARTICIPANTS_FILE = path.join(DATA_DIR, 'participants.json');
const COUNTERS_FILE = path.join(DATA_DIR, 'counters.json');

// Type for our counters
interface Counters {
  userId: number;
  conversationId: number;
  participantId: number;
  messageId: number;
}

export class FileStorage implements IStorage {
  private counters: Counters = {
    userId: 1,
    conversationId: 1,
    participantId: 1,
    messageId: 1
  };

  constructor() {
    // Ensure directories exist
    this.initializeStorage();
  }

  // Initialize storage directories and files
  private async initializeStorage() {
    try {
      // Ensure data directory exists
      await fs.mkdir(DATA_DIR, { recursive: true });
      
      // Ensure conversations directory exists
      await fs.mkdir(CONVERSATIONS_DIR, { recursive: true });
      
      // Check if counters file exists, create it if not
      try {
        const countersData = await fs.readFile(COUNTERS_FILE, 'utf-8');
        this.counters = JSON.parse(countersData);
      } catch (error) {
        // File doesn't exist or can't be read, create it
        await fs.writeFile(COUNTERS_FILE, JSON.stringify(this.counters, null, 2));
      }
      
      // Check if users file exists, create it if not
      try {
        await fs.access(USERS_FILE);
      } catch (error) {
        await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
      }
      
      // Check if participants file exists, create it if not
      try {
        await fs.access(PARTICIPANTS_FILE);
      } catch (error) {
        await fs.writeFile(PARTICIPANTS_FILE, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Error initializing file storage:', error);
    }
  }

  // Save counters to file
  private async saveCounters() {
    await fs.writeFile(COUNTERS_FILE, JSON.stringify(this.counters, null, 2));
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const users: User[] = JSON.parse(data);
      return users.find(user => user.id === id);
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const users: User[] = JSON.parse(data);
      return users.find(user => user.username === username);
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const users: User[] = JSON.parse(data);
      
      const id = this.counters.userId++;
      const now = new Date();
      const newUser: User = { ...user, id, lastSeen: now };
      
      users.push(newUser);
      
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      await this.saveCounters();
      
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Conversations methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    try {
      const conversationFile = path.join(CONVERSATIONS_DIR, `${id}.json`);
      
      try {
        const data = await fs.readFile(conversationFile, 'utf-8');
        const conversation = JSON.parse(data);
        
        // Convert lastMessageAt string back to Date object
        if (conversation.lastMessageAt) {
          conversation.lastMessageAt = new Date(conversation.lastMessageAt);
        }
        
        return conversation;
      } catch (error) {
        // If file doesn't exist, return undefined
        return undefined;
      }
    } catch (error) {
      console.error('Error getting conversation:', error);
      return undefined;
    }
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    try {
      const id = this.counters.conversationId++;
      const now = new Date();
      const newConversation: Conversation = { ...conversation, id, lastMessageAt: now };
      
      const conversationFile = path.join(CONVERSATIONS_DIR, `${id}.json`);
      
      // Save the conversation
      await fs.writeFile(conversationFile, JSON.stringify(newConversation, null, 2));
      
      // Create messages array file
      const messagesFile = path.join(CONVERSATIONS_DIR, `${id}_messages.json`);
      await fs.writeFile(messagesFile, JSON.stringify([], null, 2));
      
      await this.saveCounters();
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    try {
      // Get all participants
      const participantsData = await fs.readFile(PARTICIPANTS_FILE, 'utf-8');
      const participants: Participant[] = JSON.parse(participantsData);
      
      // Filter participants by userId
      const userParticipants = participants.filter(p => p.userId === userId);
      
      // Get the conversation IDs
      const conversationIds = userParticipants.map(p => p.conversationId);
      
      // Get all conversations
      const conversations: Conversation[] = [];
      
      for (const id of conversationIds) {
        const conversation = await this.getConversation(id);
        if (conversation) {
          conversations.push(conversation);
        }
      }
      
      // Sort by lastMessageAt (newest first)
      return conversations.sort((a, b) => {
        const aTime = a.lastMessageAt?.getTime() || 0;
        const bTime = b.lastMessageAt?.getTime() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error getting conversations by user ID:', error);
      return [];
    }
  }

  // Participants methods
  async addParticipant(participant: InsertParticipant): Promise<Participant> {
    try {
      const data = await fs.readFile(PARTICIPANTS_FILE, 'utf-8');
      const participants: Participant[] = JSON.parse(data);
      
      const id = this.counters.participantId++;
      const newParticipant: Participant = { ...participant, id };
      
      participants.push(newParticipant);
      
      await fs.writeFile(PARTICIPANTS_FILE, JSON.stringify(participants, null, 2));
      await this.saveCounters();
      
      return newParticipant;
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  }

  async getParticipantsByConversationId(conversationId: number): Promise<Participant[]> {
    try {
      const data = await fs.readFile(PARTICIPANTS_FILE, 'utf-8');
      const participants: Participant[] = JSON.parse(data);
      
      return participants.filter(p => p.conversationId === conversationId);
    } catch (error) {
      console.error('Error getting participants by conversation ID:', error);
      return [];
    }
  }

  // Messages methods
  async getMessage(id: number): Promise<Message | undefined> {
    try {
      // Find which conversation the message belongs to
      // This is inefficient, but for a real app you'd have a message index
      const files = await fs.readdir(CONVERSATIONS_DIR);
      
      for (const file of files) {
        if (file.endsWith('_messages.json')) {
          const messagesFile = path.join(CONVERSATIONS_DIR, file);
          const data = await fs.readFile(messagesFile, 'utf-8');
          const messages: Message[] = JSON.parse(data);
          
          const message = messages.find(m => m.id === id);
          if (message) {
            // Convert createdAt string back to Date object
            if (message.createdAt) {
              message.createdAt = new Date(message.createdAt);
            }
            return message;
          }
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Error getting message:', error);
      return undefined;
    }
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    try {
      const id = this.counters.messageId++;
      const now = new Date();
      const newMessage: Message = { ...message, id, createdAt: now };
      
      const messagesFile = path.join(CONVERSATIONS_DIR, `${message.conversationId}_messages.json`);
      
      // Read existing messages
      let messages: Message[] = [];
      try {
        const data = await fs.readFile(messagesFile, 'utf-8');
        messages = JSON.parse(data);
      } catch (error) {
        // File might not exist, create it
      }
      
      // Add new message
      messages.push(newMessage);
      
      // Save messages
      await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
      
      // Update conversation lastMessageAt
      const conversationFile = path.join(CONVERSATIONS_DIR, `${message.conversationId}.json`);
      const conversationData = await fs.readFile(conversationFile, 'utf-8');
      const conversation: Conversation = JSON.parse(conversationData);
      
      conversation.lastMessageAt = now;
      
      await fs.writeFile(conversationFile, JSON.stringify(conversation, null, 2));
      await this.saveCounters();
      
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    try {
      const messagesFile = path.join(CONVERSATIONS_DIR, `${conversationId}_messages.json`);
      
      try {
        const data = await fs.readFile(messagesFile, 'utf-8');
        const messages: Message[] = JSON.parse(data);
        
        // Convert createdAt strings back to Date objects
        messages.forEach(message => {
          if (message.createdAt) {
            message.createdAt = new Date(message.createdAt);
          }
        });
        
        // Sort by creation time (oldest first)
        return messages.sort((a, b) => {
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          return aTime - bTime;
        });
      } catch (error) {
        // If file doesn't exist, return empty array
        return [];
      }
    } catch (error) {
      console.error('Error getting messages by conversation ID:', error);
      return [];
    }
  }

  async updateMessageStatus(messageId: number, status: string): Promise<Message | undefined> {
    try {
      // Find which conversation the message belongs to
      const files = await fs.readdir(CONVERSATIONS_DIR);
      
      for (const file of files) {
        if (file.endsWith('_messages.json')) {
          const messagesFile = path.join(CONVERSATIONS_DIR, file);
          const data = await fs.readFile(messagesFile, 'utf-8');
          let messages: Message[] = JSON.parse(data);
          
          const messageIndex = messages.findIndex(m => m.id === messageId);
          
          if (messageIndex !== -1) {
            // Update message status
            messages[messageIndex].status = status;
            
            // Save messages
            await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
            
            // Return updated message
            const updatedMessage = messages[messageIndex];
            
            // Convert createdAt string back to Date object
            if (updatedMessage.createdAt) {
              updatedMessage.createdAt = new Date(updatedMessage.createdAt);
            }
            
            return updatedMessage;
          }
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Error updating message status:', error);
      return undefined;
    }
  }

  // Method to initialize sample data
  async initSampleData() {
    try {
      // Create sample users
      const users: User[] = [
        { id: this.counters.userId++, username: 'fabian', displayName: 'Fabian', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', lastSeen: new Date() },
        { id: this.counters.userId++, username: 'peter', displayName: 'Peter Drucker', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', lastSeen: new Date(Date.now() - 3600000) }, // 1 hour ago
        { id: this.counters.userId++, username: 'madeleine', displayName: 'Madeleine Ythu', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', lastSeen: new Date(Date.now() - 86400000) }, // 1 day ago
        { id: this.counters.userId++, username: 'nicolas', displayName: 'Nicolas Domenech', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', lastSeen: new Date(Date.now() - 3600000 * 2) }, // 2 hours ago
        { id: this.counters.userId++, username: 'currentUser', displayName: 'Current User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', lastSeen: new Date() }
      ];
      
      // Save users to file
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      
      // Create conversations
      const conversations: Conversation[] = [
        { id: this.counters.conversationId++, lastMessageAt: new Date() }, // Fabian conversation
        { id: this.counters.conversationId++, lastMessageAt: new Date(Date.now() - 3600000) }, // Peter conversation
        { id: this.counters.conversationId++, lastMessageAt: new Date(Date.now() - 86400000) }, // Madeleine conversation
        { id: this.counters.conversationId++, lastMessageAt: new Date(Date.now() - 3600000 * 2) }, // Nicolas conversation
      ];
      
      // Save conversations to files
      for (const conversation of conversations) {
        const conversationFile = path.join(CONVERSATIONS_DIR, `${conversation.id}.json`);
        await fs.writeFile(conversationFile, JSON.stringify(conversation, null, 2));
        
        // Create empty messages array file
        const messagesFile = path.join(CONVERSATIONS_DIR, `${conversation.id}_messages.json`);
        await fs.writeFile(messagesFile, JSON.stringify([], null, 2));
      }
      
      // Add participants to conversations
      const participants: Participant[] = [];
      
      for (let i = 0; i < 4; i++) {
        // Add the contact user to the conversation
        participants.push({
          id: this.counters.participantId++,
          userId: i + 1, // Contact user
          conversationId: i + 1
        });
        
        // Add the current user to all conversations
        participants.push({
          id: this.counters.participantId++,
          userId: 5, // Current user
          conversationId: i + 1
        });
      }
      
      // Save participants to file
      await fs.writeFile(PARTICIPANTS_FILE, JSON.stringify(participants, null, 2));
      
      // Add messages to Fabian conversation (id: 1)
      const fabianMessages: Message[] = [
        {
          id: this.counters.messageId++,
          conversationId: 1,
          senderId: 1, // Fabian
          type: 'text',
          content: "Acha question. Nicolas était un employeur avec Arnaud et ils ont discuté d'une idée que ai modifiée la semaine. Nicolas a suggéré à Arnaud d'utiliser les consultants directs chez ABS France et ABS jhi d'explorer la comptabilité d'utiliser des consultants qui sont dans les entreprises partenaires.",
          createdAt: new Date(Date.now() - 3600000 * 2 - 840000), // 2 hours and 14 minutes ago
          status: 'read'
        },
        {
          id: this.counters.messageId++,
          conversationId: 1,
          senderId: 5, // Current user
          type: 'text',
          content: "I ain't reading all that\nI'm happy for u tho\nor sorry that happened",
          metadata: { isQuote: true },
          createdAt: new Date(Date.now() - 3600000 * 2 - 600000), // 2 hours and 10 minutes ago
          status: 'read'
        }
        // Add more messages as needed
      ];
      
      // Save Fabian messages
      const fabianMessagesFile = path.join(CONVERSATIONS_DIR, `1_messages.json`);
      await fs.writeFile(fabianMessagesFile, JSON.stringify(fabianMessages, null, 2));
      
      // Add single message to other conversations
      const peterMessage: Message = {
        id: this.counters.messageId++,
        conversationId: 2, // Peter
        senderId: 5, // Current user
        type: 'text',
        content: "Management is doing things right...",
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        status: 'read'
      };
      
      const peterMessagesFile = path.join(CONVERSATIONS_DIR, `2_messages.json`);
      await fs.writeFile(peterMessagesFile, JSON.stringify([peterMessage], null, 2));
      
      const madeleineMessage: Message = {
        id: this.counters.messageId++,
        conversationId: 3, // Madeleine
        senderId: 3, // Madeleine
        type: 'text',
        content: "Shall we meet tomorrow for coffee?",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        status: 'read'
      };
      
      const madeleineMessagesFile = path.join(CONVERSATIONS_DIR, `3_messages.json`);
      await fs.writeFile(madeleineMessagesFile, JSON.stringify([madeleineMessage], null, 2));
      
      const nicolasMessage: Message = {
        id: this.counters.messageId++,
        conversationId: 4, // Nicolas
        senderId: 4, // Nicolas
        type: 'text',
        content: "I finished the report - check it out",
        createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        status: 'read'
      };
      
      const nicolasMessagesFile = path.join(CONVERSATIONS_DIR, `4_messages.json`);
      await fs.writeFile(nicolasMessagesFile, JSON.stringify([nicolasMessage], null, 2));
      
      // Save the updated counters
      await this.saveCounters();
      
      console.log('Sample data initialized');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }
}

// Export a singleton instance
export const fileStorage = new FileStorage();