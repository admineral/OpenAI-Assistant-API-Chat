/**
 * API Route - List Messages in a Thread
 *
 * This route is designed to list messages within a specific thread, with options for pagination and filtering.
 * It handles GET requests and returns messages based on specified criteria. This functionality is crucial for
 * applications that need to display or analyze conversation histories within threads.
 *
 * Path: /api/listMessages
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
    if (req.method === 'GET') {
        try {
            const queryParams = new URLSearchParams(req.url);

            const threadId = queryParams.get('threadId');
            const limit = queryParams.get('limit');
            const offset = queryParams.get('offset');
            // Add other filters as needed

            if (!threadId) {
                throw new Error('Thread ID is required');
            }

            const params = {
                ...(limit && { limit: Number(limit) }),
                ...(offset && { offset: Number(offset) }),
                // Add other filters to params as needed
            };

            const messages = await openai.beta.threads.messages.list(threadId, params);

            return NextResponse.json({ 
                message: 'Messages listed successfully', 
                messages: messages 
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error);
                return NextResponse.json({ error: error.message });
            } else {
                console.error('Unknown error:', error);
                return NextResponse.json({ error: 'An unknown error occurred' });
            }
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
};
