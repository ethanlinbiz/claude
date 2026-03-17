'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, PlusCircle, FolderOpen, Settings, Globe, LayoutGrid, Database, Terminal, Rocket } from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isProjects = pathname.startsWith('/projects') || pathname.startsWith('/project');

  return (
    <aside className="fixed left-0 top-0 h-full w-[60px] bg-[#F9F9F9] border-r border-[#EBEBEB] flex flex-col items-center py-3 z-50">
      {/* Logo */}
      <button
        onClick={() => router.push('/')}
        className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center mb-4 hover:bg-[#333] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2L16 14H2L9 2Z" fill="white" />
        </svg>
      </button>

      {/* Main nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <NavBtn
          icon={<Home size={18} />}
          label="首頁"
          active={isHome}
          onClick={() => router.push('/')}
        />
        <NavBtn
          icon={<PlusCircle size={18} />}
          label="新專案"
          onClick={() => router.push('/?new=1')}
        />
        <NavBtn
          icon={<FolderOpen size={18} />}
          label="我的專案"
          active={isProjects}
          onClick={() => router.push('/projects')}
        />
        <div className="w-8 h-px bg-[#EBEBEB] my-2" />
        <NavBtn icon={<LayoutGrid size={18} />} label="流程階段" />
        <NavBtn icon={<Database size={18} />} label="文件庫" />
        <NavBtn icon={<Terminal size={18} />} label="程式碼" />
        <NavBtn icon={<Rocket size={18} />} label="部署" />
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1">
        <NavBtn icon={<Settings size={18} />} label="設定" />
        <NavBtn icon={<Globe size={18} />} label="語言" />
        <div className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white text-xs font-medium mt-1 cursor-pointer">
          U
        </div>
      </div>
    </aside>
  );
}

function NavBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        active
          ? 'bg-[#1A1A1A] text-white'
          : 'text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-[#EBEBEB]'
      }`}
    >
      {icon}
    </button>
  );
}
