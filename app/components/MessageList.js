import React, { useContext } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatStateContext } from '../ChatStateContext';

const MessageList = () => {
  const { chatMessages } = useContext(ChatStateContext);

  return (
    <div className="mt-4 w-full flex flex-col items-center space-y-4">
      {chatMessages.map((m, i) => (
        <div key={i} className="flex w-full max-w-screen-md space-x-2">
          <div className={m.role === 'assistant' ? 'text-green-500' : 'text-black'}>
            {m.role === 'assistant' ? <Bot /> : <User />}
          </div>
          <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
