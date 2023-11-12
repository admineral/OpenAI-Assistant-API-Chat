// Path: /api/retrieveMessage
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const threadId = req.url.searchParams.get('threadId');
  const messageId = req.url.searchParams.get('messageId');

  if (!threadId || !messageId) {
    return NextResponse.json({ error: 'Missing threadId or messageId' });
  }

  try {
    const message = await openai.beta.threads.messages.retrieve(threadId, messageId);
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
