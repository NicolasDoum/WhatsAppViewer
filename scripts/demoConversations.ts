import { 
  generateConversation, 
  createTextMessage, 
  createImageMessage, 
  createAudioMessage,
  ConversationBuilder 
} from './generateConversation';

// Demo 1: AI Assistant Conversation
export async function generateAIAssistantDemo() {
  const conversation: ConversationBuilder = {
    id: 20,
    participantId: 3, // Peter (AI Assistant)
    messages: [
      createTextMessage(5, "Hey AI, can you help me plan a trip to Japan?", new Date('2025-03-15T09:00:00')),
      createTextMessage(3, "Of course! I'd be happy to help you plan your trip to Japan. When are you thinking of going, and what are your main interests?", new Date('2025-03-15T09:01:00')),
      createTextMessage(5, "I'm thinking April for the cherry blossoms. I love food, culture, and technology!", new Date('2025-03-15T09:02:00')),
      createTextMessage(3, "April is perfect for cherry blossoms! 🌸 Here's what I recommend:\n\n📍 Tokyo (4-5 days)\n• Shibuya & Harajuku for tech and youth culture\n• Tsukiji for amazing food\n• Ueno Park for cherry blossoms\n\n📍 Kyoto (3 days)\n• Traditional temples and gardens\n• Philosopher's Path during sakura season\n• Kaiseki dining experience\n\n📍 Osaka (2 days)\n• Street food paradise\n• Dotonbori district\n• Day trip to Nara for deer park", new Date('2025-03-15T09:04:00')),
      createImageMessage(3, "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", "Mount Fuji during cherry blossom season - absolutely breathtaking!", new Date('2025-03-15T09:06:00')),
      createTextMessage(5, "This looks amazing! What about accommodation?", new Date('2025-03-15T09:07:00')),
      createTextMessage(3, "For accommodation, I suggest mixing it up:\n\n🏨 Tokyo: Modern hotel in Shinjuku for convenience\n🏯 Kyoto: Traditional ryokan with onsen\n🏠 Osaka: Capsule hotel for the experience!\n\nBudget: ~$100-150/night for good options", new Date('2025-03-15T09:09:00')),
      createAudioMessage(5, "/audio/MessageJulie.mp3", 8, new Date('2025-03-15T09:11:00')),
      createTextMessage(3, "Great questions in your voice message! Yes, JR Pass is definitely worth it for Tokyo-Kyoto-Osaka. Book it before arriving for better rates. For language, download Google Translate offline - most signs have English but it helps with menus!", new Date('2025-03-15T09:13:00'))
    ]
  };
  
  await generateConversation(conversation);
  console.log("✨ AI Assistant demo conversation generated!");
}

// Demo 2: Team Collaboration
export async function generateTeamCollaborationDemo() {
  const conversation: ConversationBuilder = {
    id: 21,
    participantId: 4, // Julie (Team Lead)
    messages: [
      createTextMessage(4, "Morning team! Quick update on the AI integration project 🚀", new Date('2025-03-16T08:30:00')),
      createTextMessage(4, "We've successfully implemented the conversation generator. Here's what's working:", new Date('2025-03-16T08:31:00')),
      createTextMessage(4, "✅ WhatsApp-style UI\n✅ Multiple message types\n✅ Screenshot-ready views\n✅ Programmatic conversation creation", new Date('2025-03-16T08:32:00')),
      createTextMessage(5, "Excellent progress! I've tested the screenshot mode and it looks perfect", new Date('2025-03-16T08:35:00')),
      createImageMessage(5, "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800", "Here's a screenshot of the output - exactly like real WhatsApp!", new Date('2025-03-16T08:36:00')),
      createTextMessage(4, "Perfect! Next steps:", new Date('2025-03-16T08:38:00')),
      createTextMessage(4, "1️⃣ Add AI personality configuration\n2️⃣ Implement conversation templates\n3️⃣ Build screenshot automation\n4️⃣ Create sharing functionality", new Date('2025-03-16T08:39:00')),
      createTextMessage(5, "I can handle the AI personality configuration. Should we use OpenAI or Claude?", new Date('2025-03-16T08:42:00')),
      createTextMessage(4, "Let's support both! We can add a provider selection in the config", new Date('2025-03-16T08:43:00')),
      createAudioMessage(4, "/audio/MessageJulie.mp3", 12, new Date('2025-03-16T08:45:00')),
      createTextMessage(5, "Sounds good! I'll start working on the AI integration today 💪", new Date('2025-03-16T08:47:00'))
    ]
  };
  
  await generateConversation(conversation);
  console.log("💼 Team collaboration demo conversation generated!");
}

// Demo 3: Multi-day conversation with various content
export async function generateMultiDayDemo() {
  const conversation: ConversationBuilder = {
    id: 22,
    participantId: 1, // Fabien
    messages: [
      // Day 1
      createTextMessage(1, "Did you see the AI announcement yesterday?", new Date('2025-03-10T14:00:00')),
      createTextMessage(5, "Which one? There were so many! 😅", new Date('2025-03-10T14:15:00')),
      createTextMessage(1, "The new conversational AI that can generate realistic chat screenshots", new Date('2025-03-10T14:16:00')),
      createTextMessage(5, "Oh yes! That's actually what we're building", new Date('2025-03-10T14:18:00')),
      
      // Day 2
      createTextMessage(1, "How's the progress going?", new Date('2025-03-11T10:30:00')),
      createImageMessage(5, "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800", "Check out this code snippet - we're making great progress!", new Date('2025-03-11T10:35:00')),
      createTextMessage(1, "Impressive! The UI looks exactly like WhatsApp", new Date('2025-03-11T10:37:00')),
      
      // Day 3
      createTextMessage(5, "We added audio message support today!", new Date('2025-03-12T16:20:00')),
      createAudioMessage(1, "/audio/MessageJulie.mp3", 10, new Date('2025-03-12T16:25:00')),
      createTextMessage(5, "The audio player works perfectly! Great demo 👏", new Date('2025-03-12T16:27:00')),
      
      // Day 4
      createTextMessage(1, "Can we use this for customer support scenarios?", new Date('2025-03-13T11:00:00')),
      createTextMessage(5, "Absolutely! We can create any type of conversation:\n• Customer support\n• Sales demos\n• Training scenarios\n• Social media content", new Date('2025-03-13T11:05:00')),
      createTextMessage(1, "This is going to be huge for our marketing team! 🎉", new Date('2025-03-13T11:07:00'))
    ]
  };
  
  await generateConversation(conversation);
  console.log("📅 Multi-day demo conversation generated!");
}

// Generate all demos
export async function generateAllDemos() {
  console.log("🎬 Generating all demo conversations...\n");
  
  await generateAIAssistantDemo();
  await generateTeamCollaborationDemo();
  await generateMultiDayDemo();
  
  console.log("\n✅ All demo conversations generated successfully!");
  console.log("📸 View them at:");
  console.log("   • http://localhost:5173/screenshot/20 (AI Assistant)");
  console.log("   • http://localhost:5173/screenshot/21 (Team Collaboration)");
  console.log("   • http://localhost:5173/screenshot/22 (Multi-day Chat)");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllDemos().catch(console.error);
}