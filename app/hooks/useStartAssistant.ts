// hooks/useStartAssistant.ts
import { useEffect } from 'react';
import ChatManager from '../services/ChatManager';

export const useStartAssistant = (assistantId: string | null, chatManager: ChatManager | null, initialThreadMessage: string) => {
  useEffect(() => {
    if (assistantId && chatManager) {
      console.log('Assistant ID found:', assistantId);
      chatManager.startAssistantWithId(assistantId, initialThreadMessage);
    } else {
      console.warn('Assistant ID not found');
    }
  }, [assistantId, chatManager, initialThreadMessage]);
};