# How to Add New Conversations

To add a new conversation, create a JSON file in this directory with the following format:

```json
{
  "participants": [
    { "userId": 1 },  // Replace with the IDs of the users in the conversation
    { "userId": 5 }
  ],
  "messages": [
    {
      "senderId": 1,  // User ID of the message sender
      "type": "text", // Can be "text", "image", or "audio"
      "content": "Hello! This is a new message.", // The message content
      "status": "read" // Can be "sent", "delivered", or "read"
    },
    {
      "senderId": 5,
      "type": "text",
      "content": "This is my reply!",
      "status": "read"
    }
  ]
}
```

## Available User IDs:

1 - Fabian Hernandez
2 - Peter Drucker  
3 - Madeleine Lee
4 - Nicolas Martin
5 - Current User (You)

## How It Works:

1. Save a JSON file with the format above in this directory
2. The system will automatically detect the file and create a new conversation
3. After processing, the file will be moved to a "processed" subdirectory
4. Refresh your browser to see the new conversation in the chat app

## Example Types:

### Text Message
```json
{
  "senderId": 1,
  "type": "text",
  "content": "Hello, this is a text message",
  "status": "read"
}
```

### Image Message
```json
{
  "senderId": 2,
  "type": "image",
  "content": "https://example.com/image.jpg",
  "status": "delivered"
}
```

### Audio Message
```json
{
  "senderId": 3,
  "type": "audio",
  "content": "https://example.com/audio.mp3",
  "metadata": {
    "duration": 15 // Duration in seconds
  },
  "status": "sent"
}
```