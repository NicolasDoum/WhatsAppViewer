import fs from 'fs/promises';
import path from 'path';

async function createDemoConversation() {
  const conversation = {
    id: 10,
    lastMessageAt: new Date('2025-03-15T09:13:00'),
    participant: {
      id: 3,
      username: "peter",
      displayName: "AI Assistant",
      avatar: "https://i.ibb.co/vCcBv66D/Fabienport.png",
      lastSeen: new Date('2025-03-15T09:15:00')
    },
    messages: [
      {
        id: 10001,
        conversationId: 10,
        senderId: 5,
        type: "text",
        content: "Hey AI, can you help me plan a trip to Japan?",
        metadata: {},
        createdAt: new Date('2025-03-15T09:00:00'),
        status: "read"
      },
      {
        id: 10002,
        conversationId: 10,
        senderId: 3,
        type: "text",
        content: "Of course! I'd be happy to help you plan your trip to Japan. When are you thinking of going, and what are your main interests?",
        metadata: {},
        createdAt: new Date('2025-03-15T09:01:00'),
        status: "read"
      },
      {
        id: 10003,
        conversationId: 10,
        senderId: 5,
        type: "text",
        content: "I'm thinking April for the cherry blossoms. I love food, culture, and technology!",
        metadata: {},
        createdAt: new Date('2025-03-15T09:02:00'),
        status: "read"
      },
      {
        id: 10004,
        conversationId: 10,
        senderId: 3,
        type: "text",
        content: "April is perfect for cherry blossoms! 🌸 Here's what I recommend:\n\n📍 Tokyo (4-5 days)\n• Shibuya & Harajuku for tech and youth culture\n• Tsukiji for amazing food\n• Ueno Park for cherry blossoms\n\n📍 Kyoto (3 days)\n• Traditional temples and gardens\n• Philosopher's Path during sakura season\n• Kaiseki dining experience\n\n📍 Osaka (2 days)\n• Street food paradise\n• Dotonbori district\n• Day trip to Nara for deer park",
        metadata: {},
        createdAt: new Date('2025-03-15T09:04:00'),
        status: "read"
      },
      {
        id: 10005,
        conversationId: 10,
        senderId: 3,
        type: "image",
        content: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
        metadata: {
          caption: "Mount Fuji during cherry blossom season - absolutely breathtaking!"
        },
        createdAt: new Date('2025-03-15T09:06:00'),
        status: "read"
      },
      {
        id: 10006,
        conversationId: 10,
        senderId: 5,
        type: "text",
        content: "This looks amazing! What about accommodation?",
        metadata: {},
        createdAt: new Date('2025-03-15T09:07:00'),
        status: "read"
      },
      {
        id: 10007,
        conversationId: 10,
        senderId: 3,
        type: "text",
        content: "For accommodation, I suggest mixing it up:\n\n🏨 Tokyo: Modern hotel in Shinjuku for convenience\n🏯 Kyoto: Traditional ryokan with onsen\n🏠 Osaka: Capsule hotel for the experience!\n\nBudget: ~$100-150/night for good options",
        metadata: {},
        createdAt: new Date('2025-03-15T09:09:00'),
        status: "read"
      },
      {
        id: 10008,
        conversationId: 10,
        senderId: 5,
        type: "audio",
        content: "/audio/MessageJulie.mp3",
        metadata: {
          duration: 8
        },
        createdAt: new Date('2025-03-15T09:11:00'),
        status: "read"
      },
      {
        id: 10009,
        conversationId: 10,
        senderId: 3,
        type: "text",
        content: "Great questions in your voice message! Yes, JR Pass is definitely worth it for Tokyo-Kyoto-Osaka. Book it before arriving for better rates. For language, download Google Translate offline - most signs have English but it helps with menus!",
        metadata: {},
        createdAt: new Date('2025-03-15T09:13:00'),
        status: "sent"
      }
    ]
  };

  const outputPath = path.join(process.cwd(), 'data', 'direct-conversations', '10.json');
  await fs.writeFile(outputPath, JSON.stringify(conversation, null, 2));
  
  console.log('✅ Demo conversation created!');
  console.log('📸 View at: http://localhost:5173/screenshot/10');
}

createDemoConversation().catch(console.error);