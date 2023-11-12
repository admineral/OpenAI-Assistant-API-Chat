/**
 * API Route - Check Run Status
 *
 * This route is designed to check the status of a specific run in a thread
 * using the OpenAI API. It accepts POST requests containing 'threadId' and
 * 'runId' in the form data. The route then queries the OpenAI API to retrieve
 * the current status of the specified run. This information is crucial for
 * understanding the state of an ongoing interaction with an AI assistant,
 * such as whether the interaction is completed, ongoing, or has encountered
 * any issues. The status of the run is returned as a JSON response, providing
 * a simple and effective way for client applications to monitor and react to
 * the progress of AI-assisted conversations or tasks.
 *
 * Path: /api/checkRunStatus
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Extract JSON data from the request
    const data = await req.json();
    const threadId = data.threadId;
    const runId = data.runId;

    // Log the received thread ID and run ID for debugging
    console.log(`Received request with threadId: ${threadId} and runId: ${runId}`);

    // Retrieve the status of the run for the given thread ID and run ID using the OpenAI API
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    // Log the retrieved run status for debugging
    console.log(`Retrieved run status: ${runStatus.status}`);

    // Return the retrieved run status as a JSON response
    return NextResponse.json({ status: runStatus.status });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}