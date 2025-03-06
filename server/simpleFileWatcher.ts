import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';
import { SimpleConversationManager } from './simpleConversationManager';

// Directory to watch for new conversation files
const NEW_CONVERSATIONS_DIR = path.join(process.cwd(), 'data', 'new-conversations');

// Make sure the directory exists
async function ensureDirectoryExists() {
  try {
    await fsPromises.mkdir(NEW_CONVERSATIONS_DIR, { recursive: true });
    console.log(`Watching for new conversation files in: ${NEW_CONVERSATIONS_DIR}`);
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Process a new conversation file
async function processConversationFile(filePath: string) {
  try {
    console.log(`Processing conversation file with simple manager: ${filePath}`);
    
    // Create a new conversation from the file
    const conversation = await SimpleConversationManager.createConversationFromFile(filePath);
    
    if (!conversation) {
      console.error(`Failed to create conversation from ${filePath}`);
      return null;
    }
    
    // Move the file to a processed directory to avoid reprocessing
    const processedDir = path.join(path.dirname(filePath), 'processed');
    await fsPromises.mkdir(processedDir, { recursive: true });
    
    const fileName = path.basename(filePath);
    const newFilePath = path.join(processedDir, `${fileName}.processed-${Date.now()}`);
    await fsPromises.rename(filePath, newFilePath);
    
    console.log(`Conversation file processed and moved to: ${newFilePath}`);
    return conversation;
  } catch (error) {
    console.error('Error processing conversation file:', error);
    return null;
  }
}

export async function startSimpleFileWatcher() {
  // Initialize the conversation manager
  await SimpleConversationManager.initialize();
  
  // Create the directory if it doesn't exist
  await ensureDirectoryExists();
  
  // Set up file watcher
  const watcher = chokidar.watch(`${NEW_CONVERSATIONS_DIR}/*.json`, {
    ignored: [/(^|[\/\\])\./, /processed/], // Ignore dotfiles and processed directory
    persistent: true,
    ignoreInitial: false, // Process existing files on startup
    awaitWriteFinish: {
      stabilityThreshold: 2000, // Wait 2 seconds after last write
      pollInterval: 100
    }
  });
  
  // Process any existing files first
  const files = fs.readdirSync(NEW_CONVERSATIONS_DIR);
  console.log(`Found ${files.length} files in the directory. Processing with simple manager...`);
  
  for (const file of files) {
    if (file.endsWith('.json') && 
        !file.includes('template') && 
        !file.includes('processed') && 
        file !== 'conversation-template.json' && 
        file !== 'sample-template.json' &&
        file !== 'README.md') {
      
      const filePath = path.join(NEW_CONVERSATIONS_DIR, file);
      console.log(`Processing existing file with simple manager: ${filePath}`);
      try {
        await processConversationFile(filePath);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }
  
  // When a new file is added
  watcher.on('add', async (filePath) => {
    // Skip template files and files in processed directory
    if (filePath.includes('processed') || 
        filePath.includes('template') || 
        path.basename(filePath) === 'conversation-template.json' || 
        path.basename(filePath) === 'sample-template.json' ||
        path.basename(filePath) === 'README.md') {
      console.log(`Skipping template file: ${filePath}`);
      return;
    }
    
    console.log(`New conversation file detected: ${filePath}`);
    await processConversationFile(filePath);
  });
  
  console.log('Simple file watcher started.');
  return watcher;
}

// Function to create a simple conversation template file
export async function createSimpleConversationTemplate() {
  const templatePath = path.join(NEW_CONVERSATIONS_DIR, 'simple-conversation-template.json');
  
  // Check if template already exists
  try {
    await fsPromises.access(templatePath, fs.constants.F_OK);
    console.log('Simple template already exists, skipping creation');
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
        "content": "Hello! This is a new conversation with the simplified system.",
        "status": "read"
      },
      {
        "senderId": 5,
        "type": "text",
        "content": "Great! Now each conversation is stored in a single file with all information.",
        "status": "read"
      }
    ]
  };
  
  await fsPromises.writeFile(templatePath, JSON.stringify(template, null, 2));
  console.log(`Created simple conversation template at: ${templatePath}`);
}

// Function to create a sample conversation with a specific user
export async function createSimpleSampleConversations() {
  // Create sample conversations with each user
  const userIds = [1, 2, 3, 4]; // Fabian, Peter, Madeleine, Nicolas
  
  for (const userId of userIds) {
    await SimpleConversationManager.createSampleConversation(userId);
  }
  
  console.log('Created sample conversations with all users');
}