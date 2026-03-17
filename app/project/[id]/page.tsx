'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import PhaseProgress from '@/components/PhaseProgress';
import ChatArea from '@/components/ChatArea';
import DocumentPanel from '@/components/DocumentPanel';
import {
  getProject,
  saveProject,
  addMessage,
  setPhaseDocument,
  advancePhase,
  rollbackToPhase,
} from '@/lib/projectStore';
import { AGENTS, getNextPhase } from '@/lib/agents';
import { Project, AgentRole, Document } from '@/lib/types';
import { Send, FileText, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [showRollbackConfirm, setShowRollbackConfirm] = useState<AgentRole | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const p = getProject(id);
    if (!p) {
      router.replace('/');
      return;
    }
    setProject(p);
  }, [id, router]);

  const updateProject = useCallback((updated: Project) => {
    saveProject(updated);
    setProject(updated);
  }, []);

  const handleSend = async () => {
    if (!project || !input.trim() || isStreaming) return;

    const currentPhase = project.currentPhase;
    const agent = AGENTS[currentPhase];
    const userMsg = input.trim();
    setInput('');

    // Add user message
    let updated = addMessage(project, currentPhase, {
      role: 'user',
      content: userMsg,
      agentRole: currentPhase,
    });
    updateProject(updated);

    // Build context from previous phases
    const contextParts: string[] = [`專案描述：${project.description}`];
    for (const phase of Object.values(updated.phases)) {
      if (phase.document) {
        contextParts.push(`\n### ${phase.document.documentName}\n${phase.document.content}`);
      }
    }
    const projectContext = contextParts.join('\n');

    // Build messages for API
    const phaseMessages = updated.phases[currentPhase].messages;

    setIsStreaming(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentRole: currentPhase,
          messages: phaseMessages,
          projectContext,
        }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setStreamingText(fullText);
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      // Save assistant message
      updated = addMessage(updated, currentPhase, {
        role: 'assistant',
        content: fullText,
        agentRole: currentPhase,
      });

      // Check if document is ready
      if (fullText.includes('[DOCUMENT_READY]')) {
        const docContent = fullText.replace('[DOCUMENT_READY]', '').trim();
        updated = setPhaseDocument(updated, currentPhase, docContent, agent.documentName);
      }

      updateProject(updated);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const handleAdvancePhase = () => {
    if (!project) return;
    const next = getNextPhase(project.currentPhase);
    if (next) {
      const updated = advancePhase(project, next);
      updateProject(updated);
    }
  };

  const handleRollback = (targetPhase: AgentRole) => {
    setShowRollbackConfirm(targetPhase);
  };

  const confirmRollback = () => {
    if (!project || !showRollbackConfirm) return;
    const updated = rollbackToPhase(project, showRollbackConfirm);
    updateProject(updated);
    setShowRollbackConfirm(null);
    setViewingDocument(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentPhase = project.currentPhase;
  const currentAgent = AGENTS[currentPhase];
  const currentPhaseData = project.phases[currentPhase];
  const hasDocument = !!currentPhaseData.document;
  const nextPhase = getNextPhase(currentPhase);
  const allDocuments = Object.values(project.phases)
    .filter((p) => p.document)
    .map((p) => p.document!);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-[60px] flex flex-col overflow-hidden">
        <TopBar title={project.name} />

        <div className="flex flex-col flex-1 overflow-hidden pt-11">
          {/* Phase progress bar */}
          <PhaseProgress project={project} onRollback={handleRollback} />

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chat */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Agent header */}
              <div
                className="flex items-center gap-3 px-6 py-3 border-b border-[#EBEBEB]"
                style={{ backgroundColor: `${currentAgent.color}08` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${currentAgent.color}20` }}
                >
                  <span className="text-base">{currentAgent.icon}</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#1A1A1A]">
                    {currentAgent.name}
                  </h2>
                  <p className="text-xs text-[#6B7280]">{currentAgent.title}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {/* Document list */}
                  {allDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setViewingDocument(doc)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                    >
                      <FileText size={11} />
                      {AGENTS[doc.agentRole].documentType}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <ChatArea
                messages={currentPhaseData.messages}
                currentPhase={currentPhase}
                isStreaming={isStreaming}
                streamingText={streamingText}
              />

              {/* Document ready banner */}
              {hasDocument && nextPhase && (
                <div className="mx-4 mb-2 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-[#16A34A]" />
                    <span className="text-sm text-[#15803D] font-medium">
                      {currentAgent.documentName} 已生成完成
                    </span>
                    <button
                      onClick={() => setViewingDocument(currentPhaseData.document!)}
                      className="text-xs text-[#16A34A] underline"
                    >
                      查看文件
                    </button>
                  </div>
                  <button
                    onClick={handleAdvancePhase}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-full hover:bg-[#333] transition-colors"
                  >
                    進入下一階段：{AGENTS[nextPhase].name}
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}

              {/* All phases completed */}
              {hasDocument && !nextPhase && (
                <div className="mx-4 mb-2 px-4 py-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl flex items-center justify-between">
                  <span className="text-sm text-[#0369A1] font-medium">
                    🎉 所有階段完成！專案已準備好部署。
                  </span>
                  <button
                    onClick={() => setViewingDocument(currentPhaseData.document!)}
                    className="text-xs text-[#0369A1] underline"
                  >
                    查看最終報告
                  </button>
                </div>
              )}

              {/* Input area */}
              <div className="px-4 pb-4 pt-2">
                <div className="flex items-end gap-2 border border-[#E5E7EB] rounded-2xl px-4 py-3 focus-within:border-[#1A1A1A] transition-colors bg-white shadow-sm">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`與 ${currentAgent.name} 對話...`}
                    rows={1}
                    disabled={isStreaming}
                    className="flex-1 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] resize-none border-none outline-none bg-transparent max-h-32 disabled:opacity-60"
                    style={{ lineHeight: '1.5' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] rounded-full text-white hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    {isStreaming ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1.5 text-center">
                  Enter 送出 · Shift+Enter 換行
                </p>
              </div>
            </div>

            {/* Document panel */}
            {viewingDocument && (
              <DocumentPanel
                document={viewingDocument}
                onClose={() => setViewingDocument(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rollback confirmation dialog */}
      {showRollbackConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                <AlertTriangle size={18} className="text-[#EF4444]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A]">確認回溯？</h3>
                <p className="text-xs text-[#6B7280]">此操作將清除後續階段的所有進度</p>
              </div>
            </div>
            <p className="text-sm text-[#374151] mb-6">
              回溯到「{AGENTS[showRollbackConfirm].name}」階段後，
              之後所有階段的對話和文件將被刪除，無法復原。
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRollbackConfirm(null)}
                className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-full hover:bg-[#F5F5F5] transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmRollback}
                className="px-4 py-2 text-sm text-white bg-[#EF4444] rounded-full hover:bg-[#DC2626] transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                確認回溯
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
