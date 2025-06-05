import { NextRequest, NextResponse } from 'next/server';
import { Agent, run, setDefaultOpenAIKey } from '@openai/agents';

// Initialize API key for the Agents SDK
setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);

// Simple demo agent using the new Agents SDK
const agent = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant.',
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const result = await run(agent, message);
    return NextResponse.json({ reply: result.finalOutput });
  } catch (err) {
    console.error('Agent run error:', err);
    return NextResponse.json({ error: 'Failed to run agent' }, { status: 500 });
  }
}
