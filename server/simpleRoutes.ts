import { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { SimpleConversationManager } from './simpleConversationManager';

export async function registerSimpleRoutes(app: Express): Promise<Server> {
  // Get current user (always user with ID 5)
  app.get('/api/simple/me', async (req, res) => {
    try {
      // Read the users file to get the current user (ID 5)
      const fs = require('fs').promises;
      const path = require('path');
      
      const usersData = await fs.readFile(path.join(process.cwd(), 'data', 'users.json'), 'utf8');
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
  app.get('/api/simple/conversations', async (req, res) => {
    try {
      const conversations = await SimpleConversationManager.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ message: 'Error getting conversations' });
    }
  });
  
  // Get a specific conversation
  app.get('/api/simple/conversations/:id', async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id, 10);
      const conversation = await SimpleConversationManager.getConversation(conversationId);
      
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
  app.post('/api/simple/conversations/:id/messages', async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id, 10);
      const { senderId, type, content, metadata } = req.body;
      
      if (!senderId || !type || !content) {
        return res.status(400).json({ message: 'Sender ID, type, and content are required' });
      }
      
      if (!['text', 'image', 'audio'].includes(type)) {
        return res.status(400).json({ message: "Type must be 'text', 'image', or 'audio'" });
      }
      
      const message = await SimpleConversationManager.addMessage(conversationId, {
        senderId,
        type: type as 'text' | 'image' | 'audio',
        content,
        metadata,
        status: 'sent'
      });
      
      if (!message) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      res.status(201).json(message);
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ message: 'Error adding message' });
    }
  });
  
  // Create a new conversation with a user
  app.post('/api/simple/conversations', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Get the user data
      const fs = require('fs').promises;
      const path = require('path');
      
      const usersData = await fs.readFile(path.join(process.cwd(), 'data', 'users.json'), 'utf8');
      const users = JSON.parse(usersData);
      
      const participant = users.find((user: any) => user.id === userId);
      
      if (!participant) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Create the conversation
      const conversation = await SimpleConversationManager.createConversation(participant);
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ message: 'Error creating conversation' });
    }
  });
  
  // Handle errors
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  });
  
  return app.listen(3000);
}