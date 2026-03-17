'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { createProject, saveProject } from '@/lib/projectStore';
import { useRouter } from 'next/navigation';

interface NewProjectModalProps {
  onClose: () => void;
}

export default function NewProjectModal({ onClose }: NewProjectModalProps) {
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = () => {
    if (!description.trim()) return;
    setIsCreating(true);

    // Extract a name from description (first 30 chars)
    const name = description.trim().slice(0, 40) + (description.length > 40 ? '...' : '');
    const project = createProject(name, description.trim());
    saveProject(project);

    router.push(`/project/${project.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleCreate();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const examples = [
    '我想開發一個線上預約系統，讓客戶可以預約美髮沙龍的服務時段',
    '建立一個任務管理 App，支援團隊協作和進度追蹤',
    '打造一個電商平台，專門販售手工藝品，支援金流和物流整合',
    '開發一個學習平台，讓老師可以上傳課程、學生可以線上學習',
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#1A1A1A]">開始定義新專案</h2>
              <p className="text-xs text-[#9CA3AF]">用自然語言描述你的軟體想法</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="text-sm font-medium text-[#374151] block mb-2">
            描述你的軟體想法
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例如：我想開發一個線上預約系統，讓客戶可以預約美髮沙龍的服務時段，支援線上付款和提醒通知..."
            className="w-full h-36 px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] border border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all"
            autoFocus
          />
          <p className="text-xs text-[#9CA3AF] mt-1.5">
            按 ⌘Enter 快速開始
          </p>

          {/* Examples */}
          <div className="mt-4">
            <p className="text-xs font-medium text-[#9CA3AF] mb-2">快速範例</p>
            <div className="grid grid-cols-2 gap-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setDescription(ex)}
                  className="text-left text-xs text-[#6B7280] px-3 py-2.5 border border-[#E5E7EB] rounded-lg hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all line-clamp-2"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F0] flex items-center justify-between">
          <p className="text-xs text-[#9CA3AF]">
            AI 將引導你完成 6 個開發階段
          </p>
          <button
            onClick={handleCreate}
            disabled={!description.trim() || isCreating}
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? '建立中...' : '開始 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
