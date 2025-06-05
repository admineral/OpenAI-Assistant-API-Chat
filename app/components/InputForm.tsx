import Textarea from 'react-textarea-autosize';
import { SendIcon } from '../icons';
import { useContext, useState } from 'react';
import { ChatStateContext } from '../ChatStateContext';

const InputForm: React.FC = () => {
  const { chatManager, chatStarted, setChatMessages } = useContext(ChatStateContext);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatManager || !chatStarted) return;
    const message = input.trim();
    if (!message) return;
    setInput('');
    await chatManager.sendMessage(message, setChatMessages);
  };

  return (
    <div className="fixed bottom-0 flex w-full justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-screen-md">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          className="flex-1 rounded-l-md border p-2"
          disabled={!chatStarted}
        />
        <button
          type="submit"
          className="rounded-r-md bg-green-500 px-4 text-white"
          disabled={!chatStarted}
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default InputForm;
