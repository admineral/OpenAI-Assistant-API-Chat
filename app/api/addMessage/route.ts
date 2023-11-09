// app/api/addMessage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const threadId = formData.get('threadId') as string;
    const input = formData.get('input') as string;

    console.log(`inside add_Message -Thread ID: ${threadId}`);
    console.log(`inside add_Message -Input: ${input}`);

    if (typeof input !== 'string') {
      throw new Error('Input is not a string');
    }

    if (input) {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input,
      });
      console.log("add_Message successfully");
      return NextResponse.json({ message: "Message created successfully" });
    }

    
    return NextResponse.json({ message: 'No action performed' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error);
      return NextResponse.json({ error: error.message });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'An unknown error occurred' });
    }
  }
}