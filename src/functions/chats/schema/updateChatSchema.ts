export default {
  type: "object",
  properties: {
    lastMessage: { type: 'string' },
    lastMessageTimestamp: { type: 'string' },
    chatStatus: { type: 'string' }
  },
  required: []
} as const;
