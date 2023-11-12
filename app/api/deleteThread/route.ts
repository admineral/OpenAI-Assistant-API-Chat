/**
 * API Route - Delete Thread
 *
 * This route provides functionality to delete a thread using the OpenAI API. 
 * It allows for the removal of threads that are no longer needed, ensuring efficient management of resources.
 * The endpoint accepts DELETE requests containing the 'threadId' as a path parameter. 
 * Upon receiving a request, the API performs the deletion of the specified thread and 
 * returns the deletion status as a JSON response, indicating whether the operation was successful.
 *
 * Path: /api/deleteThread/{threadId}
 * Method: DELETE
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function deleteThread(threadId) {
  try {
    // Log the received thread ID for debugging
    console.log(`Attempting to delete thread with ID: ${threadId}`);

    // Make the API call to delete the thread
    const response = await openai.beta.threads.del(threadId);

    // Log the successful deletion
    console.log(`Thread deletion status: ${response.deleted ? 'Successful' : 'Failed'}`);

    return response;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while deleting thread: ${error}`);
    throw new Error('Failed to delete thread');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with the actual thread ID to be deleted

    const result = await deleteThread(threadId);
    console.log('Thread Deletion Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
