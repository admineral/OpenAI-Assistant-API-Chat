// app/api/listMessages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const threadId = formData.get('threadId') as string;

    console.log(`Received request with threadId: ${threadId}`);

    const messages = await openai.beta.threads.messages.list(threadId);

    console.log(`Retrieved ${messages.data.length} messages`);

    // Create a new array that only contains the role and content of each message
    /*const messagesData = messages.data.map(message => ({
      role: message.role,
      content: message.content[0].text.value
    }));
    console.log('List of messages:', messagesData);
    
    
    // Get the last message (the newest one)
    const lastMessage = messages.data[0];

    console.log('--------Last message role:', lastMessage.role);
    const textContent = lastMessage.content[0].text.value;
    console.log('Last message text content:', textContent);
    */
    // Optional: Filter or process messages if needed
    // For example, you might want to only return the assistant's messages

    return NextResponse.json({ messages: messages.data });
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    // ... error handling ...
  }
}
