# WhatsApp Screenshot Generator Guide

## Overview
This project now includes a screenshot-optimized view for generating WhatsApp-style conversation screenshots.

## Features Added
1. **Screenshot View** - Clean WhatsApp interface without sidebar or input field
2. **Conversation Generator** - Programmatically create conversations
3. **Demo Conversations** - Sample conversations with various message types

## How to Use

### 1. Start the Development Server
```bash
npm run dev
```

### 2. View Screenshot Mode
Visit any conversation in screenshot mode:
```
http://localhost:5173/screenshot/[conversation-id]
```

Example:
```
http://localhost:5173/screenshot/10
```

### 3. Generate New Conversations

#### Quick Demo
A demo conversation has been created at ID 10:
```bash
node scripts/quickDemo.ts
```

#### Custom Conversations
Use the conversation generator API:
```typescript
import { generateConversation, createTextMessage } from './scripts/generateConversation';

const conversation = {
  id: 30,
  participantId: 2, // User ID from users.json
  messages: [
    createTextMessage(2, "Hello!", new Date()),
    createTextMessage(5, "Hi there!", new Date())
  ]
};

await generateConversation(conversation);
```

## Message Types Supported
- **Text Messages** - Regular text with emoji support
- **Images** - With optional captions
- **Audio** - Voice messages with duration

## Screenshot Tips
1. The view is optimized for 800px width (desktop) and 375px (mobile)
2. Messages auto-scroll to the bottom
3. Date dividers appear between different days
4. Clean WhatsApp styling with proper colors and spacing

## Next Steps
- Add AI integration for automatic conversation generation
- Implement browser-based screenshot capture
- Create conversation templates
- Add sharing functionality