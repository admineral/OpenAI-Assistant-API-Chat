import { useEffect, Dispatch, SetStateAction } from 'react';
import ChatManager from '../services/ChatManager';

export const useChatManager = (
  setChatMessages: Dispatch<SetStateAction<any[]>>,
  setChatManager: Dispatch<SetStateAction<ChatManager | null>>,
) => {
  useEffect(() => {
    const manager = ChatManager.getInstance();
    setChatManager(manager);
    setChatMessages(manager.getMessages());
  }, [setChatMessages, setChatManager]);
};
