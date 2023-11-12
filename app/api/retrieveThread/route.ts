/**
 * API Route - Retrieve Thread
 *
 * This route facilitates the retrieval of a specific conversation thread associated with an 
 * OpenAI assistant. It handles GET requests with the thread ID as a parameter. The route 
 * fetches and returns the conversation history and current status of the specified thread 
 * from the OpenAI API.
 *
 * Path: /api/retrieveThread
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
    try {
        const threadId = req.nextUrl.searchParams.get('threadId');

        if (!threadId) {
            throw new Error('Thread ID is required');
        }

        const thread = await openai.beta.threads.retrieve(threadId);
        return NextResponse.json(thread);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            return NextResponse.json({ error: error.message });
        } else {
            console.error('Unknown error:', error);
            return NextResponse.json({ error: 'An unknown error occurred' });
        }
    }
};
