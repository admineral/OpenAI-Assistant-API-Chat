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
      {message.role === "assistant" && message.isLoading ? (
        <>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="w-full flex items-center justify-center text-xs text-green-500">
            {message.statusMessage}
          </div>
        </>
      ) : (
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
      )}
    </div>
  </div>
);

const MessageList = ({ chatMessages, statusMessage, isSending }) => {
  let messages = [...chatMessages];
  const loadingMessageIndex = messages.findIndex(
    (message) => message.role === "assistant" && message.isLoading
  );

  if (isSending) {
    if (loadingMessageIndex !== -1) {
      // If a loading message already exists, update its status message
      messages[loadingMessageIndex].statusMessage = statusMessage;
    } else {
      // If no loading message exists, add a new one
      messages.push({
        role: "assistant",
        isLoading: true,
        statusMessage,
      });
    }
  } else if (loadingMessageIndex !== -1) {
    // If not sending and a loading message exists, remove it
    messages.splice(loadingMessageIndex, 1);
  }

  return (
    <>
      {messages.map((message, i) => (
        <Message key={i} message={message} />
      ))}
    </>
  );
};

export default MessageList;