import { useState, useRef } from 'react';
import ChatManager from '../services/ChatManager';
import { useChatManager } from './useChatManager';
import { useStartAssistant } from './useStartAssistant';

export const useChatState = () => {
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatManager, setChatManager] = useState<ChatManager | null>(null);
  const [input, setInput] = useState('');

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useChatManager(setChatMessages, setChatManager);

  const startChatAssistant = () => {
    setChatStarted(true);
    useStartAssistant(chatManager, 'Hello!', setChatMessages);
  };

  return {
    chatMessages,
    setChatMessages,
    chatStarted,
    setChatStarted,
    chatManager,
    input,
    setInput,
    inputRef,
    formRef,
    startChatAssistant,
  };
};
