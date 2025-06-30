'use server';

import { MastraClient } from '@mastra/client-js';
import { NextRequest } from 'next/server';

const client = new MastraClient({
  baseUrl: process.env.MASTRA_BASE_URL!,
});

export async function POST(req: NextRequest) {
  const { query, organization } = await req.json();
  const org = organization || 'paramount';

  const agentName = 'QueryRouterAgent';
  const agent = client.getAgent(agentName);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const response = await agent.stream({
        messages: [{ role: 'user', content: query }],
        context: [{ role: 'system', content: `The organization is "${org}".` }],
      });

      await response.processDataStream({
        onTextPart: (text) => controller.enqueue(encoder.encode(text)),
        onToolCallPart: (toolCall) => {
          console.log(`[Stream:toolCall] ${toolCall.toolName}:`, toolCall.args);
          const toolInfo = JSON.stringify({
            tool: toolCall.toolName,
            agent: agentName,
          });
          controller.enqueue(encoder.encode(`\n[ToolCall] ${toolInfo}\n`));
        },
        onErrorPart: (error) =>
          controller.enqueue(
            encoder.encode(`[Error] ${JSON.stringify(error)}`)
          ),
        onDataPart: () => {},
        onFilePart: () => {},
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
    },
  });
}
