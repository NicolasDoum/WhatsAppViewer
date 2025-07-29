import fs from 'fs/promises';
import path from 'path';
import { Message, User } from '../shared/schema';

// Define conversation builder types
interface MessageBuilder {
  senderId: number;
  type: 'text' | 'image' | 'audio';
  content: string;
  metadata?: {
    duration?: number;
    caption?: string;
    isQuote?: boolean;
  };
  timestamp?: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ConversationBuilder {
  id: number;
  participantId: number;
  messages: MessageBuilder[];
}

// Helper functions to create messages
export function createTextMessage(
  senderId: number,
  content: string,
  timestamp?: Date,
  status: 'sent' | 'delivered' | 'read' = 'read'
): MessageBuilder {
  return {
    senderId,
    type: 'text',
    content,
    timestamp,
    status
  };
}

export function createImageMessage(
  senderId: number,
  imageUrl: string,
  caption?: string,
  timestamp?: Date,
  status: 'sent' | 'delivered' | 'read' = 'read'
): MessageBuilder {
  return {
    senderId,
    type: 'image',
    content: imageUrl,
    metadata: caption ? { caption } : undefined,
    timestamp,
    status
  };
}

export function createAudioMessage(
  senderId: number,
  audioUrl: string,
  duration: number,
  timestamp?: Date,
  status: 'sent' | 'delivered' | 'read' = 'read'
): MessageBuilder {
  return {
    senderId,
    type: 'audio',
    content: audioUrl,
    metadata: { duration },
    timestamp,
    status
  };
}

// Load users to get participant data
async function loadUsers(): Promise<User[]> {
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  const data = await fs.readFile(usersPath, 'utf-8');
  return JSON.parse(data);
}

// Generate a conversation from builders
export async function generateConversation(builder: ConversationBuilder): Promise<void> {
  const users = await loadUsers();
  const participant = users.find(u => u.id === builder.participantId);
  
  if (!participant) {
    throw new Error(`User with ID ${builder.participantId} not found`);
  }
  
  // Generate messages with proper IDs and timestamps
  let baseMessageId = builder.id * 1000;
  let currentTime = new Date();
  
  const messages: Message[] = builder.messages.map((msgBuilder, index) => {
    // If no timestamp provided, space messages 2-5 minutes apart
    const timestamp = msgBuilder.timestamp || new Date(currentTime.getTime() + (index * 3 * 60 * 1000));
    
    return {
      id: baseMessageId + index + 1,
      conversationId: builder.id,
      senderId: msgBuilder.senderId,
      type: msgBuilder.type,
      content: msgBuilder.content,
      metadata: msgBuilder.metadata || {},
      createdAt: timestamp,
      status: msgBuilder.status || 'read'
    };
  });
  
  // Get last message timestamp
  const lastMessageAt = messages.length > 0 
    ? messages[messages.length - 1].createdAt 
    : new Date();
  
  // Create conversation object
  const conversation = {
    id: builder.id,
    lastMessageAt,
    participant,
    messages
  };
  
  // Write to file
  const outputDir = path.join(process.cwd(), 'data', 'direct-conversations');
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputPath = path.join(outputDir, `${builder.id}.json`);
  await fs.writeFile(outputPath, JSON.stringify(conversation, null, 2));
  
  console.log(`✅ Generated conversation ${builder.id} with ${messages.length} messages`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`🌐 View at: http://localhost:5173/screenshot/${builder.id}`);
}

// Example usage function
export async function generateExampleConversation() {
  const conversation: ConversationBuilder = {
    id: 10, // New conversation ID
    participantId: 2, // Sarah
    messages: [
      createTextMessage(2, "Hey! Have you seen the new AI features?", new Date('2025-03-10T10:00:00')),
      createTextMessage(5, "Yes! I've been testing them out. Pretty impressive!", new Date('2025-03-10T10:02:00')),
      createTextMessage(2, "Which one do you like the most?", new Date('2025-03-10T10:03:00')),
      createTextMessage(5, "The conversation generator is amazing. It creates realistic WhatsApp chats!", new Date('2025-03-10T10:05:00')),
      createImageMessage(
        2, 
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400", 
        "Look at this AI-generated art!",
        new Date('2025-03-10T10:07:00')
      ),
      createTextMessage(5, "Wow! That's incredible 🤯", new Date('2025-03-10T10:08:00')),
      createAudioMessage(
        2,
        "/audio/sample-message.mp3",
        15, // 15 seconds
        new Date('2025-03-10T10:10:00')
      ),
      createTextMessage(5, "Great explanation! This will be perfect for demos", new Date('2025-03-10T10:12:00')),
    ]
  };
  
  await generateConversation(conversation);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateExampleConversation().catch(console.error);
}