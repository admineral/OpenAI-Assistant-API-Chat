/**
 * API Route - Update Assistant
 *
 * This route allows for updating the configuration of an existing OpenAI assistant. 
 * It accepts POST requests with the assistant ID and updated parameters such as name, 
 * model, and description. The route updates the assistant's settings on the OpenAI platform
 * and returns confirmation upon successful modification.
 *
 * Path: /api/updateAssistant
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const assistantId = formData.get('assistantId') as string;
        const updatedOptions = formData.get('updatedOptions');

        if (!assistantId || !updatedOptions) {
            throw new Error('Missing required parameters');
        }

        const updatedAssistant = await openai.beta.assistants.update(assistantId, updatedOptions);
        return NextResponse.json({ message: 'Assistant updated successfully', updatedAssistant });
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
