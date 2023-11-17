import clsx from "clsx";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Message component to display individual messages
// It receives a message object and a progress value as props
const Message = ({ message, progress }) => {
  return (
    <div
      // Apply different background colors based on the role of the message
      className={clsx(
        "flex w-full items-center justify-center border-b border-gray-200 py-8",
        message.role === "user" ? "bg-white" : "bg-gray-100"
      )}
    >
      <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
        <div
          // Apply different background colors based on the role of the message
          className={clsx(
            "p-1.5 text-white",
            message.role === "assistant" ? "bg-green-500" : "bg-black"
          )}
        >
          {/* Display different icons based on the role of the message */}
          {message.role === "user" ? <User width={20} /> : <Bot width={20} />}
        </div>
        {/* If the message is from the assistant and is loading, display a progress bar */}
        {message.role === "assistant" && message.isLoading ? (
          <>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              {/* The width of the progress bar is controlled by the progress prop */}
              <div className="h-full bg-green-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="w-full flex items-center justify-center text-xs text-green-500">
              {message.statusMessage}
            </div>
          </>
        ) : (
          // If the message is not loading, display its content
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
};

// MessageList component to display a list of messages
// It receives an array of chat messages, a status message, a boolean indicating if a message is being sent, and a progress value as props
const MessageList = ({ chatMessages, statusMessage, isSending, progress }) => {
  
  let messages = [...chatMessages];
  // Find the index of the loading message
  const loadingMessageIndex = messages.findIndex(
    (message) => message.role === "assistant" && message.isLoading
  );

  // If a message is being sent
  if (isSending) {
    // If a loading message already exists, update its status message
    if (loadingMessageIndex !== -1) {
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
        // Pass the progress prop to the Message component
        <Message key={i} message={message} progress={progress} />
      ))}
    </>
  );
};

export default MessageList;
