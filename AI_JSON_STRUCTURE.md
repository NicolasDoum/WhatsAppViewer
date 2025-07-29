# WhatsApp Conversation JSON Structure for AI Generation

## Overview
This document defines the JSON structure that your AI should output to generate WhatsApp conversations compatible with the WhatsApp Viewer application.

## Required Structure

### Conversation Object
```json
{
  "id": 1,                              // Unique conversation ID (number)
  "lastMessageAt": "2025-03-06T15:35:41.081Z",  // ISO 8601 timestamp
  "participant": {                      // The other person in the conversation
    "id": 1,                           // Must match a user ID from users.json
    "username": "maxime",              // Username (lowercase)
    "displayName": "Maxime",           // Display name
    "avatar": "https://...",           // Avatar URL
    "lastSeen": "2025-03-05T20:17:25.856Z"  // ISO 8601 timestamp
  },
  "messages": [                        // Array of messages
    // See message types below
  ]
}
```

### Message Types

#### Text Message
```json
{
  "id": 1001,                          // Unique message ID
  "conversationId": 1,                 // Must match conversation ID
  "senderId": 1,                       // User ID (5 = current user/Madeleine)
  "type": "text",                      // Message type
  "content": "Your message here",      // The actual text
  "metadata": {},                      // Empty object for text messages
  "createdAt": "2025-02-20T14:35:41.081Z",  // ISO 8601 timestamp
  "status": "read"                     // "read" or "sent"
}
```

#### Image Message
```json
{
  "id": 1002,
  "conversationId": 1,
  "senderId": 5,
  "type": "image",
  "content": "https://example.com/image.jpg",  // Image URL
  "metadata": {
    "caption": "Optional caption text"         // Can be empty string or omitted
  },
  "createdAt": "2025-02-26T10:58:00.000Z",
  "status": "read"
}
```

#### Audio Message
```json
{
  "id": 1003,
  "conversationId": 1,
  "senderId": 5,
  "type": "audio",
  "content": "/audio/voice-note.mp3",    // Path to audio file in public/audio/
  "metadata": {
    "duration": 30                       // Duration in seconds
  },
  "createdAt": "2025-02-27T09:33:00.000Z",
  "status": "read"
}
```

## Important Notes

1. **User IDs**: 
   - ID 5 = Current user (Madeleine)
   - Other IDs = Conversation participants (from users.json)

2. **Timestamps**: 
   - Use ISO 8601 format
   - Messages should be in chronological order

3. **Status**:
   - Messages from current user (ID 5): usually "sent"
   - Messages from others: usually "read"

4. **File References**:
   - Images: Use full URLs
   - Audio: Use paths like `/audio/filename.mp3` (files must exist in public/audio/)

## Example AI Output

```json
{
  "id": 10,
  "lastMessageAt": "2025-03-07T10:00:00.000Z",
  "participant": {
    "id": 2,
    "username": "peter",
    "displayName": "Peter Drucker",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
    "lastSeen": "2025-03-07T09:50:00.000Z"
  },
  "messages": [
    {
      "id": 10001,
      "conversationId": 10,
      "senderId": 2,
      "type": "text",
      "content": "Management is doing things right; leadership is doing the right things.",
      "metadata": {},
      "createdAt": "2025-03-07T09:00:00.000Z",
      "status": "read"
    },
    {
      "id": 10002,
      "conversationId": 10,
      "senderId": 5,
      "type": "text",
      "content": "That's a great insight, Peter! How do you balance both in practice?",
      "metadata": {},
      "createdAt": "2025-03-07T09:30:00.000Z",
      "status": "sent"
    }
  ]
}
```

## Integration Steps

1. Your AI generates this JSON structure
2. Save it as `{id}.json` in the data/direct-conversations/ folder
3. Access via: `http://localhost:5173/screenshot/{id}`