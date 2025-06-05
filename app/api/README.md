# API Routes

This application exposes two example endpoints using the OpenAI Agents SDK.

- **POST `/api/agentsSDKChat`** – Run a simple agent. Send `{ "message": "Hello" }` and receive a reply.
- **POST `/api/agentsTriage`** – Demonstrates handing off between specialized agents. Send `{ "question": "..." }`.

All former Assistants API routes have been removed.
