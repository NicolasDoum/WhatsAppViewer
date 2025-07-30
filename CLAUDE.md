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
- **Screenshot Service**: Puppeteer-based automated screenshot generation

### Key Features

1. **Screenshot Mode Only**: The app displays single conversations in a clean WhatsApp interface without sidebars or navigation
2. **Full Media Support**: 
   - Text messages with emoji support
   - Images with optional captions
   - Audio messages with playback controls
3. **Conversation Generator**: Scripts to programmatically create new conversations
4. **Automated Screenshots**: Multiple ways to capture conversations as images

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
  screenshotService.ts # Puppeteer screenshot automation
  screenshotRoutes.ts  # Screenshot API endpoints

/scripts/
  generateConversation.ts # Tool for creating new conversations
  autoScreenshot.ts      # Standalone screenshot with auto server management
  quickScreenshot.ts     # Simple screenshot (requires running server)
  takeScreenshot.ts      # Original screenshot script

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

### Taking Screenshots

There are multiple ways to capture screenshots:

1. **Auto Screenshot** (Recommended):
   ```bash
   npm run auto-screenshot 1
   ```
   - Automatically starts server if needed
   - Takes screenshot
   - Shuts down server when done
   - Works completely standalone

2. **Quick Screenshot** (Server must be running):
   ```bash
   npm run dev  # In one terminal
   npm run quick-screenshot 1  # In another terminal
   ```

3. **API Endpoints**:
   - `POST /api/screenshot/:conversationId` - Generate screenshot
   - `GET /api/screenshot/:conversationId/download` - Download screenshot

Screenshots are saved in iPhone 14 Pro dimensions (393x852 @ 3x) for realistic WhatsApp appearance.

### Audio Files

Audio files should be placed in `/public/audio/` and referenced as `/audio/filename.mp3` in messages.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Run conversation generator
- `npm run generate:demo` - Create demo conversations
- `npm run auto-screenshot <id>` - Take screenshot (auto server management)
- `npm run quick-screenshot <id>` - Take screenshot (requires running server)
- `npm run screenshot <id>` - Legacy screenshot command

## AI Integration

See `AI_JSON_STRUCTURE.md` for the exact JSON format your AI should generate. Key points:
- User ID 5 = Current user (Madeleine)
- Messages need unique IDs and ISO 8601 timestamps
- Place generated JSON in `/data/direct-conversations/{id}.json`

## Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" errors:
```bash
# Find process on port 5173
lsof -i :5173
# Or
sudo lsof -iTCP:5173 -sTCP:LISTEN

# Kill the process
kill -9 <PID>
```

### Screenshot Timeouts
- The service waits for elements with `.bg-whatsapp-light-green` or `.bg-white` classes
- Increase timeouts in `screenshotService.ts` if needed
- Check that conversation JSON files exist and are valid

### Screenshot Dimensions
- Viewport: 600x852 pixels (50% wider than iPhone for better message separation)
- Device scale factor: 2
- Special CSS class `puppeteer-screenshot` removes padding during capture
- Header design: enlarged 50% with avatar (84px), bold name (text-3xl), phone number (text-xl), icons (36px)

### Header Size and Date Visibility Issues
When increasing the header size, dates can get hidden behind it. The issue is caused by:
1. The flex layout with `h-screen` constraining the container height
2. Auto-scroll behavior in ScreenshotMessages scrolling past the first date
3. Insufficient padding at the top of the messages container

To fix:
1. Add `flex-shrink-0` to the header to prevent it from being compressed
2. Disable or adjust the auto-scroll in ScreenshotMessages
3. Add sufficient top padding to the messages container (e.g., `pt-8` for 32px)
4. Remove `overflow-hidden` from the main container if needed
5. The header and messages area work as a flex column where the header takes its natural height and messages fill the remaining space

## Important Notes

- This is a read-only viewer - no message sending or real-time features
- Optimized for screenshots and screen recording
- All conversations are stored as static JSON files
- The default route (`/`) redirects to `/screenshot/1`
- Screenshots capture exactly one screen (no scrolling)
- Header shows only essential elements: avatar, name, and call icons

## WhatsApp Perspective and Sender Logic

When creating conversations, it's crucial to understand the perspective:

- **The screenshot is always from the phone owner's perspective**
- **Header (top bar)**: Shows the OTHER person's profile (name, avatar, phone number)
- **Message alignment**:
  - **Right side (green bubbles)**: Messages SENT by the phone owner (senderId: 5)
  - **Left side (white bubbles)**: Messages RECEIVED from the other person
  
### Example:
If creating a conversation where Laurent chats with Hervé:
- Header shows: Hervé's profile
- Laurent's messages (senderId: 5) appear on the right
- Hervé's messages (senderId: 7) appear on the left
- The first message should typically be from the phone owner (Laurent)

### User IDs:
- User ID 5 = Always the current user/phone owner (shows on right)
- Other user IDs = The person they're chatting with (shows on left)