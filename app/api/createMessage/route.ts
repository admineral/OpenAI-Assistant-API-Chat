/**
 * API Route - Create Thread Message
 *
 * This route allows for the creation of messages within a specific thread using the OpenAI API. 
 * It is designed to add user-generated content to an ongoing thread, facilitating continued interaction 
 * and engagement with the AI assistant. The endpoint accepts POST requests, which must include the 'threadId', 
 * 'role', and 'content' in the request body. Optionally, 'file_ids' and 'metadata' can also be included.
 * The newly created message object is returned as a JSON response, providing confirmation and details of the message creation.
 *
 * Path: /api/createMessage
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function createMessage(threadId, role, content, fileIds = [], metadata = {}) {
  try {
    // Log the thread ID and message content for debugging
    console.log(`Creating message in thread ID: ${threadId} with content: ${content}`);

    // Make the API call to create a new message in the thread
    const threadMessages = await openai.beta.threads.messages.create(threadId, {
      role,
      content,
      file_ids: fileIds,
      metadata
    });

    // Log the created message for debugging
    console.log('Created Message:', threadMessages);

    return threadMessages;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while creating message: ${error}`);
    throw new Error('Failed to create message');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with the actual thread ID
    const role = 'user'; // Role creating the message (currently only 'user' is supported)
    const content = 'How does AI work? Explain it in simple terms.'; // Message content

    const result = await createMessage(threadId, role, content);
    console.log('Message Creation Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
