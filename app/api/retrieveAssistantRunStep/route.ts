// Path: /api/retrieveAssistantRunStep
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const threadId = req.url.searchParams.get('threadId');
  const runId = req.url.searchParams.get('runId');
  const stepId = req.url.searchParams.get('stepId');

  if (!threadId || !runId || !stepId) {
    return NextResponse.json({ error: 'Missing threadId, runId, or stepId' });
  }

  try {
    const runStep = await openai.beta.threads.runs.steps.retrieve(threadId, runId, stepId);
    return NextResponse.json({ runStep });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
