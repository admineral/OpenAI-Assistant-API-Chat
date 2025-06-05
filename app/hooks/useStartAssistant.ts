import { useEffect } from 'react';
import ChatManager from '../services/ChatManager';

export const useStartAssistant = (
  chatManager: ChatManager | null,
  initialMessage: string,
  setMessages: (msgs: any[]) => void,
) => {
  useEffect(() => {
    if (chatManager && initialMessage) {
      chatManager.sendMessage(initialMessage, setMessages);
    }
  }, [chatManager, initialMessage, setMessages]);
};
