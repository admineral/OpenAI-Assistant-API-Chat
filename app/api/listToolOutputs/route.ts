// Path: /api/listToolOutputs
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const runId = req.url.searchParams.get('runId');

  if (!runId) {
    return NextResponse.json({ error: 'Missing runId' });
  }

  try {
    const toolOutputs = await openai.tools.listOutputs(runId);
    return NextResponse.json({ toolOutputs });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
