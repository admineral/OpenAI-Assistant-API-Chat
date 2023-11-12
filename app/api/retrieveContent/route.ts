// Path: /api/retrieveContent
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const fileId = req.url.searchParams.get('fileId');

  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' });
  }

  try {
    const fileContent = await openai.files.retrieveContent(fileId);
    return NextResponse.json({ fileContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
