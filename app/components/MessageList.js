import clsx from "clsx";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Message = ({ message }) => (
  <div
    className={clsx(
      "flex w-full items-center justify-center border-b border-gray-200 py-8",
      message.role === "user" ? "bg-white" : "bg-gray-100"
    )}
  >
    <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
      <div
        className={clsx(
          "p-1.5 text-white",
          message.role === "assistant" ? "bg-green-500" : "bg-black"
        )}
      >
        {message.role === "user" ? <User width={20} /> : <Bot width={20} />}
      </div>
      <ReactMarkdown
        className="prose mt-1 w-full break-words prose-p:leading-relaxed"
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  </div>
);

const MessageList = ({ chatMessages }) => (
  <>
    {chatMessages.map((message, i) => (
      <Message key={i} message={message} />
    ))}
  </>
);

export default MessageList;
