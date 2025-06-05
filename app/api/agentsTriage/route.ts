import { NextRequest, NextResponse } from 'next/server';
import { Agent, run, setDefaultOpenAIKey } from '@openai/agents';

setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);

// Two specialist agents
const historyTutor = new Agent({
  name: 'History Tutor',
  instructions:
    'You provide assistance with historical queries. Explain important events and context clearly.',
});

const mathTutor = new Agent({
  name: 'Math Tutor',
  instructions:
    'You provide help with math problems. Explain your reasoning at each step and include examples',
});

// Triage agent handing off to specialists
const triageAgent = new Agent({
  name: 'Triage Agent',
  instructions:
    "You determine which agent to use based on the user's homework question",
  handoffs: [historyTutor, mathTutor],
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (typeof question !== 'string') {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }
    const result = await run(triageAgent, question);
    return NextResponse.json({ reply: result.finalOutput });
  } catch (err) {
    console.error('Triage agent error:', err);
    return NextResponse.json(
      { error: 'Failed to run triage agent' },
      { status: 500 },
    );
  }
}
