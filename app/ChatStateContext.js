// ChatStateContext.js
import React from 'react';
import { useChatState } from './hooks/useChatState';

export const ChatStateContext = React.createContext();

export function ChatStateProvider({ children }) {
  const chatState = useChatState();

  return (
    <ChatStateContext.Provider value={chatState}>
      {children}
    </ChatStateContext.Provider>
  );
}