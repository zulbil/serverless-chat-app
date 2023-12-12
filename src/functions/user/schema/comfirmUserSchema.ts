export default {
  type: "object",
  properties: {
    username: { type: 'string'},
    code: { type: 'string' }
  },
  required: ['username','code']
} as const;
