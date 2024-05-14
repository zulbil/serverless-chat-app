export default {
  type: "object",
  properties: {
    participants: { type: 'string'},
    createdAt: { type: 'string' },
    lastMessage: { type: 'string' },
    lastMessageTimestamp: { type: 'string' },
    chatStatus: { type: 'string' }
  },
  required: ['participants', 'createdAt', 'chatStatus', 'lastMessage', 'lastMessageTimestamp']
} as const;
