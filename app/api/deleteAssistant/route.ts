/**
 * API Route - Delete Assistant
 *
 * This route is designed to delete an existing OpenAI assistant. It accepts DELETE requests
 * with the assistant ID. The route sends a request to the OpenAI API to delete the specified
 * assistant. This is useful for cleaning up assistants that are no longer needed.
 *
 * Path: /api/deleteAssistant
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function DELETE(req: NextRequest) {
    try {
        const assistantId = req.nextUrl.searchParams.get('assistantId');

        if (!assistantId) {
            throw new Error('Assistant ID is required for deletion');
        }

        await openai.beta.assistants.delete(assistantId);
        return NextResponse.json({ message: 'Assistant deleted successfully' });
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
