import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  lastSeen: timestamp("last_seen"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
});

// Participants table (for conversations)
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
});

export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'text', 'image', 'audio'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // For audio duration, image dimensions, etc
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("sent"), // 'sent', 'delivered', 'read'
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
