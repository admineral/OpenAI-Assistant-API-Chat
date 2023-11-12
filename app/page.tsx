//app/page.tsx
"use client";

import LinkBar from './components/LinkBar';
import MessageList from './components/MessageList';
import WelcomeForm from './components/WelcomeForm';
import InputForm from './components/InputForm';
import { useRef, useState } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import {
  uploadImageAndGetDescription,
  uploadFile,
  createAssistant,
  createThread,
  runAssistant,
  checkRunStatus,
  listMessages,
  addMessage,
} from './api';

// Chat component that manages the chat interface and interactions
export default function Chat() {
  // Refs for form and input elements
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Custom hook to manage chat state and interactions
  const { input, setInput, isLoading} = useChat({
    // Error handling callback
    onError: (error) => {
      va.track("Chat errored", {
        input,
        error: error.message,
      });
    },
  });

  // Determine if the chat interface should be disabled
  const disabled = isLoading || input.length === 0;

  // State variables for managing various aspects of the chat assistant
  const [assistantName, setAssistantName] = useState('');
  const [assistantModel, setAssistantModel] = useState('gpt-3.5-turbo-1106');
  const [assistantDescription, setAssistantDescription] = useState('');
  const [inputmessage, setInputmessage] = useState('Introduce yourself');
  const [chatMessages, setChatMessages] = useState<{ role: string; content: any; }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [file, setFile] = useState<File>();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isStartLoading, setStartLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  
  
  // Handler for file input changes
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
  };


  const convertFileToBase64 = (file : any) => new Promise((resolve, reject) => {
    console.log('converting image to Base64');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    console.log('image CONVERTED');
  });



  // Handler for form submissions
  const handleFormSubmit = async (e:any) => {
    e.preventDefault();
    console.log('Handling form submission.');
  
    setIsSending(true);
    setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: input }]);
    setInput('');
  
    let data = { input, threadId };
  
    console.log('Sending message to addMessage API endpoint.');
    const addMessageData = await addMessage(data);
    console.log('Message sent to addMessage API endpoint.');
  
    console.log('Invoking runAssistant API endpoint.');
    const runAssistantData = await runAssistant(assistantId, threadId);
    console.log('Received response from runAssistant API endpoint.');
  
    let status = runAssistantData.status;
    while (status !== 'completed') {
      const statusData = await checkRunStatus(threadId, runAssistantData.runId);
      status = statusData.status;
      console.log('Checking assistant response status:', status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  
    console.log('Fetching messages from listMessages API endpoint.');
    const listMessagesData = await listMessages(threadId, runAssistantData.runId);
    console.log('Messages retrieved from listMessages API endpoint.');
    setIsSending(false);
  
    if (listMessagesData.ok) {
      console.log('Adding assistant\'s message to the chat.');
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: listMessagesData.messages }]);
    } else {
      console.error('Error retrieving messages:', listMessagesData.error);
    }
  };


  async function startAssistant() {
    if (!assistantName || !assistantModel || !assistantDescription || !inputmessage) {
      console.error('All fields must be filled');
      return;
    }
    console.log('Initializing chat assistant.');
    setStartLoading(true);
    setIsButtonDisabled(true);
  
    // Preparing file data for upload
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  
    let fileId = null;
    if (file) {
      let fileToUpload = file;
  
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        console.log('Received an image file');
        const base64Image = await convertFileToBase64(file); // Ensure this function is defined elsewhere
  
        console.log('Processing the image to get a text description');
        const descriptionData = await uploadImageAndGetDescription(base64Image);
        const descriptionBlob = new Blob([descriptionData.analysis], { type: 'text/plain' });
        fileToUpload = new File([descriptionBlob], "description.txt");
      }
  
      console.log('Uploading file data.');
      const uploadData = await uploadFile(fileToUpload);
      fileId = uploadData.fileId;
      console.log('File uploaded successfully, ID:', fileId);
    }
  
    console.log('Creating assistant.');
    const assistantData = await createAssistant(assistantName, assistantModel, assistantDescription, fileId);
    const assistantId = assistantData.assistantId;
  
    console.log('Creating thread.');
    const threadData = await createThread(inputmessage);
    const threadId = threadData.threadId;
  
    console.log('Running assistant.');
    const runAssistantData = await runAssistant(assistantId, threadId);
  
    let checkRunStatusData;
    do {
      checkRunStatusData = await checkRunStatus(threadId, runAssistantData.runId);
      console.log('Run status:', checkRunStatusData.status);
  
      if (["cancelled", "cancelling", "failed", "expired"].includes(checkRunStatusData.status)) {
        console.error(`Run stopped due to status: ${checkRunStatusData.status}`);
        return;
      }
  
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (checkRunStatusData.status !== 'completed');
  
    console.log('Getting messages from listMessages.');

    // Log the threadId and runId being used
    console.log('Using threadId:', threadId, 'and runId:', runAssistantData.runId);

    const listMessagesData = await listMessages(threadId, runAssistantData.runId);

    // Log the entire response data
    console.log('Received data from listMessages:', listMessagesData);

    if (listMessagesData.ok) {
      console.log('Message content:', listMessagesData.messages);
      setChatMessages(prevMessages => {
        console.log('Previous messages:', prevMessages);
        console.log('Adding new messages to chat');
        return [...prevMessages, { role: 'assistant', content: listMessagesData.messages }];
      });
      console.log('Setting isButtonDisabled to false');
      setIsButtonDisabled(false);
    } else {
      console.error('Error fetching messages');
    }
  
    setAssistantId(assistantId);
    setThreadId(threadId);
    setChatStarted(true);

    console.log('Chat with assistant started successfully.');
  }

  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      <LinkBar />
      {chatMessages.length > 0 ? (
        <MessageList chatMessages={chatMessages} />
      ) : (
        <WelcomeForm
          assistantName={assistantName}
          setAssistantName={setAssistantName}
          assistantDescription={assistantDescription}
          setAssistantDescription={setAssistantDescription}
          assistantModel={assistantModel}
          setAssistantModel={setAssistantModel}
          file={file}
          handleFileChange={handleFileChange}
          startAssistant={startAssistant}
          isButtonDisabled={isButtonDisabled}
          isStartLoading={isStartLoading}
        />
      )}
      <InputForm
        input={input}
        setInput={setInput}
        handleFormSubmit={handleFormSubmit}
        inputRef={inputRef}
        formRef={formRef}
        disabled={disabled}
        chatStarted={chatStarted}
        isSending={isSending}
      />
    </main>
  );
};