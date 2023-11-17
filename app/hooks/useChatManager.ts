// hooks/useChatManager.ts
import { useEffect, Dispatch, SetStateAction } from 'react';
import ChatManager from '../services/ChatManager';

export const useChatManager = (
  setChatMessages: Dispatch<SetStateAction<any[]>>, 
  setStatusMessage: Dispatch<SetStateAction<string>>, 
  setChatManager: Dispatch<SetStateAction<ChatManager | null>>, 
  setIsMessageLoading: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    const chatManagerInstance = ChatManager.getInstance(setChatMessages, setStatusMessage);
    setChatManager(chatManagerInstance);
    setIsMessageLoading(chatManagerInstance.getChatState().isLoading);
  }, [setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading]);
};