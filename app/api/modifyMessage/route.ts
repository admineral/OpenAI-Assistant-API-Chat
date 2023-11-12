/**
 * API Route - Modify Message Metadata
 *
 * This route provides the functionality to modify the metadata of a message in a specific thread using the OpenAI API. 
 * It is designed to update additional information attached to a message, enhancing the detail and context of the conversation.
 * The endpoint accepts POST requests, which must include the 'threadId' and 'messageId' as path parameters and 'metadata' in the request body.
 * The modified message object, reflecting the new metadata, is returned as a JSON response, indicating a successful update.
 *
 * Path: /api/modifyMessage
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function modifyMessage(threadId, messageId, metadata) {
  try {
    // Log the thread ID and message ID for debugging
    console.log(`Modifying message with ID: ${messageId} in thread ID: ${threadId}`);

    // Make the API call to modify the message's metadata
    const updatedMessage = await openai.beta.threads.messages.update(threadId, messageId, {
      metadata
    });

    // Log the modified message for debugging
    console.log('Modified Message:', updatedMessage);

    return updatedMessage;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while modifying message: ${error}`);
    throw new Error('Failed to modify message metadata');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const messageId = 'msg_abc123'; // Replace with the actual message ID to be modified
    const metadata = { modified: 'true', user: 'abc123' }; // Example metadata

    const result = await modifyMessage(threadId, messageId, metadata);
    console.log('Message Modification Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
