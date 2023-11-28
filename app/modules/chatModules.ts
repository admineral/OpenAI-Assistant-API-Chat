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
* @param {string[]} fileIds - The IDs of the files to be attached to the message.
* @returns {Promise<void>} - A promise that resolves when the message is successfully added.
*/
export const submitUserMessage = async (input: string, threadId: string, setStatusMessage: (message: string) => void, fileIds: string[]): Promise<void> => {
  console.log('File IDs in submitUserMessage:', fileIds);
  setStatusMessage('Submitting user message...');
  const message = { input, threadId, fileIds };
  await addMessage(message);
  setStatusMessage('User message submitted successfully.');
};


/**
* Fetches the latest messages from the assistant, waiting until the assistant has responded.
* @param {string} runId - The ID of the assistant.
* @param {string} threadId - The ID of the chat thread.
* @returns {Promise<string>} - A promise that resolves to the messages from the assistant.
*/
export const fetchAssistantResponse = async (runId: string, threadId: string, setStatusMessage: (message: string) => void, setProgress: (progress: number) => void, initialProgress: number): Promise<string> => {
  try {
    const startTime = Date.now(); // Get the current time at the start
    setStatusMessage('Fetching assistant response...');
    let status: string;
    let fetchCount = 0; // Number of fetches so far
    const maxFetches = 10; // Maximum number of fetches
    do {
        const statusData: StatusData = await checkRunStatus(threadId, runId);
        status = statusData.status;
        fetchCount++; // Increment the fetch count
        const progress = initialProgress + ((fetchCount / maxFetches) * (90 - initialProgress)); // Calculate progress as a percentage
        setProgress(progress); // Update the progress bar
        if (status === 'cancelled' || status === 'cancelling' || status === 'failed' || status === 'expired') {
          throw new Error(status);
        }
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2); // Calculate elapsed time in seconds
        setStatusMessage(`Waiting for assistant response... Current status: ${status}. Time elapsed: ${elapsedTime} seconds.`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Polling delay
    } while (status !== 'completed');
    setStatusMessage('Assistant response fetched successfully.');
    setProgress(100); // Set progress to 100% after completion
    const response = await listMessages(threadId, runId);
    return response.messages;
  } catch (error) {
    setProgress(0); // Reset progress in case of error
    if (error instanceof Error) {
      setStatusMessage(`Error: ${error.message}`);
      throw error; // Re-throw the error after setting the status message
    }
    throw error; // Re-throw the error if it's not an instance of Error
  }
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