export default {
  type: "object",
  properties: {
    username: { type: 'string'},
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
} as const;
