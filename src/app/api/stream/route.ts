'use server';

import { MastraClient } from '@mastra/client-js';
import { NextRequest } from 'next/server';
import { RuntimeContext } from '@mastra/core/di';

const client = new MastraClient({
  baseUrl: process.env.MASTRA_BASE_URL!,
});

export async function POST(req: NextRequest) {
  const { query, clientOrganization } = await req.json();
  const org = clientOrganization || 'cg_labs';

  const agentName = 'QueryRouterAgent';
  const agent = client.getAgent(agentName);

  const runtimeContext = new RuntimeContext();
  runtimeContext.set('clientOrganization', org);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const response = await agent.stream({
        messages: [{ role: 'user', content: query }],
        runtimeContext,
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
