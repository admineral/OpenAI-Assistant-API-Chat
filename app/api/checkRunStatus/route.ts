// app/api/checkRunStatus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const threadId = formData.get('threadId') as string;
    const runId = formData.get('runId') as string;

    console.log(`Received request with threadId: ${threadId} and runId: ${runId}`);

    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    console.log(`Retrieved run status: ${runStatus.status}`);

    return NextResponse.json({ status: runStatus.status });
  } catch (error) {
    console.error(`Error occurred: ${error}`);

  }
}
