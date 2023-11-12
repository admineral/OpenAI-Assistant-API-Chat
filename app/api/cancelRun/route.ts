// Path: /api/cancelRun
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const threadId = formData.get('threadId');
  const runId = formData.get('runId');

  if (!threadId || !runId) {
    return NextResponse.json({ error: 'Missing threadId or runId' });
  }

  try {
    await openai.beta.threads.runs.cancel(threadId, runId);
    return NextResponse.json({ message: 'Run canceled successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
