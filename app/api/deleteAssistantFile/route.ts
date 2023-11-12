// Path: /api/deleteAssistantFile
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function DELETE(req: NextRequest) {
  const formData = await req.formData();
  const assistantId = formData.get('assistantId');
  const fileId = formData.get('fileId');

  if (!assistantId || !fileId) {
    return NextResponse.json({ error: 'Missing assistantId or fileId' });
  }

  try {
    await openai.beta.assistants.files.del(assistantId, fileId);
    return NextResponse.json({ message: 'Assistant file association deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message });
  }
};
