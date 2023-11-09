// app/api/listMessages/route.ts

// This file contains the API route for listing messages in a specific thread
// using the OpenAI API. It handles POST requests, expecting a 'threadId' in
// the form data, uses it to fetch messages via OpenAI, and returns these
// messages as a JSON response.


import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize OpenAI client using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define an asynchronous POST function to handle incoming requests
export async function POST(req: NextRequest) {
  try {
    // Extract form data from the request
    const formData = await req.formData();

    // Retrieve 'threadId' from form data and cast it to string
    const threadId = formData.get('threadId') as string;

    // Log the received thread ID for debugging
    console.log(`Received request with threadId: ${threadId}`);

    // Retrieve messages for the given thread ID using the OpenAI API
    const messages = await openai.beta.threads.messages.list(threadId);

    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${messages.data.length} messages`);

    // Return the retrieved messages as a JSON response
    return NextResponse.json({ messages: messages.data });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}
