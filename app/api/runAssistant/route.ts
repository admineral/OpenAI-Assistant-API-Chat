// app/api/runAssistant/route.ts

// This file provides the API route for running an assistant in a specific thread
// using the OpenAI API. It handles POST requests with 'assistantId' and 'threadId'
// to initiate a run of the assistant in the given thread, and returns the run ID.

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Extract assistant ID and thread ID from form data
    const formData = await req.formData();
    const assistantId = formData.get('assistantId') as string;
    const threadId = formData.get('threadId') as string;
    
    // Log the received assistant ID and thread ID for debugging purposes
    console.log(`Inside -runAssistant --> assistantId: ${assistantId}`);
    console.log(`Inside -runAssistant --> threadId: ${threadId}`);

    // Create a run using the OpenAI API with the provided assistant and thread IDs
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Log the details of the run for debugging
    console.log(`run: ${JSON.stringify(run)}`);

    // Respond with the run ID in a JSON format
    return NextResponse.json({ runId: run.id });
  } catch (error) {
    // Handle any errors and log them
    console.error(`Error: ${error}`);
  }
}
