// app/page.tsx

"use client";

import { useContext } from 'react';
import { LinkBar, MessageList, WelcomeForm, InputForm } from './components';
import { ChatStateContext, ChatStateProvider } from './ChatStateContext';

function ChatContent() {
  const { chatStarted, assistantId, isLoadingFirstMessage } = useContext(ChatStateContext);

  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      <LinkBar />
      {chatStarted || assistantId || isLoadingFirstMessage ? (
        <>
          <MessageList />
          <InputForm />
        </>
      ) : (
        <>
          <WelcomeForm />
          <InputForm />
        </>
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