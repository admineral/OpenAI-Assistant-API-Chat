// pages/api/chat.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let assistant : any;
let thread : any;


export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      
      const body = await req.json();
      const { assistantName, assistantModel, assistantDescription, inputmessage } = body;
      const { input } = body;

      
      if (!assistant) {
        assistant = await openai.beta.assistants.create({
          name: assistantName,
          instructions: assistantDescription,
          model: "gpt-4-1106-preview",
          tools: [{ "type": "retrieval" }],
        });
      }

      console.log('Created assistant with Id:', assistant.id);

      
      if (!thread) {
        thread = await openai.beta.threads.create({
          messages: [
            {
              role: "user",
              content: inputmessage,
            },
          ],
        });
      }

      console.log('Created Thread with Id:', thread.id);

      // Create a message in the thread
      if (input) {
        const message = await openai.beta.threads.messages.create(
          thread.id, 
        {
          role: "user",
          content: input,
        });
        console.log('Added message to thread : ', input);
      }

      // Run the assistant on the thread to get a response
      const run = await openai.beta.threads.runs.create(
        thread.id, 
      {
        assistant_id: assistant.id,
        //instructions: "additional instruction"
      });
      console.log('started run with Id:', run.id);

      // Poll for the completion of the run
      let completedRun;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

        completedRun = await openai.beta.threads.runs.retrieve(
          thread.id, 
          run.id
        );
        console.log('Run status:', completedRun.status); // Log the status each time

        const runSteps = await openai.beta.threads.runs.steps.list(thread.id, run.id);
        runSteps.data.forEach(step => {
          console.log('Type:', step.type);
          console.log('Status:', step.status);
          console.log('Step Details:', step.step_details);
        });

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
      const messages = await openai.beta.threads.messages.list(thread.id);

      console.log('Messages:', messages.data.map(message => ({
        role: message.role,
        content: message.content
          .filter(contentItem => 'text' in contentItem)
          .map(contentItem => (contentItem as any).text.value),
      })));

      
            // A bunch of boring safety checks
            const lastMessage = messages.data.at(0);
            if (!lastMessage) {
              return NextResponse.json({ error: "No last message found" });
            }
      
            const assistantMessageContent = lastMessage.content.at(0);
            if (!assistantMessageContent) {
              return NextResponse.json({ error: "No assistant message found" });
            }
      
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
      