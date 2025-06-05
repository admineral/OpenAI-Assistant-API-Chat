# Agents SDK Chat

This project demonstrates a minimal chat application using the OpenAI Agents SDK with Next.js.

## Local Development

```bash
npm install
npm run dev
```

## API Routes

- `POST /api/agentsSDKChat` — Send `{ "message": "Hello" }` and receive the agent reply.
- `POST /api/agentsTriage` — Example showing how to hand off between multiple agents.

The old Assistants API implementation was removed in favor of the new Agents SDK.
