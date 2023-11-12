// Path: /api/deleteMessage
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function DELETE(req: NextRequest) {
  const threadId = req.url.searchParams.get('threadId');
  const messageId = req.url.searchParams.get('messageId');

  if (!threadId || !messageId) {
    return NextResponse.json({ error: 'Missing threadId or messageId' });
  }

  try {
    await openai.beta.threads.messages.del(threadId, messageId);
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
