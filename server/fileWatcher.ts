import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';
import { fileStorage } from './fileStorage';
import { ConversationManager } from './conversationManager';

// Directory to watch for new conversation files
const NEW_CONVERSATIONS_DIR = path.join(process.cwd(), 'data', 'new-conversations');

// Make sure the directory exists
async function ensureDirectoryExists() {
  try {
    await fs.mkdir(NEW_CONVERSATIONS_DIR, { recursive: true });
    console.log(`Watching for new conversation files in: ${NEW_CONVERSATIONS_DIR}`);
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Process a new conversation file
async function processConversationFile(filePath: string) {
  try {
    console.log(`Processing new conversation file: ${filePath}`);
    
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Create a new conversation
    const conversation = await fileStorage.createConversation({});
    console.log(`Created new conversation with ID: ${conversation.id}`);
    
    // Add participants
    if (Array.isArray(data.participants)) {
      for (const participant of data.participants) {
        if (typeof participant.userId === 'number') {
          await fileStorage.addParticipant({
            userId: participant.userId,
            conversationId: conversation.id
          });
          console.log(`Added participant ${participant.userId} to conversation ${conversation.id}`);
        }
      }
    }
    
    // Add messages
    if (Array.isArray(data.messages)) {
      for (const message of data.messages) {
        if (
          typeof message.senderId === 'number' && 
          typeof message.type === 'string' && 
          typeof message.content === 'string'
        ) {
          await fileStorage.createMessage({
            conversationId: conversation.id,
            senderId: message.senderId,
            type: message.type as 'text' | 'image' | 'audio',
            content: message.content,
            metadata: message.metadata,
            status: message.status || 'sent'
          });
          console.log(`Added ${message.type} message from ${message.senderId} to conversation ${conversation.id}`);
        }
      }
    }
    
    // Move the file to a processed directory to avoid reprocessing
    const processedDir = path.join(path.dirname(filePath), 'processed');
    await fs.mkdir(processedDir, { recursive: true });
    
    const fileName = path.basename(filePath);
    const newFilePath = path.join(processedDir, `${fileName}.processed-${Date.now()}`);
    await fs.rename(filePath, newFilePath);
    
    console.log(`Conversation file processed and moved to: ${newFilePath}`);
    return conversation;
  } catch (error) {
    console.error('Error processing conversation file:', error);
    return null;
  }
}

export function startFileWatcher() {
  // Create the directory if it doesn't exist
  ensureDirectoryExists();
  
  // Set up file watcher
  const watcher = chokidar.watch(`${NEW_CONVERSATIONS_DIR}/*.json`, {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true,
    ignoreInitial: false, // Process existing files on startup
  });
  
  // When a new file is added
  watcher.on('add', async (filePath) => {
    // Check if this is in a processed subdirectory
    if (filePath.includes('processed')) {
      return;
    }
    
    console.log(`New conversation file detected: ${filePath}`);
    await processConversationFile(filePath);
  });
  
  console.log('File watcher started.');
  return watcher;
}

// Function to create a simple conversation template file
export async function createSimpleConversationTemplate() {
  const templatePath = path.join(NEW_CONVERSATIONS_DIR, 'conversation-template.json');
  
  // Check if template already exists
  try {
    await fs.access(templatePath);
    console.log('Template already exists, skipping creation');
    return;
  } catch (error) {
    // File doesn't exist, create it
  }
  
  const template = {
    "participants": [
      { "userId": 1 }, // Fabian
      { "userId": 5 }  // Current user
    ],
    "messages": [
      {
        "senderId": 1,
        "type": "text",
        "content": "Hello! This is a new conversation.",
        "status": "read"
      },
      {
        "senderId": 5,
        "type": "text",
        "content": "Hi! I created this by simply adding a file to the new-conversations folder!",
        "status": "read"
      }
    ]
  };
  
  await fs.writeFile(templatePath, JSON.stringify(template, null, 2));
  console.log(`Created conversation template at: ${templatePath}`);
}