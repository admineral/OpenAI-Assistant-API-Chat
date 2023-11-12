// Path: /api/retrieveToolOutput
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const toolOutputId = req.url.searchParams.get('toolOutputId');

  if (!toolOutputId) {
    return NextResponse.json({ error: 'Missing toolOutputId' });
  }

  try {
    const toolOutput = await openai.tools.retrieveOutput(toolOutputId);
    return NextResponse.json({ toolOutput });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
