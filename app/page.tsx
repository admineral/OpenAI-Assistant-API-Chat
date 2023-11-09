"use client";

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
import { useDropzone } from 'react-dropzone';



export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading} = useChat({
  
    onError: (error) => {
      va.track("Chat errored", {
        input,
        error: error.message,
      });
    },
  });

  const disabled = isLoading || input.length === 0;
  const [assistantName, setAssistantName] = useState('');
  const [assistantModel, setAssistantModel] = useState('gpt-4-1106-preview');
  const [assistantDescription, setAssistantDescription] = useState('');
  const [inputmessage, setInputmessage] = useState('Introduce youself');
  const [chatMessages, setChatMessages] = useState<{ role: string; content: any; }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [file, setFile] = useState<File>();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
  };
  



  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Function called -- handleFormSubmit');
  
    // Add the user's message to the chat
    setChatMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: input }
    ]);
    setInput('');
    console.log('Message field cleared -- handleFormSubmit');
  
    // Send a POST request to the backend
    console.log('Send a POST request to the backend -- handleFormSubmit');
  
    const chatData = new FormData();
    if (assistantId) {
      chatData.set('assistantId', assistantId);
    }
    if (threadId) {
      chatData.set('threadId', threadId);
    }
    chatData.set('input', input);

    const chatResponse = await fetch('/api/chat', {
      method: 'POST',
      body: chatData,
    });
  
    const responseData = await chatResponse.json();
  
    console.log('Send a POST request to the backend DONE -- handleFormSubmit ');
  
    if (chatResponse.ok) {
      // Handle successful response
      console.log('Successful response -- handleFormSubmit ');
  
      setChatMessages(prevMessages => [
          ...prevMessages,
          { role: 'assistant', content: responseData.response }
        ]);
  
      console.log('Added "user" and "Assistant" message to the chat -- handleFormSubmit ');
    } else {
      // Handle error
      console.error('Error:', responseData.error);
    }
  };



  async function startAssistant() {
    console.log('Start-Assistant - Name :', assistantName);
    console.log('Start-Assistant - Model:', assistantModel);
    console.log('Start-Assistant - Description:', assistantDescription);
    console.log('Start-Assistant - Initial-Message:', inputmessage);
    
    setIsButtonDisabled(true);
    console.log('Button Disabled (true)  -- startAssistant');

    console.log('Send a POST request to the backend -- startAssistant ');

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    console.log('prep fileData');
    const fileData = new FormData();
    if (file) {
      fileData.set('file', file);
    }

    console.log('calling the UPLOAD API-ROUTE');
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: fileData,
    });
    console.log('calling the UPLOAD API-ROUTE DONEEEE');

    const uploadData = await uploadResponse.json();
    
    // Check if the upload was successful
    if (!uploadResponse.ok) {
      console.error('Upload failed');
      return;
    }

    console.log('Upload successful');

    // Get the file ID from the response
    const fileId = uploadData.fileId;
    console.log('File ID (page):', fileId);
     

    


    const chatData = new FormData();
    chatData.set('assistantName', assistantName);
    chatData.set('assistantModel', assistantModel);
    chatData.set('assistantDescription', assistantDescription);
    chatData.set('inputmessage', inputmessage);
    if (file) {
      chatData.set('file', file);
    }
    chatData.set('fileId', fileId);
    console.log('calling the startChat - API - ROUTE');
    const startChatResponse = await fetch('/api/startChat', {
      method: 'POST',
      body: chatData,
    });
    console.log('CALLED/DONE the startChat - API - ROUTE');
    
    // Log the raw response
    console.log('Raw startChatResponse:', startChatResponse);
    

    if (!startChatResponse.ok) {
      console.error('Error starting chat');
      return;
    }

    console.log('Send a POST request to the backend DONE -- startAssistant ');
  
    const startChatData = await startChatResponse.json();
    console.log('startChatData:', startChatData);
    

    if (startChatResponse.ok) {
      setAssistantId(startChatData.assistantId);
      setThreadId(startChatData.threadId);
      console.log(assistantId);
      console.log(threadId);

      setIsButtonDisabled(false);
      console.log('Button disabled (false) -- startAssistant');

      // Add the first message to the chat
      //setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: inputmessage }]);
      //console.log('Added the first user message to the chat -- startAssistant ');
      
      // Add the assistant's response to your chat messages
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: startChatData.response }]);
      console.log('Added the assistant response to your chat messages -- startAssistant ');
      
      
      setChatStarted(true);
      console.log('setChatStarted (true) -- startAssistant ');
    } else {
      console.error('Error:', startChatData.error);
      setIsButtonDisabled(false);
    }
  }


  

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
        <a
          href="/deploy"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <VercelIcon />
        </a>
        <a
          href="/github"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <GithubIcon />
        </a>
      </div>
      {chatMessages.length > 0 ? (
        chatMessages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black",
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Bot width={20} />
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <h1 className="text-lg font-semibold text-black">
              Welcome to Agent42!
            </h1>
            <form
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                placeholder="Assistant Name"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md"
              />

              <input
                type="text"
                placeholder="Assistant Description"
                value={assistantDescription}
                onChange={(e) => setAssistantDescription(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md"
              />
              <div>
                <button
                  onClick={() => setAssistantModel('gpt-4-1106-preview')}
                  className={`p-2 border border-gray-200 rounded-md ${assistantModel === 'gpt-4-1106-preview' ? 'bg-green-500 text-white' : ''}`}
                >
                  GPT-4
                </button>
                <button
                  onClick={() => setAssistantModel('gpt-3.5-turbo-1106')}
                  className={`p-2 border border-gray-200 rounded-md ${assistantModel === 'gpt-3.5-turbo-1106' ? 'bg-green-500 text-white' : ''}`}
                >
                  GPT-3.5
                </button>
              </div>
              <div 
              className="drop-area border-2 border-dashed border-gray-400 rounded-md p-4 text-center"
              onClick={() => {
                const fileInput = document.getElementById('file-input');
                if (fileInput) {
                  fileInput.click();
                }
              }}
            >
              <input 
                id="file-input"
                type="file" 
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileChange(e.target.files[0]);
                  }
                }} 
                style={{ display: 'none' }} 
              />
              {file ? (
                <>
                  <FontAwesomeIcon icon={faFileUpload} className="text-green-500 mb-2" />
                  <p className="text-gray-700 text-lg font-bold">{file.name}</p>
                  <i className="fas fa-file-upload text-green-500"></i>  
                </>
              ) : (
                <p className="text-gray-500">Select a File</p>
              )}
            </div>
            <button
              type="button"
              onClick={startAssistant}
              disabled={isButtonDisabled}
              className={`p-2 rounded-md ${isButtonDisabled ? 'bg-gray-500 text-gray-300' : 'bg-green-500 text-white'}`}
            >
              Start
            </button>
            </form>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && chatStarted) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled || !chatStarted
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled || !chatStarted}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}