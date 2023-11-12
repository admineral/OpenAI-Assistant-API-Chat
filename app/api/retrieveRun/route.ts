/**
 * API Route - Retrieve Run
 *
 * This route enables the retrieval of a specific run within a thread using the OpenAI API.
 * A 'run' represents an execution instance where the assistant processes messages in a thread.
 * The endpoint accepts GET requests with 'threadId' and 'runId' as path parameters.
 * The response includes the run object with details such as status, timestamps, and configuration used.
 *
 * Path: /api/retrieveRun
 * Method: GET
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function retrieveRun(threadId, runId) {
  try {
    // Log the thread ID and run ID for debugging
    console.log(`Retrieving run with ID: ${runId} in thread ID: ${threadId}`);

    // Make the API call to retrieve the run
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    // Log the retrieved run for debugging
    console.log('Retrieved Run:', run);

    return run;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while retrieving run: ${error}`);
    throw new Error('Failed to retrieve run');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const runId = 'run_abc123'; // Replace with the actual run ID to be retrieved

    const result = await retrieveRun(threadId, runId);
    console.log('Run Retrieval Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
