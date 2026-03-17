export type AgentRole =
  | 'requirements'
  | 'design'
  | 'development'
  | 'testing'
  | 'operations'
  | 'retrospective';

export interface AgentConfig {
  role: AgentRole;
  name: string;
  title: string;
  description: string;
  documentType: string;
  documentName: string;
  systemPrompt: string;
  color: string;
  icon: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentRole?: AgentRole;
  timestamp: number;
}

export interface Document {
  id: string;
  agentRole: AgentRole;
  documentName: string;
  content: string;
  generatedAt: number;
}

export interface Phase {
  agentRole: AgentRole;
  status: 'pending' | 'active' | 'completed';
  messages: Message[];
  document: Document | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  currentPhase: AgentRole;
  phases: Record<AgentRole, Phase>;
}
