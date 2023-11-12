/**
 * API Route - List Runs in a Thread
 *
 * This route is designed to list all runs associated with a specific thread using the OpenAI API.
 * It is crucial for monitoring the progression and status of multiple runs within a conversation or interaction.
 * The endpoint accepts GET requests with the 'threadId' as a path parameter.
 * Optional query parameters such as 'limit', 'order', 'after', and 'before' allow for fine-tuned control over the list retrieval.
 * The response includes an array of run objects, each detailing the individual run's information and status.
 *
 * Path: /api/listRuns
 * Method: GET
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function listRuns(threadId, limit = 20, order = 'desc', after = null, before = null) {
  try {
    // Log the thread ID for debugging
    console.log(`Listing runs for thread ID: ${threadId}`);

    // Make the API call to list runs in the thread
    const runs = await openai.beta.threads.runs.list(threadId, {
      limit,
      order,
      after,
      before
    });

    // Log the retrieved runs for debugging
    console.log('Retrieved Runs:', runs);

    return runs;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while listing runs: ${error}`);
    throw new Error('Failed to list runs in thread');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID

    const result = await listRuns(threadId);
    console.log('Thread Runs:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
