/**
 * API Route - Submit Function Call Outputs
 *
 * This route submits the outputs for function calls made by an assistant. It is designed to
 * handle POST requests where the function call outputs are provided. This route is crucial
 * for completing tasks that involve function calls, allowing the assistant to proceed with
 * the information obtained from external functions.
 *
 * Path: /api/submitFunctionCallOutputs
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
            const threadId = formData.get('threadId') as string;
            const runId = formData.get('runId') as string;
            const toolOutputs = JSON.parse(formData.get('toolOutputs') as string);

            if (!threadId || !runId || !toolOutputs) {
                throw new Error('Missing required parameters for function call output submission');
            }

            const response = await openai.beta.threads.runs.submitToolOutputs(threadId, runId, { tool_outputs: toolOutputs });

            return NextResponse.json({ 
                message: 'Function call outputs submitted successfully', 
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
