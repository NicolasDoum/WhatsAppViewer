import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  return httpServer;
}
