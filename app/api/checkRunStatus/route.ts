// app/api/checkRunStatus/route.ts

// This file contains the API route for checking the status of a run in a 
// specific thread using the OpenAI API. It handles POST requests, expecting 
// 'threadId' and 'runId' in the form data, uses them to fetch the status of 
// a run via OpenAI, and returns this status as a JSON response.

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Extract form data from the request
    const formData = await req.formData();
    const threadId = formData.get('threadId') as string;
    const runId = formData.get('runId') as string;

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