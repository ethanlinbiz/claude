'use client';

import { RefreshCw, Monitor } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = 'Prism - VibeCoingSolution' }: TopBarProps) {
  return (
    <header className="fixed top-0 left-[60px] right-0 h-11 border-b border-[#EBEBEB] bg-white flex items-center justify-between px-4 z-40">
      <div />
      <span className="text-sm text-[#6B7280] font-medium">{title}</span>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1A1A1A] px-2 py-1 rounded hover:bg-[#F5F5F5] transition-colors">
          <RefreshCw size={13} />
          Remix
        </button>
        <button className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1A1A1A] px-2 py-1 rounded hover:bg-[#F5F5F5] transition-colors">
          <Monitor size={13} />
          Device
        </button>
        <div className="w-px h-4 bg-[#EBEBEB]" />
        <button className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A1A] rounded hover:bg-[#F5F5F5]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A1A] rounded hover:bg-[#F5F5F5]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
