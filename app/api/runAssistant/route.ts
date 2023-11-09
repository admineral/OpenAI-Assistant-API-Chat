// app/api/runAssistant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const assistantId = formData.get('assistantId') as string;
    const threadId = formData.get('threadId') as string;
    

    console.log(`Inside -runAssistant --> assistantId: ${assistantId}`);
    console.log(`Inside -runAssistant --> threadId: ${threadId}`);

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    console.log(`run: ${JSON.stringify(run)}`);

    return NextResponse.json({ runId: run.id });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
