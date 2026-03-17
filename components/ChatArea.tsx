'use client';

import { useEffect, useRef } from 'react';
import { Message, AgentRole } from '@/lib/types';
import { AGENTS } from '@/lib/agents';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
  messages: Message[];
  currentPhase: AgentRole;
  isStreaming: boolean;
  streamingText: string;
}

export default function ChatArea({
  messages,
  currentPhase,
  isStreaming,
  streamingText,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const agent = AGENTS[currentPhase];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {/* Agent intro */}
      {messages.length === 0 && !isStreaming && (
        <div className="flex items-start gap-3 mb-6">
          <AgentAvatar role={currentPhase} />
          <div className="flex-1 max-w-[520px]">
            <div className="text-xs font-semibold text-[#1A1A1A] mb-0.5">{agent.name}</div>
            <div className="bg-[#F9F9F9] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#374151] leading-relaxed">
              {agent.description}。
              <br /><br />
              請告訴我您的專案想法，我會幫您深入分析並整理成完整的文件。
            </div>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} currentPhase={currentPhase} />
      ))}

      {/* Streaming message */}
      {isStreaming && streamingText && (
        <div className="flex items-start gap-3">
          <AgentAvatar role={currentPhase} />
          <div className="flex-1 max-w-[520px]">
            <div className="text-xs font-semibold text-[#1A1A1A] mb-0.5">{agent.name}</div>
            <div className="bg-[#F9F9F9] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#374151] leading-relaxed">
              <MarkdownContent content={streamingText.replace('[DOCUMENT_READY]', '')} />
              <span className="inline-block w-0.5 h-4 bg-[#1A1A1A] animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        </div>
      )}

      {isStreaming && !streamingText && (
        <div className="flex items-start gap-3">
          <AgentAvatar role={currentPhase} />
          <div className="flex items-center gap-1 px-4 py-3 bg-[#F9F9F9] rounded-2xl">
            <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message, currentPhase }: { message: Message; currentPhase: AgentRole }) {
  const isUser = message.role === 'user';
  const agentRole = message.agentRole || currentPhase;
  const agent = AGENTS[agentRole];

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[520px] bg-[#1A1A1A] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  const displayContent = message.content.replace('[DOCUMENT_READY]', '').trim();

  return (
    <div className="flex items-start gap-3">
      <AgentAvatar role={agentRole} />
      <div className="flex-1 max-w-[520px]">
        <div className="text-xs font-semibold text-[#1A1A1A] mb-0.5">{agent.name}</div>
        <div className="bg-[#F9F9F9] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#374151] leading-relaxed">
          <MarkdownContent content={displayContent} />
        </div>
      </div>
    </div>
  );
}

function AgentAvatar({ role }: { role: AgentRole }) {
  const agent = AGENTS[role];
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
      style={{ backgroundColor: `${agent.color}20` }}
    >
      {agent.icon}
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-[#1A1A1A] prose-headings:font-semibold prose-p:text-[#374151] prose-li:text-[#374151] prose-code:text-[#1A1A1A] prose-code:bg-[#F0F0F0] prose-code:px-1 prose-code:rounded">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
