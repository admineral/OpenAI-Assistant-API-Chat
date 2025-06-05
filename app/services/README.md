# Services

## ChatManager
A minimal singleton used by the React hooks to keep track of the chat history and send messages via the Agents SDK API routes.

## api.js
Contains `sendAgentMessage(message)` which posts to `/api/agentsSDKChat` and returns the reply.
