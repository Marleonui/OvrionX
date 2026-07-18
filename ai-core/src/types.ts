export type AgentType =
  | "executive"
  | "productivity"
  | "research"
  | "automation"
  | "security"
  | "communication"
  | "assistant";

export type AgentStatus = "idle" | "processing" | "error";

export type LLMProvider = "openai" | "anthropic";

export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AIRequest {
  messages: Message[];
  agentType: AgentType;
  context?: {
    userId?: string;
    projectId?: string;
    documentIds?: string[];
  };
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    stream?: boolean;
  };
}

export interface AIResponse {
  id: string;
  content: string;
  agentType: AgentType;
  model: string;
  provider: LLMProvider;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  provider: LLMProvider;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export interface MemoryEntry {
  id: string;
  userId: string;
  type: "decision" | "preference" | "context" | "learning";
  content: string;
  source: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface EmbeddingResult {
  vector: number[];
  model: string;
  dimensions: number;
}
