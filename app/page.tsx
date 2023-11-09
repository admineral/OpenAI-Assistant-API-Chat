"use client";

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
  const [inputmessage, setInputmessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; content: any; }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [file, setFile] = useState<File>();

  


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
  
    // Create a FormData object
    const data = new FormData();
    // Append the input message to it
    data.set('input', input);
    // Append the inputmessage to it
    data.set('inputmessage', inputmessage);
  
    // Call the chat API instead of the upload API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: data,
    });
  
    const responseData = await response.json();
  
    console.log('Send a POST request to the backend DONE -- handleFormSubmit ');
  
    if (response.ok) {
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

    console.log('File-ID: ', fileId);


    const chatData = new FormData();
    chatData.set('assistantName', assistantName);
    chatData.set('assistantModel', assistantModel);
    chatData.set('assistantDescription', assistantDescription);
    chatData.set('inputmessage', inputmessage);
    chatData.set('input', input);
    if (fileId) {
      chatData.set('fileId', fileId);
    }

    const chatResponse = await fetch('/api/chat', {
      method: 'POST',
      body: chatData,
    }).catch(error => {
      console.error('Fetch error:', error);
      return null; // return null instead of undefined
    });
    if (!chatResponse) {
      console.error('No response received');
      return;
    }

    console.log('Send a POST request to the backend DONE -- startAssistant ');
  
    const data = await chatResponse.json();
  
    if (chatResponse.ok) {
      setIsButtonDisabled(false);
      console.log('Button disabled (false) -- startAssistant');

      // Add the first message to the chat
      setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: inputmessage }]);
      console.log('Added the first user message to the chat -- startAssistant ');
      
      // Add the assistant's response to your chat messages
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
      console.log('Added the assistant response to your chat messages -- startAssistant ');
      
      
      setChatStarted(true);
      console.log('setChatStarted (true) -- startAssistant ');
    } else {
      console.error('Error:', data.error);
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
              Welcome to Agentus!
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
              <select
                value={assistantModel}
                onChange={(e) => setAssistantModel(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md"
              >
                <option value="gpt-4-1106-preview">GPT-4</option>
                <option value="gpt-3.5-turbo-1106">GPT-3.5</option>
              </select>
              <input
                type="text"
                placeholder="Assistant Description"
                value={assistantDescription}
                onChange={(e) => setAssistantDescription(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md"
              />
              <input
                type="text"
                placeholder="Message"
                value={inputmessage}
                onChange={(e) => setInputmessage(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md"
              />
            <input
                type="file"
                id="file-input"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="p-2 border border-gray-200 rounded-md"
              />
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
              if (e.key === "Enter" && !e.shiftKey) {
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
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
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