import type { Express } from "express";
import { createServer, type Server } from "http";
// import { storage } from "./storage";
import { fileStorage as storage } from "./fileStorage";
import { ConversationManager } from "./conversationManager";

export async function registerRoutes(app: Express): Promise<Server> {
  // HTTP Server for potential WebSocket usage later
  const httpServer = createServer(app);

  // Get all conversations for the current user
  app.get("/api/conversations", async (req, res) => {
    try {
      // For simplicity, always use userId 5 (current user)
      const userId = 5;
      const conversations = await storage.getConversationsByUserId(userId);
      
      // Enhance conversations with last message and participant info
      const enhancedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const messages = await storage.getMessagesByConversationId(conversation.id);
          const participants = await storage.getParticipantsByConversationId(conversation.id);
          
          // Get other participants (not the current user)
          const otherParticipantIds = participants
            .filter(p => p.userId !== userId)
            .map(p => p.userId);
          
          // Get the user objects for other participants
          const otherParticipants = await Promise.all(
            otherParticipantIds.map(id => storage.getUser(id))
          );
          
          // Get the last message
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
          
          return {
            ...conversation,
            lastMessage,
            participants: otherParticipants.filter(Boolean) // Remove any undefined values
          };
        })
      );
      
      res.json(enhancedConversations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversations" });
    }
  });

  // Get a specific conversation with its messages
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id, 10);
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getMessagesByConversationId(conversationId);
      const participants = await storage.getParticipantsByConversationId(conversationId);
      
      // Get user objects for all participants
      const users = await Promise.all(
        participants.map(p => storage.getUser(p.userId))
      );
      
      res.json({
        ...conversation,
        messages,
        participants: users.filter(Boolean) // Remove any undefined values
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversation" });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Get current user (for simplicity, always return user with ID 5)
  app.get("/api/me", async (req, res) => {
    try {
      const currentUser = await storage.getUser(5); // Hardcoded to user ID 5
      if (!currentUser) {
        return res.status(404).json({ message: "Current user not found" });
      }
      res.json(currentUser);
    } catch (error) {
      res.status(500).json({ message: "Error fetching current user" });
    }
  });

  // Update message status
  app.put("/api/messages/:id/status", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      if (!status || !['sent', 'delivered', 'read'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedMessage = await storage.updateMessageStatus(messageId, status);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Error updating message status" });
    }
  });

  // Conversation manager is now imported at the top of the file

  // Load a conversation from a file
  app.post("/api/conversations/load-from-file", async (req, res) => {
    try {
      const { filename } = req.body;
      
      if (!filename) {
        return res.status(400).json({ message: "Filename is required" });
      }
      
      const conversation = await ConversationManager.loadConversationFromFile(filename);
      
      if (!conversation) {
        return res.status(404).json({ message: "Failed to load conversation from file" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Error loading conversation from file:", error);
      res.status(500).json({ message: "Error loading conversation from file" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const { participantUserIds } = req.body;
      
      if (!participantUserIds || !Array.isArray(participantUserIds) || participantUserIds.length === 0) {
        return res.status(400).json({ message: "Participant user IDs are required" });
      }
      
      const conversation = await ConversationManager.createConversation(participantUserIds);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Error creating conversation" });
    }
  });

  // Add a message to a conversation
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id, 10);
      const { senderId, type, content, metadata } = req.body;
      
      if (!senderId || !type || !content) {
        return res.status(400).json({ message: "Sender ID, type, and content are required" });
      }
      
      if (!['text', 'image', 'audio'].includes(type)) {
        return res.status(400).json({ message: "Type must be 'text', 'image', or 'audio'" });
      }
      
      const message = await ConversationManager.addMessage(conversationId, senderId, type, content, metadata);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error adding message:", error);
      res.status(500).json({ message: "Error adding message" });
    }
  });

  return httpServer;
}
