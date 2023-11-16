import clsx from 'clsx';
import Textarea from 'react-textarea-autosize';
import { SendIcon, LoadingCircle } from '../icons'; 

const InputForm = ({ input, setInput, handleFormSubmit, inputRef, formRef, disabled, chatStarted, isSending, isLoading }) => {
  return (
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
          disabled={disabled}
        />
        <button
          className={clsx(
            "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
            disabled || !chatStarted || input.trim().length === 0 || isSending
              ? "cursor-not-allowed bg-white"
              : "bg-green-500 hover:bg-green-600",
          )}
          disabled={disabled || !chatStarted || isLoading || isSending}
        >
          {isSending ? (
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
  );
};

export default InputForm;
