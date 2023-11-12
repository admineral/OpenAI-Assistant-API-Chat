// Path: /api/listAssistantRuns
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const threadId = req.url.searchParams.get('threadId');

  if (!threadId) {
    return NextResponse.json({ error: 'Missing threadId' });
  }

  try {
    const runs = await openai.beta.threads.runs.list(threadId);
    return NextResponse.json({ runs });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
