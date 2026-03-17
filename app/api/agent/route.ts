import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { AGENTS } from '@/lib/agents';
import { AgentRole, Message } from '@/lib/types';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { agentRole, messages, projectContext } = await req.json() as {
      agentRole: AgentRole;
      messages: Message[];
      projectContext: string;
    };

    const agent = AGENTS[agentRole];
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Invalid agent role' }), { status: 400 });
    }

    const systemPrompt = agent.systemPrompt + (projectContext
      ? `\n\n## 專案背景資訊\n${projectContext}`
      : '');

    const apiMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: apiMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Agent API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
