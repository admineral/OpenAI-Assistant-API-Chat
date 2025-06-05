import React, { useContext } from 'react';
import { ChatStateContext } from '../ChatStateContext';

const WelcomeForm: React.FC = () => {
  const { startChatAssistant, chatStarted } = useContext(ChatStateContext);

  return (
    <div className="mt-20 flex justify-center">
      {!chatStarted && (
        <button
          onClick={startChatAssistant}
          className="rounded-md bg-green-500 px-4 py-2 text-white"
        >
          Start Chat
        </button>
      )}
    </div>
  );
};

export default WelcomeForm;
