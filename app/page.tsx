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
    inputRef,
    formRef
  } = useChatState();

  // Initialize ChatManager only once using useEffect
  const [chatManager, setChatManager] = useState<ChatManager | null>(null);
  
  useEffect(() => {
    const manager = ChatManager.getInstance(setChatMessages);
    setChatManager(manager);
  }, [setChatMessages]);

  // Update chat state and handle assistant response reception


  const startAssistant = async () => {
    setIsButtonDisabled(true);
    setStartLoading(true);
    if (chatManager) {
      try {
        await chatManager.startAssistant({ assistantName, assistantModel, assistantDescription }, file, inputmessage);
        console.log('Assistant started:', chatManager.getChatState());
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
    if (chatManager) {
      try {
        await chatManager.sendMessage(inputmessage);
        setInputmessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileChange = (selectedFile: File) => setFile(selectedFile);

  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      <LinkBar />
      {chatMessages.length > 0 ? (
        <MessageList chatMessages={chatMessages} />
      ) : (
        <WelcomeForm {...{assistantName, setAssistantName, assistantDescription, setAssistantDescription, assistantModel, setAssistantModel, file, handleFileChange, startAssistant, isButtonDisabled, isStartLoading, statusMessage}} />
      )}
      <InputForm {...{input: inputmessage, setInput: setInputmessage, handleFormSubmit, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending: isStartLoading}} />
    </main>
  );
}
