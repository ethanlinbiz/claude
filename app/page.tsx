'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import NewProjectModal from '@/components/NewProjectModal';
import { getProjects } from '@/lib/projectStore';
import { Project } from '@/lib/types';
import { AGENTS } from '@/lib/agents';
import { Clock, ArrowRight } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setShowModal(true);
    }
    setRecentProjects(getProjects().slice(0, 3));
  }, [searchParams]);

  const handleModalClose = () => {
    setShowModal(false);
    router.replace('/');
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[60px] flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col items-center justify-center pt-11 px-6">
          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#1A1A1A] rounded-[22px] flex items-center justify-center mb-6 shadow-lg">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 3L25 22H3L14 3Z" fill="white" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-3">
                歡迎來到 Prism
              </h1>
              <p className="text-[14px] text-[#6B7280] max-w-[380px] leading-relaxed mb-8">
                從混沌到清晰，從靈感到上線。Prism 陪您，將模糊想法變成直覺流暢的數位體驗。
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-[#1A1A1A] text-white text-[15px] font-medium rounded-full hover:bg-[#333] transition-colors shadow-sm"
              >
                + 開始定義新專案
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#1A1A1A]">我的專案</h1>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
                >
                  + 新專案
                </button>
              </div>
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => router.push(`/project/${project.id}`)}
                  />
                ))}
              </div>
              {getProjects().length > 3 && (
                <button
                  onClick={() => router.push('/projects')}
                  className="mt-4 text-sm text-[#6B7280] hover:text-[#1A1A1A] flex items-center gap-1"
                >
                  查看所有專案 <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </main>
      </div>
      {showModal && <NewProjectModal onClose={handleModalClose} />}
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const currentAgent = AGENTS[project.currentPhase];
  const completedPhases = Object.values(project.phases).filter(
    (p) => p.status === 'completed'
  ).length;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border border-[#E5E7EB] rounded-xl hover:border-[#1A1A1A] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">{project.name}</h3>
          <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{project.description}</p>
        </div>
        <ArrowRight
          size={15}
          className="text-[#9CA3AF] group-hover:text-[#1A1A1A] ml-3 mt-0.5 flex-shrink-0 transition-colors"
        />
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: `${currentAgent.color}15`,
            color: currentAgent.color,
          }}
        >
          {currentAgent.icon} {currentAgent.name}
        </span>
        <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
          <Clock size={11} />
          {new Date(project.createdAt).toLocaleDateString('zh-TW')}
        </span>
        <div className="flex gap-1 ml-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-1 rounded-full ${
                i < completedPhases ? 'bg-[#1A1A1A]' : 'bg-[#E5E7EB]'
              }`}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
