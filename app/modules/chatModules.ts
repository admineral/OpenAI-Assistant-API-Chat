// chatModules.ts

import {
  addMessage,
  listMessages,
  checkRunStatus,
} from '../services/api';

interface StatusData {
  status: string;
}

interface Message {
  role: string;
  content: any;
}

/**
* Submits a user's message to the chat.
* @param {string} input - The user's message.
* @param {string} threadId - The ID of the current chat thread.
* @returns {Promise<void>} - A promise that resolves when the message is successfully added.
*/
export const submitUserMessage = async (input: string, threadId: string, setStatusMessage: (message: string) => void): Promise<void> => {
  setStatusMessage('Submitting user message...');
  const message = { input, threadId };
  await addMessage(message);
  setStatusMessage('User message submitted successfully.');
};


/**
* Fetches the latest messages from the assistant, waiting until the assistant has responded.
* @param {string} runId - The ID of the assistant.
* @param {string} threadId - The ID of the chat thread.
* @returns {Promise<string>} - A promise that resolves to the messages from the assistant.
*/
export const fetchAssistantResponse = async (runId: string, threadId: string, setStatusMessage: (message: string) => void): Promise<string> => {
  setStatusMessage('Fetching assistant response...');
  let status: string;
  do {
      const statusData: StatusData = await checkRunStatus(threadId, runId);
      status = statusData.status;
      setStatusMessage('Waiting for assistant response...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Polling delay
  } while (status !== 'completed');
  setStatusMessage('Assistant response fetched successfully.');
  const response = await listMessages(threadId, runId);
  return response.messages;
};



/**
 * Updates the chat state with new messages.
 * @param {Array} prevMessages - The current messages in the chat state.
 * @param {Array} newMessages - New messages to be added to the chat.
 * @param {Function} setChatMessages - State setter function for chat messages.
 */
export const updateChatState = (prevMessages: Message[], newMessages: Message[], setChatMessages: (messages: any[]) => void): Promise<void> => {
  console.log('updateChatState called with new messages:', newMessages);
  console.log('Current messages:', prevMessages);

  console.log('Updating chat state...');
  const updatedMessages = [...prevMessages, ...newMessages];
  
  return new Promise((resolve) => {
    setChatMessages(updatedMessages);
    console.log('Chat state updated successfully.');
    console.log('Updated messages:', updatedMessages);
    resolve();
  });
};