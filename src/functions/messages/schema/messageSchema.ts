export default {
  type: "object",
  properties: {
    messageText: { type: 'string'},
    mediaUrls: { type: 'array', items: { type: 'string' }},
    isUpdated: { type: 'boolean'}
  },
  required: ['messageText']
} as const;
