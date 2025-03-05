import fs from 'fs/promises';
import path from 'path';
import { fileStorage } from './fileStorage';
import { 
  User, InsertUser, 
  Conversation, InsertConversation, 
  Participant, InsertParticipant, 
  Message, InsertMessage 
} from '@shared/schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONVERSATIONS_DIR = path.join(DATA_DIR, 'conversations');

/**
 * Conversation Manager - Provides easy methods to work with conversation files
 */
export class ConversationManager {
  /**
   * Creates a new conversation between users
   */
  static async createConversation(participantUserIds: number[]): Promise<Conversation> {
    try {
      // Create a new conversation
      const conversation: InsertConversation = {};
      const newConversation = await fileStorage.createConversation(conversation);
      
      // Add participants to the conversation
      for (const userId of participantUserIds) {
        await fileStorage.addParticipant({
          userId,
          conversationId: newConversation.id
        });
      }
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
  
  /**
   * Adds a message to a conversation
   */
  static async addMessage(
    conversationId: number, 
    senderId: number, 
    type: 'text' | 'image' | 'audio', 
    content: string, 
    metadata?: { duration?: number, caption?: string, isQuote?: boolean }
  ): Promise<Message> {
    try {
      const message: InsertMessage = {
        conversationId,
        senderId,
        type,
        content,
        metadata
      };
      
      return await fileStorage.createMessage(message);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }
  
  /**
   * Gets all available conversations
   */
  static async getAllConversations(): Promise<Conversation[]> {
    try {
      const files = await fs.readdir(CONVERSATIONS_DIR);
      const conversationFiles = files.filter(file => !file.includes('_messages') && file.endsWith('.json'));
      
      const conversations: Conversation[] = [];
      
      for (const file of conversationFiles) {
        const id = parseInt(path.basename(file, '.json'));
        const conversation = await fileStorage.getConversation(id);
        if (conversation) {
          conversations.push(conversation);
        }
      }
      
      return conversations;
    } catch (error) {
      console.error('Error getting all conversations:', error);
      return [];
    }
  }
  
  /**
   * Gets a complete conversation with messages and participants
   */
  static async getCompleteConversation(conversationId: number): Promise<{
    conversation: Conversation,
    messages: Message[],
    participants: User[]
  } | null> {
    try {
      const conversation = await fileStorage.getConversation(conversationId);
      
      if (!conversation) {
        return null;
      }
      
      const messages = await fileStorage.getMessagesByConversationId(conversationId);
      const participantRecords = await fileStorage.getParticipantsByConversationId(conversationId);
      
      // Get user objects for participants
      const participantUsers: User[] = [];
      for (const participant of participantRecords) {
        const user = await fileStorage.getUser(participant.userId);
        if (user) {
          participantUsers.push(user);
        }
      }
      
      return {
        conversation,
        messages,
        participants: participantUsers
      };
    } catch (error) {
      console.error('Error getting complete conversation:', error);
      return null;
    }
  }
  
  /**
   * Updates the status of a message
   */
  static async updateMessageStatus(
    messageId: number, 
    status: 'sent' | 'delivered' | 'read'
  ): Promise<Message | undefined> {
    try {
      return await fileStorage.updateMessageStatus(messageId, status);
    } catch (error) {
      console.error('Error updating message status:', error);
      return undefined;
    }
  }
  
  /**
   * Creates a file with a full conversation sample that can be loaded
   */
  static async createSampleConversationFile(filename: string): Promise<void> {
    try {
      // Create a sample conversation structure
      const conversation: Conversation = {
        id: 999, // Will be replaced when loaded
        lastMessageAt: new Date()
      };
      
      const participants = [
        { userId: 1 }, // Fabian
        { userId: 5 }  // Current user
      ];
      
      const messages: Omit<Message, 'id' | 'conversationId' | 'createdAt'>[] = [
        {
          senderId: 1,
          type: 'text',
          content: 'Hello! This is a sample conversation from a file',
          status: 'read'
        },
        {
          senderId: 5,
          type: 'text',
          content: 'Wow, this is cool! I can create conversations from files',
          status: 'read'
        },
        {
          senderId: 1,
          type: 'image',
          content: 'https://images.unsplash.com/photo-1601513237233-bd526fc3f66e',
          metadata: { caption: 'Check out this awesome image!' },
          status: 'read'
        }
      ];
      
      // Create the conversation definition file
      const conversationDefinition = {
        conversation,
        participants,
        messages
      };
      
      // Save to the specified file
      const filePath = path.join(DATA_DIR, filename);
      await fs.writeFile(filePath, JSON.stringify(conversationDefinition, null, 2));
      
      console.log(`Sample conversation file created at ${filePath}`);
    } catch (error) {
      console.error('Error creating sample conversation file:', error);
      throw error;
    }
  }
  
  /**
   * Loads a conversation from a definition file
   */
  static async loadConversationFromFile(filename: string): Promise<Conversation | null> {
    try {
      const filePath = path.join(DATA_DIR, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      const definition = JSON.parse(data);
      
      // Create a new conversation
      const newConversation = await fileStorage.createConversation({});
      
      // Add participants
      for (const participant of definition.participants) {
        await fileStorage.addParticipant({
          userId: participant.userId,
          conversationId: newConversation.id
        });
      }
      
      // Add messages
      for (const messageData of definition.messages) {
        await fileStorage.createMessage({
          conversationId: newConversation.id,
          senderId: messageData.senderId,
          type: messageData.type,
          content: messageData.content,
          metadata: messageData.metadata,
          status: messageData.status
        });
      }
      
      console.log(`Conversation loaded from ${filename} with ID ${newConversation.id}`);
      return newConversation;
    } catch (error) {
      console.error('Error loading conversation from file:', error);
      return null;
    }
  }
}