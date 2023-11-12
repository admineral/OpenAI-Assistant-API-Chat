/**
 * API Route - Submit Tool Outputs to Run
 *
 * This route is used to submit outputs from tool calls when a run in a thread has a status of "requires_action".
 * It is a critical step in completing a run that depends on external tool outputs, such as function calls.
 * The endpoint accepts POST requests with 'threadId' and 'runId' as path parameters, and 'tool_outputs' in the request body.
 * The response includes the updated run object, reflecting the submission of the tool outputs.
 *
 * Path: /api/submitToolOutputs
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function submitToolOutputs(threadId, runId, toolOutputs) {
  try {
    // Log the thread ID and run ID for debugging
    console.log(`Submitting tool outputs for run ID: ${runId} in thread ID: ${threadId}`);

    // Make the API call to submit tool outputs
    const updatedRun = await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: toolOutputs,
    });

    // Log the updated run for debugging
    console.log('Updated Run:', updatedRun);

    return updatedRun;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while submitting tool outputs: ${error}`);
    throw new Error('Failed to submit tool outputs to run');
  }
}

// Example usage
(async () => {
  try {
    const threadId = 'thread_abc123'; // Replace with your actual thread ID
    const runId = 'run_abc123'; // Replace with the actual run ID that requires tool output submission
    const toolOutputs = [
      {
        tool_call_id: 'call_abc123',
        output: '28C',
      },
    ]; // Example tool outputs

    const result = await submitToolOutputs(threadId, runId, toolOutputs);
    console.log('Tool Outputs Submission Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
