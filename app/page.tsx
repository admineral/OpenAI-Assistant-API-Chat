"use client";
import { useContext } from 'react';
import { LinkBar, MessageList, WelcomeForm, InputForm } from './components';
import { ChatStateContext, ChatStateProvider } from './ChatStateContext';

function ChatContent() {
  const { chatStarted } = useContext(ChatStateContext);

  return (
    <main className="flex flex-col items-center pb-40 bg-space-grey-light">
      <LinkBar />
      {chatStarted ? (
        <>
          <MessageList />
          <InputForm />
        </>
      ) : (
        <WelcomeForm />
      )}
    </main>
  );
}

export default function Chat() {
  return (
    <ChatStateProvider>
      <ChatContent />
    </ChatStateProvider>
  );
}
