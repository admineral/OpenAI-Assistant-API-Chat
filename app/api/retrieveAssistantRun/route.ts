// Path: /api/retrieveAssistantRun
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const threadId = req.url.searchParams.get('threadId');
  const runId = req.url.searchParams.get('runId');

  if (!threadId || !runId) {
    return NextResponse.json({ error: 'Missing threadId or runId' });
  }

  try {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    return NextResponse.json({ run });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
