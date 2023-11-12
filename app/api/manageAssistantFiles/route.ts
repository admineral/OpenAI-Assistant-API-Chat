/**
 * API Route - Manage File Associations
 *
 * This route is responsible for managing file associations with an assistant. It accepts POST requests
 * to associate or dissociate files with an assistant. This functionality is crucial for configuring assistants
 * that rely on specific files for performing tasks or retrieving information.
 *
 * Path: /api/manageFileAssociations
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            const formData = await req.formData();
            const action = formData.get('action') as string; // "associate" or "dissociate"
            const assistantId = formData.get('assistantId') as string;
            const fileId = formData.get('fileId') as string;

            if (!assistantId || !fileId || !action) {
                throw new Error('Missing required parameters for managing file associations');
            }

            let response;
            if (action === 'associate') {
                response = await openai.beta.assistants.files.create(assistantId, fileId);
            } else if (action === 'dissociate') {
                response = await openai.beta.assistants.files.delete(assistantId, fileId);
            } else {
                throw new Error('Invalid action specified');
            }

            return NextResponse.json({ 
                message: `File ${action}d successfully`, 
                response: response 
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
