// Path: /api/listAssistantFiles
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const assistantId = req.url.searchParams.get('assistantId');

  if (!assistantId) {
    return NextResponse.json({ error: 'Missing assistantId' });
  }

  try {
    const files = await openai.beta.assistants.files.list(assistantId);
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
