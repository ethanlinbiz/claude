'use client';

import { AGENT_PHASES, AGENTS } from '@/lib/agents';
import { Phase, AgentRole, Project } from '@/lib/types';
import { Check, RotateCcw } from 'lucide-react';

interface PhaseProgressProps {
  project: Project;
  onRollback: (phase: AgentRole) => void;
}

export default function PhaseProgress({ project, onRollback }: PhaseProgressProps) {
  return (
    <div className="border-b border-[#EBEBEB] px-6 py-3 flex items-center gap-2 overflow-x-auto">
      {AGENT_PHASES.map((role, idx) => {
        const agent = AGENTS[role];
        const phase = project.phases[role];
        const isCurrent = project.currentPhase === role;
        const isCompleted = phase.status === 'completed';
        const isPending = phase.status === 'pending';

        return (
          <div key={role} className="flex items-center gap-2 flex-shrink-0">
            {idx > 0 && (
              <div
                className={`w-8 h-px ${
                  isCompleted || isCurrent ? 'bg-[#1A1A1A]' : 'bg-[#E5E7EB]'
                }`}
              />
            )}
            <div className="flex items-center gap-1.5 group relative">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                  isCompleted
                    ? 'bg-[#1A1A1A] text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-[#1A1A1A] text-[#1A1A1A]'
                    : 'bg-[#F5F5F5] text-[#9CA3AF]'
                }`}
              >
                {isCompleted ? <Check size={13} /> : agent.icon}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isCurrent
                    ? 'text-[#1A1A1A]'
                    : isCompleted
                    ? 'text-[#6B7280]'
                    : 'text-[#9CA3AF]'
                }`}
              >
                {agent.name}
              </span>
              {/* Rollback button for completed phases */}
              {isCompleted && (
                <button
                  onClick={() => onRollback(role)}
                  title="回溯到此階段"
                  className="opacity-0 group-hover:opacity-100 ml-1 text-[#9CA3AF] hover:text-[#EF4444] transition-all"
                >
                  <RotateCcw size={11} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
