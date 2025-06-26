'use server';

import { mastra } from '@/mastra';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, organization } = await req.json();
    const org = organization || 'paramount';

    console.log('Received query:', query);

    const agent = mastra.getAgent('CustomerAuditAgent');

    const result = await agent.generate([{ role: 'user', content: query }], {
      context: [{ role: 'system', content: `The organization is "${org}".` }],
    });

    console.log('Agent response:', result);

    return NextResponse.json({
      question: query,
      answer: result.text,
    });
  } catch (error) {
    console.error('Mastra Agent Error:', error);
    return NextResponse.json(
      { error: 'Agent failed to respond.' },
      { status: 500 }
    );
  }
}
