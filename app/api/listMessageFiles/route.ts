/**
 * API Route - List Message Files
 *
 * This route provides the functionality to retrieve a list of files associated with a specific message in a thread.
 * The endpoint facilitates the retrieval of additional resources or attachments linked to a message,
 * aiding in a comprehensive understanding of the conversation context.
 * The endpoint accepts GET requests, which must include the 'threadId' and 'messageId' as path parameters.
 * Optional query parameters can control the number of results returned and the order in which they are presented.
 * The response includes an array of file objects, each containing details about the individual files.
 *
 * Path: /api/listMessageFiles
 * Method: GET
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function listMessageFiles(threadId, messageId, limit = 20, order = 'desc', after = null, before = null) {
  try {
    // Log the thread ID and message ID for debugging
    console.log(`Listing files for message ID: ${messageId} in thread ID: ${threadId}`);

    // Make the API call to list message files
    const messageFiles = await openai.beta.threads.messages.files.list(threadId, messageId, {
      limit,
      order,
      after,
      before
    });

    // Log the retrieved files for debugging
    console.log('Retrieved Message Files:', messageFiles);

    return messageFiles;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while listing message files: ${error}`);
    throw new Error('Failed to list message files');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const messageId = 'msg_abc123'; // Replace with the actual message ID

    const result = await listMessageFiles(threadId, messageId);
    console.log('Message Files:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
