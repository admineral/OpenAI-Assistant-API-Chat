// app/page.tsx

"use client";

import { LinkBar, MessageList, WelcomeForm, InputForm } from './components';
import { useChatState, useChatManager, useStartAssistant } from './hooks';

export default function Chat() {
  const {
    assistantName, setAssistantName,
    assistantModel, setAssistantModel,
    assistantDescription, setAssistantDescription,
    inputmessage, setInputmessage,
    chatMessages, setChatMessages,
    isButtonDisabled, setIsButtonDisabled,
    files = [], setFiles,
    isStartLoading, setStartLoading,
    statusMessage, setStatusMessage,
    isSending, setIsSending,
    inputRef,
    formRef,
    initialThreadMessage, 
    setInitialThreadMessage,
    setChatStarted,
    chatStarted: chatHasStarted,
    chatManager, setChatManager,
    assistantId,
    isMessageLoading, setIsMessageLoading,
    progress, setProgress, 
    isLoadingFirstMessage,
    setIsLoadingFirstMessage,
    chatUploadedFiles = [], setChatUploadedFiles,
    chatFileDetails, setChatFileDetails,
    fileIds, setFileIds,
  } = useChatState();

  useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);
  useStartAssistant(assistantId, chatManager, initialThreadMessage);

  const startChatAssistant = async () => {
    setIsButtonDisabled(true);
    setStartLoading(true);
    if (chatManager) {
      try {
        console.log('Starting assistant with the following parameters:');
        console.log('Assistant Name:', assistantName);
        console.log('Assistant Model:', assistantModel);
        console.log('Assistant Description:', assistantDescription);
        console.log('File IDs:', fileIds);
        console.log('Initial Thread Message:', initialThreadMessage);
  
        await chatManager.startAssistant({ assistantName, assistantModel, assistantDescription }, fileIds, initialThreadMessage);
        
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

  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      <LinkBar />
      {chatHasStarted || assistantId || isLoadingFirstMessage  ? (
        <MessageList chatMessages={chatMessages} statusMessage={statusMessage} isSending={isSending} progress={progress} isFirstMessage={isLoadingFirstMessage} fileDetails={chatFileDetails} />
      ) : (
        <WelcomeForm {...{assistantName, setAssistantName, assistantDescription, setAssistantDescription, assistantModel, setAssistantModel, startChatAssistant, isButtonDisabled, isStartLoading, statusMessage, fileIds, setFileIds}} />
      )}
      <InputForm {...{input: inputmessage, setInput: setInputmessage, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading, chatUploadedFiles, setChatUploadedFiles, chatFileDetails, setChatFileDetails, chatManager, setChatStarted, setChatMessages, setStatusMessage, setIsSending, setProgress, setIsLoadingFirstMessage}} />
    </main>
  );
}