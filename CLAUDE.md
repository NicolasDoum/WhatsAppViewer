# WhatsApp Screenshot Viewer

## Project Goal

This project provides a clean, screenshot-optimized viewer for WhatsApp conversations. It's designed specifically for creating high-quality screenshots and video recordings of WhatsApp-style conversations without any interactive chat features or navigation elements.

The main use cases are:
- Creating realistic WhatsApp conversation screenshots
- Recording videos of conversations with working audio playback
- Generating custom conversations programmatically for demos or presentations

## How It Works

### Architecture

The application is built with:
- **Frontend**: React + TypeScript with Tailwind CSS for WhatsApp-style UI
- **Backend**: Express server serving static conversation files
- **Data**: JSON files storing conversation data in `/data/direct-conversations/`

### Key Features

1. **Screenshot Mode Only**: The app displays single conversations in a clean WhatsApp interface without sidebars or navigation
2. **Full Media Support**: 
   - Text messages with emoji support
   - Images with optional captions
   - Audio messages with playback controls
3. **Conversation Generator**: Scripts to programmatically create new conversations

### File Structure

```
/client/src/
  /components/
    /screenshot/     # Screenshot-specific components
    /chat/          # Shared components (AudioPlayer, MessageBubble)
  /pages/
    Screenshot.tsx   # Main screenshot view page

/server/
  directRoutes.ts   # API routes for serving conversation data
  directConversationLoader.ts # Conversation file loader

/scripts/
  generateConversation.ts # Tool for creating new conversations

/data/
  /direct-conversations/  # JSON files for each conversation
  users.json             # User data
```

### Viewing Conversations

Conversations are accessed via URLs like:
```
http://localhost:5173/screenshot/1
http://localhost:5173/screenshot/2
```

The number corresponds to the conversation ID in the JSON files.

### Creating New Conversations

Use the conversation generator script:

```typescript
import { generateConversation, createTextMessage, createAudioMessage, createImageMessage } from './scripts/generateConversation';

const conversation = {
  id: 20,
  participantId: 2, // User ID from users.json
  messages: [
    createTextMessage(2, "Hello!", new Date()),
    createAudioMessage(5, "/audio/voice.mp3", 30, new Date()),
    createImageMessage(2, "https://example.com/image.jpg", "Caption", new Date())
  ]
};

await generateConversation(conversation);
```

Then run: `npm run generate`

### Audio Files

Audio files should be placed in `/public/audio/` and referenced as `/audio/filename.mp3` in messages.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Run conversation generator
- `npm run generate:demo` - Create demo conversations

## Important Notes

- This is a read-only viewer - no message sending or real-time features
- Optimized for screenshots and screen recording
- All conversations are stored as static JSON files
- The default route (`/`) redirects to `/screenshot/1`