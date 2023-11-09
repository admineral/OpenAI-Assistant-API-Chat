/**
 * API Route - Run Assistant
 * 
 * This API route is responsible for running a specific assistant within a thread.
 * It handles POST requests containing 'assistantId' and 'threadId', initiating a run
 * of the assistant in the specified thread. The OpenAI API is used to create the run,
 * and the route returns the unique 'runId' for further interactions.
 * 
 * Path: /api/runAssistant
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Extract assistant ID and thread ID from form data
    const formData = await req.formData();
    const assistantId = formData.get('assistantId') as string;
    const threadId = formData.get('threadId') as string;
    
    // Log the received IDs for debugging
    console.log(`Inside -runAssistant --> assistantId: ${assistantId}`);
    console.log(`Inside -runAssistant --> threadId: ${threadId}`);

    // Create a run using the OpenAI API
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Log the run details for debugging
    console.log(`run: ${JSON.stringify(run)}`);

    // Respond with the run ID in JSON format
    return NextResponse.json({ runId: run.id });
  } catch (error) {
    // Handle and log any errors
    console.error(`Error in -runAssistant: ${error}`);
    return NextResponse.json({ error: 'Failed to run assistant' }, { status: 500 });
  }
}
