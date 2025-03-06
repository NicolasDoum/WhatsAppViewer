import { Express, Request, Response, NextFunction } from 'express';
import { Server, createServer } from 'http';
import fs from 'fs/promises';
import path from 'path';
import { 
  loadAllConversations, 
  createConversationTemplate, 
  DirectConversation 
} from './directConversationLoader';

const CONVERSATIONS_DIR = path.join(process.cwd(), 'data', 'direct-conversations');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Register the direct conversation routes
export async function registerDirectRoutes(app: Express): Promise<Server> {
  // Create an HTTP server
  const server = createServer(app);
  // Get current user (always user with ID 5)
  app.get('/api/direct/me', async (req, res) => {
    try {
      const usersData = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(usersData);
      
      const currentUser = users.find((user: any) => user.id === 5);
      
      if (!currentUser) {
        return res.status(404).json({ message: 'Current user not found' });
      }
      
      res.json(currentUser);
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: 'Error getting current user' });
    }
  });
  
  // Get all conversations
  app.get('/api/direct/conversations', async (req, res) => {
    try {
      const conversations = await loadAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ message: 'Error getting conversations' });
    }
  });
  
  // Get a specific conversation
  app.get('/api/direct/conversations/:id', async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id, 10);
      const conversations = await loadAllConversations();
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error('Error getting conversation:', error);
      res.status(500).json({ message: 'Error getting conversation' });
    }
  });
  
  // Add a message to a conversation
  app.post('/api/direct/conversations/:id/messages', async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id, 10);
      const { senderId, type, content, metadata } = req.body;
      
      if (!senderId || !type || !content) {
        return res.status(400).json({ message: 'Sender ID, type, and content are required' });
      }
      
      if (!['text', 'image', 'audio'].includes(type)) {
        return res.status(400).json({ message: "Type must be 'text', 'image', or 'audio'" });
      }
      
      // Load the conversation
      const filePath = path.join(CONVERSATIONS_DIR, `${conversationId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const conversation: DirectConversation = JSON.parse(data);
      
      // Generate a new message ID using conversationId as prefix
      // For conversation 1, IDs start at 1001
      // For conversation 2, IDs start at 2001, etc.
      const baseMessageId = conversationId * 1000;
      const messageId = conversation.messages.length > 0 
        ? Math.max(...conversation.messages.map(m => m.id)) + 1 
        : baseMessageId + 1;
      
      // Create the new message
      const now = new Date();
      const message = {
        id: messageId,
        conversationId,
        senderId,
        type,
        content,
        metadata,
        createdAt: now,
        status: 'sent'
      };
      
      // Add the message to the conversation
      conversation.messages.push(message);
      conversation.lastMessageAt = now;
      
      // Save the updated conversation
      await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
      
      res.status(201).json(message);
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ message: 'Error adding message' });
    }
  });
  
  // Handle errors
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  });
  
  return server;
}