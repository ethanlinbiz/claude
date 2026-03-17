'use client';

import { Document } from '@/lib/types';
import { AGENTS } from '@/lib/agents';
import { Download, FileText, X } from 'lucide-react';

interface DocumentPanelProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentPanel({ document, onClose }: DocumentPanelProps) {
  const agent = AGENTS[document.agentRole];

  const handleDownload = () => {
    const blob = new Blob([document.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.documentName.replace(/\s+/g, '_')}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col border-l border-[#EBEBEB] bg-white w-[420px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-xs"
            style={{ backgroundColor: `${agent.color}20` }}
          >
            <FileText size={13} style={{ color: agent.color }} />
          </div>
          <span className="text-sm font-semibold text-[#1A1A1A]">{document.documentName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1A1A1A] px-2 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
          >
            <Download size={13} />
            下載
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-xs text-[#374151] leading-relaxed whitespace-pre-wrap font-mono">
          {document.content}
        </pre>
      </div>
      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#EBEBEB]">
        <p className="text-xs text-[#9CA3AF]">
          生成於 {new Date(document.generatedAt).toLocaleString('zh-TW')}
        </p>
      </div>
    </div>
  );
}
