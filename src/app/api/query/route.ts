'use server';

import { MastraClient } from '@mastra/client-js';
import { NextRequest, NextResponse } from 'next/server';

const client = new MastraClient({
  baseUrl: process.env.MASTRA_BASE_URL!, // Loaded from .env
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
  headers: {
    'X-Source': 'next-api',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { query, organization } = await req.json();
    const org = organization || 'cg_labs';

    const agent = client.getAgent('QueryRouterAgent');

    const stream = await agent.stream({
      messages: [{ role: 'user', content: query }],
      context: [{ role: 'system', content: `The organization is "${org}".` }],
    });

    // const response = await agent.generate({
    //   messages: [{ role: 'user', content: query }],
    //   context: [{ role: 'system', content: `The organization is "${org}".` }],
    // });

    // Initialize fullText collector
    let fullText = '';

    // Process stream parts
    await stream.processDataStream({
      onTextPart: (text) => {
        console.log('[Stream:text]', text);
        fullText += text;
      },
      onToolCallPart: (toolCall) => {
        console.log(`[Stream:toolCall] ${toolCall.toolName}: `, toolCall.args);
      },
      onFilePart: (file) => {
        console.log('[Stream:file]', file);
      },
      onDataPart: (data) => {
        console.log('[Stream:data]', data);
      },
      onErrorPart: (error) => {
        console.error('[Stream:error]', error);
      },
    });

    return NextResponse.json({
      question: query,
      answer: fullText.trim(),
    });
  } catch (error) {
    console.error('Mastra Cloud Agent Error:', error);
    return NextResponse.json(
      { error: 'Mastra Cloud agent failed to respond.' },
      { status: 500 }
    );
  }
}
