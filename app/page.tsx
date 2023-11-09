//app/page.tsx
"use client";

import LinkBar from './components/LinkBar';
import MessageList from './components/MessageList';
import WelcomeForm from './components/WelcomeForm';
import InputForm from './components/InputForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import clsx from "clsx";
import { VercelIcon, GithubIcon, LoadingCircle, SendIcon } from "./icons";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";

interface Message {
  content: string;
  // other properties...
}


// Chat component that manages the chat interface and interactions
export default function Chat() {
  // Refs for form and input elements
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Custom hook to manage chat state and interactions
  const { messages, input, setInput, handleSubmit, isLoading} = useChat({
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
  const [assistantModel, setAssistantModel] = useState('gpt-4-1106-preview');
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

  // Handler for form submissions
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Handling form submission.');
    
    setIsSending(true);
    // Update chat messages with user input
    setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: input }]);
    setInput('');
    console.log('User message added to chat.');

    // Preparing data for API calls
    let formData = new FormData();
    if (threadId) {
      formData.append('threadId', threadId);
    }
    formData.append('input', input);

    // Call the addMessage API route
    console.log('Sending message to addMessage API endpoint.');
    const addMessageResponse = await fetch('/api/addMessage', {
      method: 'POST',
      body: formData
    });
    const addMessageData = await addMessageResponse.json();
    console.log('Message sent to addMessage API endpoint.');

    // Call the runAssistant API route
    console.log('Invoking runAssistant API endpoint.');
    let formData_run = new FormData();
    if (assistantId) {
      formData_run.append('assistantId', assistantId);
    }
    if (threadId) {
      formData_run.append('threadId', threadId);
    }
    const runAssistantResponse = await fetch('/api/runAssistant', {
      method: 'POST',
      body: formData_run
    });
    const runAssistantData = await runAssistantResponse.json();
    console.log('Received response from runAssistant API endpoint.');

    // Checking the status of the assistant's response
    let status = runAssistantData.status;
    let formData_checkStatus = new FormData();
    if (threadId) {
      formData_checkStatus.append('threadId', threadId);
    }
    if (runAssistantData.runId) {
      formData_checkStatus.append('runId', runAssistantData.runId);
    }

    while (status !== 'completed') {
      const statusResponse = await fetch('/api/checkRunStatus', {
        method: 'POST',
        body: formData_checkStatus
      });
      const statusData = await statusResponse.json();
      status = statusData.status;

      console.log('Checking assistant response status:', status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('Assistant response processing completed.');

    // Retrieve messages from the assistant
    console.log('Fetching messages from listMessages API endpoint.');
    let formData_listMessage = new FormData();
    if (threadId) {
      formData_listMessage.append('threadId', threadId);
    }

    const listMessagesResponse = await fetch('/api/listMessages', {
      method: 'POST',
      body: formData_listMessage
    });
    const listMessagesData = await listMessagesResponse.json();
    console.log('Messages retrieved from listMessages API endpoint.');
    setIsSending(false);

    // Add the assistant's response to the chat
    if (listMessagesResponse.ok) {
      if (listMessagesData.messages) {
        console.log('Adding assistant\'s message to the chat.');
        setChatMessages(prevMessages => [
          ...prevMessages,
          { role: 'assistant', content: listMessagesData.messages }
        ]);
      } else {
        console.error('No messages received from the assistant.');
      }
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
      // Uploading file data
      console.log('Uploading file data.');
      const fileData = new FormData();
      fileData.set('file', file);
  
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: fileData,
      });
      const uploadData = await uploadResponse.json();
  
      if (!uploadResponse.ok) {
        console.error('File upload failed:', uploadData.message);
        return;
      }
      fileId = uploadData.fileId;
      console.log('File uploaded successfully, ID:', fileId);
    }
  
    // Create assistant
    console.log('Creating assistant.');
    const assistantData = new FormData();
    assistantData.set('assistantName', assistantName);
    assistantData.set('assistantModel', assistantModel);
    assistantData.set('assistantDescription', assistantDescription);
    if (fileId) {
      assistantData.set('fileId', fileId);
    }
  
    const createAssistantResponse = await fetch('/api/createAssistant', {
      method: 'POST',
      body: assistantData,
    });
    const createAssistantData = await createAssistantResponse.json();
  
    if (!createAssistantResponse.ok) {
      console.error('Error creating assistant:', createAssistantData.error);
      return;
    }
    const assistantId = createAssistantData.assistantId;
  
    // Create thread
    console.log('Creating thread.');
    const threadData = new FormData();
    threadData.set('inputmessage', inputmessage);
  
    const createThreadResponse = await fetch('/api/createThread', {
      method: 'POST',
      body: threadData,
    });
    const createThreadData = await createThreadResponse.json();
  
    if (!createThreadResponse.ok) {
      console.error('Error creating thread:', createThreadData.error);
      return;
    }
    const threadId = createThreadData.threadId;
  
    // Run assistant
    console.log('Running assistant.');
    const runAssistantData = new FormData();
    runAssistantData.set('assistantId', assistantId);
    runAssistantData.set('threadId', threadId);
  
    const runAssistantResponse = await fetch('/api/runAssistant', {
      method: 'POST',
      body: runAssistantData,
    });
    const runAssistantDataResponse = await runAssistantResponse.json();
  
    if (!runAssistantResponse.ok) {
      console.error('Error running assistant:', runAssistantDataResponse.error);
      return;
    }
  
    // Check run status
    let formData_checkRunStatus = new FormData();
    formData_checkRunStatus.append('threadId', threadId);
    formData_checkRunStatus.append('runId', runAssistantDataResponse.runId);
    
    let checkRunStatusData;
    do {
      const checkRunStatusResponse = await fetch('/api/checkRunStatus', {
        method: 'POST',
        body: formData_checkRunStatus,
      });
      checkRunStatusData = await checkRunStatusResponse.json();
    
      console.log('Run status:', checkRunStatusData.status); // Log the status each time
    
      // Return if the run appears dead
      if (
        checkRunStatusData.status === "cancelled" ||
        checkRunStatusData.status === "cancelling" ||
        checkRunStatusData.status === "failed" ||
        checkRunStatusData.status === "expired"
      ) {
        console.error(`Run stopped due to status: ${checkRunStatusData.status}`);
        return;
      }
    
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
    } while (checkRunStatusData.status !== 'completed');
    
    // After the run has completed
    console.log('Get Messages from listMessages.');
    const listMessagesResponse = await fetch('/api/listMessages', {
      method: 'POST',
      body: formData_checkRunStatus,
    });
    const listMessagesData = await listMessagesResponse.json();
    console.log('Messages retrieved from listMessages API endpoint.');

    if (listMessagesResponse.ok) {
      // Log the content of the message
      console.log('Message content:', listMessagesData.messages);

      // Add the message to the chat
      console.log('Adding assistant\'s message to the chat.');
      setChatMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: listMessagesData.messages }
      ]);
    setIsButtonDisabled(false);
    } else {
      console.error('Error fetching messages');
    }
  
    setAssistantId(assistantId);
    setThreadId(threadId);
    setChatStarted(true);
    //setIsButtonDisabled(false);
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