/**
 * API Route - Create Run
 *
 * This route enables the creation of a run within a specific thread using the OpenAI API.
 * A 'run' is an execution instance where the assistant processes the messages in the thread
 * based on the provided configurations and returns a response.
 * The endpoint accepts POST requests with the 'threadId' and configuration details in the request body.
 * The response includes a run object, which provides details about the execution status and other relevant information.
 *
 * Path: /api/createRun
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function createRun(threadId, assistantId, model = null, instructions = null, tools = null, metadata = {}) {
  try {
    // Log the thread ID for debugging
    console.log(`Creating run for thread ID: ${threadId}`);

    // Make the API call to create a run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      model,
      instructions,
      tools,
      metadata
    });

    // Log the created run for debugging
    console.log('Created Run:', run);

    return run;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while creating run: ${error}`);
    throw new Error('Failed to create run');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const assistantId = 'asst_abc123'; // Replace with the actual assistant ID

    const result = await createRun(threadId, assistantId);
    console.log('Run Creation Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
