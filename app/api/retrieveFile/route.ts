// Path: /api/retrieveFile
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
    const fileDetails = await openai.files.retrieve(fileId);
    return NextResponse.json({ fileDetails });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
