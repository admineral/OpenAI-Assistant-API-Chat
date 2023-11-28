// hooks/useChatManager.ts
import { useEffect, Dispatch, SetStateAction } from 'react';
import ChatManager from '../services/ChatManager';

export const useChatManager = (
  setChatMessages: Dispatch<SetStateAction<any[]>>, 
  setStatusMessage: Dispatch<SetStateAction<string>>, 
  setChatManager: Dispatch<SetStateAction<ChatManager | null>>, 
  setIsMessageLoading: Dispatch<SetStateAction<boolean>>,
  setProgress: Dispatch<SetStateAction<number>>,
  setIsLoadingFirstMessage: Dispatch<SetStateAction<boolean>> 
) => {
  useEffect(() => {
    const chatManager = ChatManager.getInstance(setChatMessages, setStatusMessage, setProgress, setIsLoadingFirstMessage); 
    setChatManager(chatManager);
  }, [setChatMessages, setStatusMessage, setProgress, setIsLoadingFirstMessage]);
};