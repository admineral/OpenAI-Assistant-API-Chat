/**
 * API Route - Create Thread and Run
 *
 * This route is designed to create a thread and run it immediately using the OpenAI API.
 * It simplifies the process by combining the thread creation and execution into a single step.
 * The endpoint accepts POST requests with the 'assistantId' and optional 'thread' details in the request body.
 * The response includes the run object, detailing the execution status and configuration used.
 *
 * Path: /api/createThreadAndRun
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function createThreadAndRun(assistantId, threadDetails) {
  try {
    // Log the assistant ID for debugging
    console.log(`Creating thread and run with assistant ID: ${assistantId}`);

    // Make the API call to create a thread and run
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,
      thread: threadDetails,
    });

    // Log the created run for debugging
    console.log('Created Thread and Run:', run);

    return run;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while creating thread and run: ${error}`);
    throw new Error('Failed to create thread and run');
  }
}

// Example usage
(async () => {
  try {
    const assistantId = 'asst_abc123'; // Replace with the actual assistant ID
    const threadDetails = {
      messages: [{ role: 'user', content: 'Explain deep learning to a 5 year old.' }],
    }; // Example thread details

    const result = await createThreadAndRun(assistantId, threadDetails);
    console.log('Thread and Run Creation Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
