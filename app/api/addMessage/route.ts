/**
 * API Route - Add Message to Thread
 *
 * This route provides the functionality to add new messages to a specific
 * thread via the OpenAI API. It is designed to handle POST requests, where
 * it receives 'threadId' and 'input' within the form data. The 'threadId'
 * identifies the target conversation thread, while 'input' contains the
 * message content to be added. This route plays a crucial role in facilitating
 * dynamic interactions within AI-powered threads, allowing users to continue
 * conversations or add new queries and instructions.
 *
 * Path: /api/addMessage
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Extract thread ID, input content, and fileIds from JSON data
    const data = await req.json();
    const threadId = data.threadId;
    const input = data.input;
    const fileIds = data.fileIds; // This is the new line

    // Log the received thread ID, input, and fileIds for debugging purposes
    console.log(`inside add_Message -Thread ID: ${threadId}`);
    console.log(`inside add_Message -Input: ${input}`);
    console.log(`inside add_Message -File IDs: ${fileIds}`); // This is the new line

    // Validate the input data
    if (typeof input !== 'string') {
      throw new Error('Input is not a string');
    }

    // If input is provided, create a new message in the thread using the OpenAI API
    if (input) {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input,
        file_ids: fileIds || [], // This is the new line
      });
      console.log("add_Message successfully");
      return NextResponse.json({ message: "Message created successfully" });
    }

    // Respond with a message indicating no action was performed if input is empty
    return NextResponse.json({ message: 'No action performed' });
  } catch (error) {
    // Error handling with detailed logging
    if (error instanceof Error) {
      console.error('Error:', error);
      return NextResponse.json({ error: error.message });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'An unknown error occurred' });
    }
  }
}