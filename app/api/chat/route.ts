// app/api/chat.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const formData = await req.formData();
      const assistantId = formData.get('assistantId') as string;
      const threadId = formData.get('threadId') as string;
      const input = formData.get('input') as string;
      console.log(input);

      if (typeof input !== 'string') {
        throw new Error('Input is not a string');
      }

      // Create a message in the thread
      if (input) {
        await openai.beta.threads.messages.create(
          threadId, 
        {
          role: "user",
          content: input,
        });
      }

      // Run the assistant on the thread to get a response
      const run = await openai.beta.threads.runs.create(
        threadId, 
      {
        assistant_id: assistantId,
      });

      // Poll for the completion of the run
      let completedRun;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

        completedRun = await openai.beta.threads.runs.retrieve(
          threadId, 
          run.id
        );

        // Return if the run appears dead
        if (
          completedRun.status === "cancelled" ||
          completedRun.status === "cancelling" ||
          completedRun.status === "failed" ||
          completedRun.status === "expired"
        ) {
          return NextResponse.json({ error: `Run stopped due to status: ${completedRun.status}` });
        }
      } while (completedRun.status !== "completed");

      // After the run has completed
      const messages = await openai.beta.threads.messages.list(threadId);
      messages.data.forEach((message, index) => {
        console.log(`Message ${index + 1} role:`, message.role);
        console.log(`Message ${index + 1} content:`, message.content);
      });

      // A bunch of boring safety checks
      const assistantMessage = messages.data.at(0);
      if (!assistantMessage) {
        return NextResponse.json({ error: "No last message found" });
      }

      const assistantMessageContent = assistantMessage.content.at(0);
      if (!assistantMessageContent) {
        return NextResponse.json({ error: "No assistant message found" });
      }
      //console.log('Assistant response:', assistantMessageContent.text.value);

      if (assistantMessageContent.type !== "text") {
        return NextResponse.json({ error: "Assistant message is not text, only text supported in this demo" });
      }

      // Return the assistant's response
      return NextResponse.json({ response: assistantMessageContent.text.value });
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
};