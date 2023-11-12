// Path: /api/listAssistantMessages
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
    const messages = await openai.beta.threads.messages.list(threadId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
