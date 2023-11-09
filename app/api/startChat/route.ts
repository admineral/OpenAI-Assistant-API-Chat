// app/api/startChat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: NextRequest) {
    console.log('STARTET STARTCHAT API ROUTE INSIDE!!!!');
  if (req.method === 'POST') {
    try {
      const formData = await req.formData();
      console.log('Form Data:', formData); // Log form data

      const assistantName = formData.get('assistantName') as string;
      const assistantModel = formData.get('assistantModel') as string;
      const assistantDescription = formData.get('assistantDescription') as string;
      const inputmessage = formData.get('inputmessage') as string;
      const fileId = formData.get('fileId') as string;
      console.log('Received File ID:', fileId); // Log the received file ID

      if (inputmessage === null || typeof inputmessage !== 'string') {
        throw new Error('inputmessage is missing or not a string');
      }

      const assistantOptions: any = {
        name: assistantName,
        instructions: assistantDescription,
        model: assistantModel,
        tools: [{ "type": "retrieval" }],
      };
      if (fileId) {
        assistantOptions.file_ids = [fileId];
      }
      console.log('Assistant Options:', assistantOptions); // Log assistant options

      const assistant = await openai.beta.assistants.create(assistantOptions);
      const assistantId = assistant.id;
      console.log('Assistant ID:', assistantId); // Log assistant ID

      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: inputmessage,
          },
        ],
      });
      const threadId = thread.id;
      console.log('Thread ID:', threadId); // Log thread ID

      // Start a conversation with the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        //instructions: "Please address the user as Jane Doe. The user has a premium account."
      });
      console.log('Started run with Id:', run.id);

      // Poll for the completion of the run
      let completedRun;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

        completedRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
        console.log('Run status:', completedRun.status); // Log the status each time

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
      // Log the content of each message
      messages.data.forEach((message, index) => {
        console.log(`Message ${index + 1} content:`, message.content);
      });

      // A bunch of boring safety checks
      const assistantMessage = messages.data.at(-2);
      if (!assistantMessage) {
        return NextResponse.json({ error: "No last message found" });
      }

      const assistantMessageContent = assistantMessage.content.at(0);
      if (!assistantMessageContent) {
        return NextResponse.json({ error: "No assistant message found" });
      }

      if (assistantMessageContent.type !== "text") {
        return NextResponse.json({ error: "Assistant message is not text, only text supported in this demo" });
      }

      return NextResponse.json({ 
        response: assistantMessageContent.text.value, 
        assistantId: assistantId, 
        threadId: threadId 
      });
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