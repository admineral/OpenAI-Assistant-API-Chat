// app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatManager from './services/ChatManager';
import LinkBar from './components/LinkBar';
import MessageList from './components/MessageList';
import WelcomeForm from './components/WelcomeForm';
import InputForm from './components/InputForm';
import { useChatState } from './hooks/useChatState';

export default function Chat() {
  const {
    assistantName, setAssistantName,
    assistantModel, setAssistantModel,
    assistantDescription, setAssistantDescription,
    inputmessage, setInputmessage,
    chatMessages, setChatMessages,
    isButtonDisabled, setIsButtonDisabled,
    file = null, setFile,
    isStartLoading, setStartLoading,
    statusMessage, setStatusMessage,
    isSending, setIsSending,
    inputRef,
    formRef,
    initialThreadMessage, 
    setInitialThreadMessage,
    setChatStarted,
    chatStarted: chatHasStarted,


  } = useChatState();

  // Initialize ChatManager only once using useEffect
// Initialize ChatManager only once using useEffect
const [chatManager, setChatManager] = useState<ChatManager | null>(null);

// Set assistantId from environment variable
const [assistantId, setAssistantId] = useState<string | null>(process.env.REACT_APP_ASSISTANT_ID || '');

// Add a state to track loading status of message sending
const [isMessageLoading, setIsMessageLoading] = useState(false);

  useEffect(() => {
    const chatManagerInstance = ChatManager.getInstance(setChatMessages, setStatusMessage);
    setChatManager(chatManagerInstance);
    // Update isMessageLoading based on the chatManager's isLoading state
    setIsMessageLoading(chatManagerInstance.getChatState().isLoading);
  }, [setChatMessages, setStatusMessage]);

  useEffect(() => {
    if (assistantId && chatManager) {
      console.log('Assistant ID found:', assistantId);
      chatManager.startAssistantWithId(assistantId, initialThreadMessage);
    } else {
      console.warn('Assistant ID not found');
    }
  }, [assistantId, chatManager, initialThreadMessage]);


  const startChatAssistant = async () => {
    setIsButtonDisabled(true);
    setStartLoading(true);
    if (chatManager) {
      try {
        await chatManager.startAssistant({ assistantName, assistantModel, assistantDescription }, file, initialThreadMessage);
        console.log('Assistant started:', chatManager.getChatState());
        setChatStarted(true);
      } catch (error) {
        console.error('Error starting assistant:', error);
        if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
      } finally {
        setIsButtonDisabled(false);
        setStartLoading(false);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // If a message is being sent, return immediately
    if (isSending) {
      return;
    }
    // Save the message
    const message = inputmessage;
    // Clear the input
    setInputmessage('');
    // Disable sending
    setIsSending(true);
    if (chatManager) {
      try {
        await chatManager.sendMessage(message);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        // Enable sending
        setIsSending(false);
      }
    }
  };
  const handleFileChange = (selectedFile: File) => setFile(selectedFile);

  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      <LinkBar />
      {chatHasStarted || assistantId ? (
        <MessageList chatMessages={chatMessages} />
      ) : (
        <WelcomeForm {...{assistantName, setAssistantName, assistantDescription, setAssistantDescription, assistantModel, setAssistantModel, file, handleFileChange, startChatAssistant, isButtonDisabled, isStartLoading, statusMessage}} />
      )}
      <InputForm {...{input: inputmessage, setInput: setInputmessage, handleFormSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading}} />
    </main>
  );
}
