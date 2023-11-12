/**
 * API Route - Modify Thread Metadata
 *
 * This route facilitates the modification of a thread's metadata using the OpenAI API. 
 * It primarily addresses the need to update additional information about a thread in a structured format.
 * The endpoint accepts POST requests containing the 'threadId' and 'metadata' in the request body. 
 * It then invokes the OpenAI API to update the specified thread's metadata.
 * The updated thread object, including the new metadata, is returned as a JSON response.
 *
 * Path: /api/modifyThread
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function modifyThread(threadId, metadata) {
  try {
    // Log the received thread ID for debugging
    console.log(`Modifying thread with ID: ${threadId}`);

    // Make the API call to modify the thread's metadata
    const updatedThread = await openai.beta.threads.update(threadId, {
      metadata: metadata,
    });

    // Log the successful update
    console.log(`Thread updated with new metadata: ${JSON.stringify(updatedThread.metadata)}`);

    return updatedThread;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while modifying thread: ${error}`);
    throw new Error('Failed to modify thread metadata');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const metadata = { modified: 'true', user: 'abc123' }; // Example metadata

    const result = await modifyThread(threadId, metadata);
    console.log('Modified Thread:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
