import fs from 'fs/promises';
import path from 'path';
import { 
  User, 
  Conversation, 
  Message 
} from '@shared/schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const SIMPLE_CONVERSATIONS_DIR = path.join(DATA_DIR, 'simple-conversations');

// Ensure the directory exists
async function ensureDirectoryExists() {
  try {
    await fs.mkdir(SIMPLE_CONVERSATIONS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating simple-conversations directory:', error);
  }
}

// Simple conversation type with all data in one place
export interface SimpleConversation {
  id: number;
  lastMessageAt: Date;
  participant: User; // The other participant (not the current user)
  messages: Message[];
}

/**
 * Simple Conversation Manager - Manages conversations in a single file per conversation
 */
export class SimpleConversationManager {
  // Counter for generating unique IDs
  private static counter = 0;
  
  // Initialize the manager
  static async initialize() {
    await ensureDirectoryExists();
    
    // Load the highest ID to ensure we don't reuse IDs
    try {
      const files = await fs.readdir(SIMPLE_CONVERSATIONS_DIR);
      const conversationFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of conversationFiles) {
        const idMatch = file.match(/(\d+)\.json$/);
        if (idMatch) {
          const id = parseInt(idMatch[1]);
          if (id > SimpleConversationManager.counter) {
            SimpleConversationManager.counter = id;
          }
        }
      }
    } catch (error) {
      console.error('Error initializing SimpleConversationManager:', error);
    }
  }
  
  /**
   * Creates a new conversation with a participant and optional initial messages
   */
  static async createConversation(
    participant: User,
    initialMessages: Omit<Message, 'id' | 'conversationId' | 'createdAt'>[] = []
  ): Promise<SimpleConversation> {
    await ensureDirectoryExists();
    
    // Generate a new ID
    const id = ++SimpleConversationManager.counter;
    const now = new Date();
    
    // Create the conversation object
    const conversation: SimpleConversation = {
      id,
      lastMessageAt: now,
      participant,
      messages: initialMessages.map((message, index) => ({
        ...message,
        id: index + 1,
        conversationId: id,
        createdAt: new Date(now.getTime() - (initialMessages.length - index) * 60000) // Space messages 1 minute apart
      }))
    };
    
    // Save to file
    const filePath = path.join(SIMPLE_CONVERSATIONS_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
    
    console.log(`Created simple conversation ${id} with participant ${participant.displayName}`);
    return conversation;
  }
  
  /**
   * Gets a conversation by ID
   */
  static async getConversation(id: number): Promise<SimpleConversation | null> {
    try {
      const filePath = path.join(SIMPLE_CONVERSATIONS_DIR, `${id}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      
      // Parse the JSON and fix dates
      const conversation = JSON.parse(data);
      conversation.lastMessageAt = new Date(conversation.lastMessageAt);
      conversation.messages.forEach((message: Message) => {
        message.createdAt = new Date(message.createdAt);
      });
      
      return conversation;
    } catch (error) {
      console.error(`Error getting simple conversation ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Gets all conversations
   */
  static async getAllConversations(): Promise<SimpleConversation[]> {
    try {
      const files = await fs.readdir(SIMPLE_CONVERSATIONS_DIR);
      const conversationFiles = files.filter(file => file.endsWith('.json'));
      
      const conversations: SimpleConversation[] = [];
      
      for (const file of conversationFiles) {
        const filePath = path.join(SIMPLE_CONVERSATIONS_DIR, file);
        const data = await fs.readFile(filePath, 'utf-8');
        
        // Parse the JSON and fix dates
        const conversation = JSON.parse(data);
        conversation.lastMessageAt = new Date(conversation.lastMessageAt);
        conversation.messages.forEach((message: Message) => {
          message.createdAt = new Date(message.createdAt);
        });
        
        conversations.push(conversation);
      }
      
      // Sort by lastMessageAt (newest first)
      return conversations.sort((a, b) => 
        b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
      );
    } catch (error) {
      console.error('Error getting all simple conversations:', error);
      return [];
    }
  }
  
  /**
   * Adds a message to a conversation
   */
  static async addMessage(
    conversationId: number,
    message: Omit<Message, 'id' | 'conversationId' | 'createdAt'>
  ): Promise<Message | null> {
    try {
      const conversation = await SimpleConversationManager.getConversation(conversationId);
      
      if (!conversation) {
        console.error(`Conversation ${conversationId} not found`);
        return null;
      }
      
      // Generate a new ID for the message
      const messageId = conversation.messages.length > 0 
        ? Math.max(...conversation.messages.map(m => m.id)) + 1 
        : 1;
      
      // Create the new message
      const now = new Date();
      const newMessage: Message = {
        ...message,
        id: messageId,
        conversationId,
        createdAt: now
      };
      
      // Add the message to the conversation
      conversation.messages.push(newMessage);
      conversation.lastMessageAt = now;
      
      // Save the updated conversation
      const filePath = path.join(SIMPLE_CONVERSATIONS_DIR, `${conversationId}.json`);
      await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
      
      console.log(`Added message to conversation ${conversationId}`);
      return newMessage;
    } catch (error) {
      console.error(`Error adding message to conversation ${conversationId}:`, error);
      return null;
    }
  }
  
  /**
   * Creates a sample conversation file
   */
  static async createSampleConversation(participantUserId: number): Promise<SimpleConversation | null> {
    try {
      // Get the user data
      const usersData = await fs.readFile(path.join(DATA_DIR, 'users.json'), 'utf-8');
      const users = JSON.parse(usersData);
      
      // Find the user by ID
      const participant = users.find((user: User) => user.id === participantUserId);
      
      if (!participant) {
        console.error(`User ${participantUserId} not found`);
        return null;
      }
      
      // Define some sample messages
      const sampleMessages = [
        {
          senderId: participantUserId,
          type: 'text' as const,
          content: 'Hello! This is a sample conversation.',
          status: 'read' as const
        },
        {
          senderId: 5, // Current user
          type: 'text' as const,
          content: 'Hi! I created this with the new simplified conversation system!',
          status: 'read' as const
        },
        {
          senderId: participantUserId,
          type: 'image' as const,
          content: 'https://images.unsplash.com/photo-1601513237233-bd526fc3f66e',
          metadata: { caption: 'Check out this awesome image!' },
          status: 'read' as const
        }
      ];
      
      // Create the conversation
      return await SimpleConversationManager.createConversation(participant, sampleMessages);
    } catch (error) {
      console.error('Error creating sample conversation:', error);
      return null;
    }
  }
  
  /**
   * Creates a new conversation from a file
   */
  static async createConversationFromFile(filePath: string): Promise<SimpleConversation | null> {
    try {
      console.log(`Processing conversation file: ${filePath}`);
      
      // Read the file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Get the participant user
      let participantId = null;
      
      if (Array.isArray(data.participants)) {
        // Find the first participant that isn't the current user (ID 5)
        const participant = data.participants.find((p: any) => p.userId !== 5);
        if (participant) {
          participantId = participant.userId;
        }
      }
      
      if (participantId === null) {
        console.error('No valid participant found in the conversation file');
        return null;
      }
      
      // Get the user data
      const usersData = await fs.readFile(path.join(DATA_DIR, 'users.json'), 'utf-8');
      const users = JSON.parse(usersData);
      
      // Find the participant user
      const participant = users.find((user: User) => user.id === participantId);
      
      if (!participant) {
        console.error(`User ${participantId} not found`);
        return null;
      }
      
      // Create the conversation with initial messages
      const conversation = await SimpleConversationManager.createConversation(
        participant,
        data.messages || []
      );
      
      console.log(`Created conversation with ${participant.displayName} from file`);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation from file:', error);
      return null;
    }
  }
}