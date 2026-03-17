'use client';

import { Project, AgentRole, Phase, Message, Document } from './types';
import { AGENT_PHASES } from './agents';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'prism_projects';

function createInitialPhases(): Record<AgentRole, Phase> {
  const phases: Partial<Record<AgentRole, Phase>> = {};
  for (const role of AGENT_PHASES) {
    phases[role] = {
      agentRole: role,
      status: role === 'requirements' ? 'active' : 'pending',
      messages: [],
      document: null,
    };
  }
  return phases as Record<AgentRole, Phase>;
}

export function createProject(name: string, description: string): Project {
  return {
    id: uuidv4(),
    name,
    description,
    createdAt: Date.now(),
    currentPhase: 'requirements',
    phases: createInitialPhases(),
  };
}

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getProject(id: string): Project | null {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
}

export function saveProject(project: Project): void {
  if (typeof window === 'undefined') return;
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addMessage(
  project: Project,
  phase: AgentRole,
  message: Omit<Message, 'id' | 'timestamp'>
): Project {
  const newMsg: Message = {
    ...message,
    id: uuidv4(),
    timestamp: Date.now(),
  };
  const updated = { ...project };
  updated.phases = { ...updated.phases };
  updated.phases[phase] = {
    ...updated.phases[phase],
    messages: [...updated.phases[phase].messages, newMsg],
  };
  return updated;
}

export function setPhaseDocument(
  project: Project,
  phase: AgentRole,
  content: string,
  documentName: string
): Project {
  const doc: Document = {
    id: uuidv4(),
    agentRole: phase,
    documentName,
    content,
    generatedAt: Date.now(),
  };
  const updated = { ...project };
  updated.phases = { ...updated.phases };
  updated.phases[phase] = {
    ...updated.phases[phase],
    document: doc,
    status: 'completed',
  };
  return updated;
}

export function advancePhase(project: Project, nextPhase: AgentRole): Project {
  const updated = { ...project };
  updated.currentPhase = nextPhase;
  updated.phases = { ...updated.phases };
  updated.phases[nextPhase] = {
    ...updated.phases[nextPhase],
    status: 'active',
  };
  return updated;
}

export function rollbackToPhase(project: Project, targetPhase: AgentRole): Project {
  const targetIdx = AGENT_PHASES.indexOf(targetPhase);
  const updated = { ...project };
  updated.currentPhase = targetPhase;
  updated.phases = { ...updated.phases };

  // Reset all phases from target onwards
  for (let i = targetIdx; i < AGENT_PHASES.length; i++) {
    const role = AGENT_PHASES[i];
    updated.phases[role] = {
      agentRole: role,
      status: i === targetIdx ? 'active' : 'pending',
      messages: [],
      document: null,
    };
  }
  return updated;
}

export function deleteProject(id: string): void {
  if (typeof window === 'undefined') return;
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
