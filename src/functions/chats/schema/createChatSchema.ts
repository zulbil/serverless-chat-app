export default {
  type: "object",
  properties: {
    participants: { type: "array", items: { type: "string" } }
  },
  required: ['participants']
} as const;
