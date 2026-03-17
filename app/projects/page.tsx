'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import NewProjectModal from '@/components/NewProjectModal';
import { getProjects, deleteProject } from '@/lib/projectStore';
import { Project } from '@/lib/types';
import { AGENTS } from '@/lib/agents';
import { ArrowRight, Clock, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () => setProjects(getProjects().sort((a, b) => b.createdAt - a.createdAt));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: string) => {
    deleteProject(id);
    load();
    setDeleteConfirm(null);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[60px] flex flex-col">
        <TopBar title="我的專案" />
        <main className="flex-1 overflow-y-auto pt-11 px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1A1A1A]">我的專案</h1>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
              >
                + 新專案
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20 text-[#9CA3AF]">
                <p className="text-sm">還沒有任何專案</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-3 text-sm text-[#1A1A1A] underline"
                >
                  建立第一個專案
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => {
                  const currentAgent = AGENTS[project.currentPhase];
                  const completedPhases = Object.values(project.phases).filter(
                    (p) => p.status === 'completed'
                  ).length;
                  const isDeleting = deleteConfirm === project.id;

                  return (
                    <div
                      key={project.id}
                      className="p-4 border border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => router.push(`/project/${project.id}`)}
                          className="flex-1 text-left min-w-0"
                        >
                          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">
                            {project.name}
                          </h3>
                          <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">
                            {project.description}
                          </p>
                        </button>
                        <div className="flex items-center gap-1">
                          {isDeleting ? (
                            <>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="text-xs text-[#EF4444] px-2 py-1 rounded-lg hover:bg-[#FEF2F2] transition-colors"
                              >
                                確認刪除
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs text-[#6B7280] px-2 py-1 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                              >
                                取消
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(project.id)}
                              className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/project/${project.id}`)}
                            className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition-colors"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
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
                        <div className="flex gap-1 ml-auto items-center">
                          <span className="text-xs text-[#9CA3AF] mr-1">{completedPhases}/6</span>
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
