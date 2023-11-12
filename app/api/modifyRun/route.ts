/**
 * API Route - Modify Run Metadata
 *
 * This route enables modifying the metadata of a specific run within a thread using the OpenAI API.
 * Modifying run metadata can be crucial for adding or updating contextual information associated with a run.
 * The endpoint accepts POST requests with 'threadId' and 'runId' as path parameters and 'metadata' in the request body.
 * The response includes the modified run object, reflecting the updated metadata.
 *
 * Path: /api/modifyRun
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function modifyRun(threadId, runId, metadata) {
  try {
    // Log the thread ID and run ID for debugging
    console.log(`Modifying run with ID: ${runId} in thread ID: ${threadId}`);

    // Make the API call to modify the run's metadata
    const updatedRun = await openai.beta.threads.runs.update(threadId, runId, {
      metadata
    });

    // Log the modified run for debugging
    console.log('Modified Run:', updatedRun);

    return updatedRun;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while modifying run: ${error}`);
    throw new Error('Failed to modify run metadata');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const runId = 'run_abc123'; // Replace with the actual run ID to be modified
    const metadata = { user_id: 'user_abc123' }; // Example metadata to add or modify

    const result = await modifyRun(threadId, runId, metadata);
    console.log('Run Modification Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
