// hooks/useChatManager.ts
import { useEffect, Dispatch, SetStateAction } from 'react';
import ChatManager from '../services/ChatManager';

export const useChatManager = (
  setChatMessages: Dispatch<SetStateAction<any[]>>, 
  setStatusMessage: Dispatch<SetStateAction<string>>, 
  setChatManager: Dispatch<SetStateAction<ChatManager | null>>, 
  setIsMessageLoading: Dispatch<SetStateAction<boolean>>,
  setProgress: Dispatch<SetStateAction<number>> // Add this line
) => {
  useEffect(() => {
    const chatManagerInstance = ChatManager.getInstance(setChatMessages, setStatusMessage, setProgress); // Pass setProgress here
    setChatManager(chatManagerInstance);
    setIsMessageLoading(chatManagerInstance.getChatState().isLoading);
  }, [setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress]); // Add setProgress here
};