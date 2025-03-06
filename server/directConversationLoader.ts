import fs from 'fs/promises';
import path from 'path';
import { User, Message } from '@shared/schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONVERSATIONS_DIR = path.join(DATA_DIR, 'direct-conversations');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Simple conversation type with all data in one place
export interface DirectConversation {
  id: number;
  lastMessageAt: Date;
  participant: User; // The other participant (not the current user)
  messages: Message[];
}

// Ensure the directory exists
async function ensureDirectoryExists() {
  try {
    await fs.mkdir(CONVERSATIONS_DIR, { recursive: true });
    console.log(`Created direct conversations directory: ${CONVERSATIONS_DIR}`);
  } catch (error) {
    console.error('Error creating direct-conversations directory:', error);
  }
}

// Load all users
async function loadUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Get current user (always ID 5)
async function getCurrentUser(): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find(user => user.id === 5);
}

// Load all conversations from the directory
export async function loadAllConversations(): Promise<DirectConversation[]> {
  await ensureDirectoryExists();
  
  try {
    const files = await fs.readdir(CONVERSATIONS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const conversations: DirectConversation[] = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(CONVERSATIONS_DIR, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const conversation = JSON.parse(data);
        
        // Fix dates
        conversation.lastMessageAt = new Date(conversation.lastMessageAt);
        conversation.messages.forEach((message: Message) => {
          message.createdAt = new Date(message.createdAt);
        });
        
        conversations.push(conversation);
      } catch (error) {
        console.error(`Error loading conversation from ${file}:`, error);
      }
    }
    
    // Sort by lastMessageAt (newest first)
    return conversations.sort((a, b) => 
      b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    );
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

// Create conversation template
export async function createConversationTemplate() {
  const users = await loadUsers();
  const currentUser = users.find(user => user.id === 5);
  
  if (!currentUser) {
    console.error('Current user not found');
    return;
  }
  
  // Template for each type of user
  for (const user of users) {
    // Skip current user
    if (user.id === 5) continue;
    
    const templatePath = path.join(CONVERSATIONS_DIR, `template-${user.username}.json`);
    
    // Check if template already exists
    try {
      await fs.access(templatePath);
      console.log(`Template for ${user.username} already exists, skipping`);
      continue;
    } catch {
      // File doesn't exist, create it
    }
    
    const now = new Date();
    const conversation: DirectConversation = {
      id: user.id,
      lastMessageAt: now,
      participant: user,
      messages: [
        {
          id: 1,
          conversationId: user.id,
          senderId: user.id,
          type: 'text',
          content: `Hello! This is a template conversation with ${user.displayName}.`,
          createdAt: new Date(now.getTime() - 3600000), // 1 hour ago
          status: 'read'
        },
        {
          id: 2,
          conversationId: user.id,
          senderId: 5, // Current user
          type: 'text',
          content: 'Hi! Just edit this file to create a new conversation.',
          createdAt: now,
          status: 'read'
        }
      ]
    };
    
    await fs.writeFile(templatePath, JSON.stringify(conversation, null, 2));
    console.log(`Created conversation template with ${user.displayName}`);
  }
}

// Create a conversation by copying and modifying the template
export async function createSampleConversation(userId: number, conversationId: number): Promise<DirectConversation | null> {
  const users = await loadUsers();
  const participant = users.find(user => user.id === userId);
  
  if (!participant) {
    console.error(`User ${userId} not found`);
    return null;
  }
  
  const now = new Date();
  const conversation: DirectConversation = {
    id: conversationId,
    lastMessageAt: now,
    participant,
    messages: [
      {
        id: 1,
        conversationId,
        senderId: userId,
        type: 'text',
        content: `Hello! This is a sample conversation with ${participant.displayName}.`,
        createdAt: new Date(now.getTime() - 3600000), // 1 hour ago
        status: 'read'
      },
      {
        id: 2,
        conversationId,
        senderId: 5, // Current user
        type: 'text',
        content: 'Hi there! This is a new direct conversation system.',
        createdAt: new Date(now.getTime() - 1800000), // 30 minutes ago
        status: 'read'
      },
      {
        id: 3,
        conversationId,
        senderId: userId,
        type: 'text',
        content: 'It looks great! No API calls needed to create conversations.',
        createdAt: now,
        status: 'read'
      }
    ]
  };
  
  const filePath = path.join(CONVERSATIONS_DIR, `${conversationId}.json`);
  await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
  
  console.log(`Created sample conversation with ${participant.displayName}`);
  return conversation;
}

// Create sample conversations with all users
export async function createSampleConversations() {
  const users = await loadUsers();
  
  let id = 1;
  for (const user of users) {
    // Skip current user
    if (user.id === 5) continue;
    
    await createSampleConversation(user.id, id++);
  }
  
  console.log('Created sample conversations with all users');
}