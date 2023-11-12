/**
 * API Route - List Threads
 *
 * This route provides the functionality to list threads with pagination and filters. It handles GET requests
 * and returns a list of threads based on the specified filters. This route is essential for managing and
 * navigating through multiple threads in applications utilizing OpenAI assistants.
 *
 * Path: /api/listThreads
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
    if (req.method === 'GET') {
        try {
            const queryParams = new URLSearchParams(req.url);

            // Add pagination and filter parameters as needed
            const limit = queryParams.get('limit');
            const offset = queryParams.get('offset');
            // Add other filters as needed

            const params = {
                ...(limit && { limit: Number(limit) }),
                ...(offset && { offset: Number(offset) }),
                // Add other filters to params as needed
            };

            const threads = await openai.beta.threads.list(params);

            return NextResponse.json({ 
                message: 'Threads listed successfully', 
                threads: threads 
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
