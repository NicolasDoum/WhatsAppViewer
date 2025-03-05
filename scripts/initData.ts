import { fileStorage } from '../server/fileStorage';
import { ConversationManager } from '../server/conversationManager';

async function initializeData() {
  console.log('Initializing data with file-based storage...');
  
  // Initialize sample users and basic conversations
  await fileStorage.initSampleData();
  
  // Create a sample conversation definition file
  await ConversationManager.createSampleConversationFile('sample-conversation.json');
  
  console.log('Data initialization complete!');
  console.log('You can now:');
  console.log('1. Create conversations by calling ConversationManager.createConversation()');
  console.log('2. Add messages to conversations with ConversationManager.addMessage()');
  console.log('3. Load the sample conversation with ConversationManager.loadConversationFromFile("sample-conversation.json")');
}

// Run the initialization
initializeData().catch(console.error);