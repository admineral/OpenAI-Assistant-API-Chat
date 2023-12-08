// useChatState.ts
import { useState, useRef,useEffect } from 'react';
import ChatManager from '../services/ChatManager';
import { useChatManager } from './useChatManager';
import { useStartAssistant } from './useStartAssistant';



type FileDetail = {
  name: string;
  type: string;
  size: number;
};

export const useChatState = () => {
  
  
  const [assistantName, setAssistantName] = useState('');
  const [assistantModel, setAssistantModel] = useState('gpt-3.5-turbo-1106');
  const [assistantDescription, setAssistantDescription] = useState('');
  const [inputmessage, setInputmessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; content: any; }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isStartLoading, setStartLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [initialThreadMessage, setInitialThreadMessage] = useState('You are a Pirate! introduce yourself');
  const [statusMessage, setStatusMessage] = useState('');
  const counter = useRef(0);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [chatManager, setChatManager] = useState<ChatManager | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(process.env.REACT_APP_ASSISTANT_ID || '');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoadingFirstMessage, setIsLoadingFirstMessage] = useState(false);
  const [chatUploadedFiles, setChatUploadedFiles] = useState<File[]>([]);
  const [chatFileDetails, setChatFileDetails] = useState<FileDetail[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]); 
  const [input, setInput] = useState('');
  // Initialize chatManager
  useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);

  // Start assistant when assistantId and chatManager are available
  useStartAssistant(assistantId, chatManager, initialThreadMessage);
    // Define startChatAssistant function
    const startChatAssistant = async () => {
      setIsButtonDisabled(true);
      setStartLoading(true);
      if (chatManager) {
        try {
          console.log('assistantName before startAssistant:', assistantName);
          const assistantDetails = {
            name: assistantName,
            model: assistantModel,
            description: assistantDescription
          };
          console.log('assistantDetails before startAssistant:', assistantDetails);
          const fileIdsFromState = fileIds;
          const initialMessage = initialThreadMessage;
          await chatManager.startAssistant(assistantDetails, fileIdsFromState, initialMessage);
          setChatStarted(true); // Set chatHasStarted to true
        } catch (error) {
          console.error('Error starting assistant:', error);
          if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
        } finally {
          setIsButtonDisabled(false);
          setStartLoading(false);
        }
      }
    };
      // Log the assistantName whenever it changes
  useEffect(() => {
    console.log('assistantName in useChatState:', assistantName);
  }, [assistantName]);


  return {
    assistantName, setAssistantName,
    assistantModel, setAssistantModel,
    assistantDescription, setAssistantDescription,
    inputmessage, setInputmessage,
    chatMessages, setChatMessages,
    chatStarted, setChatStarted,
    isButtonDisabled, setIsButtonDisabled,
    files, setFiles,
    assistantId, setAssistantId,
    threadId, setThreadId,
    isStartLoading, setStartLoading,
    isSending, setIsSending,
    statusMessage, setStatusMessage,
    counter,
    inputRef,
    formRef,
    initialThreadMessage, 
    setInitialThreadMessage,
    chatManager, setChatManager,
    isMessageLoading, setIsMessageLoading,
    progress, setProgress,
    isLoadingFirstMessage, setIsLoadingFirstMessage,
    chatUploadedFiles, setChatUploadedFiles,
    chatFileDetails, setChatFileDetails,
    fileIds, setFileIds,
    input, setInput,
    startChatAssistant,
    

  };
};