/**
 * API Route - Create Chat Thread
 *
 * This API route facilitates the creation of a new chat thread using the OpenAI API.
 * It processes POST requests that contain an initial input message. This route is primarily
 * used to start a new conversation thread, initializing it with a user-specified message.
 * The newly created thread ID is then returned, enabling further interaction within that thread.
 *
 * Path: /api/createThread
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('CREATE THREAD started');
  if (req.method === 'POST') {
    try {
      const data = await req.json();
      const inputMessage = data.inputmessage;

      // Überprüfen, ob die Eingabemessage vorhanden und ein String ist
      if (!inputMessage || typeof inputMessage !== 'string') {
        throw new Error('inputmessage is missing or not a string');
      }

      // Thread erstellen
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: inputMessage,
          },
        ],
      });
      const threadId = thread.id;
      console.log('Thread ID:', threadId);

      return NextResponse.json({ threadId });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: (error as Error).message });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}