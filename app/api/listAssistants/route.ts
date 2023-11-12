// Path: /api/listAssistants
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


export async function GET(req: NextRequest) {
    try {
      const assistants = await openai.beta.assistants.list();
      return NextResponse.json({ assistants });
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message });
      } else {
        // Handle the case where error is not an Error instance
        return NextResponse.json({ error: 'An unexpected error occurred.' });
      }
    }
  };
