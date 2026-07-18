import { v4 as uuidv4 } from "uuid";
import { LLMClient } from "./llm/llm-client";
import { AgentRegistry } from "./agents/agent-registry";
import { MemoryManager } from "./memory/memory-manager";
import type {
  AIRequest,
  AIResponse,
  Message,
  AgentType,
  AgentStatus,
} from "./types";

interface AgentSession {
  id: string;
  agentType: AgentType;
  messages: Message[];
  status: AgentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class AIOrchestrator {
  private llm: LLMClient;
  private agents: AgentRegistry;
  private memory: MemoryManager;
  private sessions: Map<string, AgentSession> = new Map();

  constructor() {
    this.llm = new LLMClient();
    this.agents = new AgentRegistry();
    this.memory = new MemoryManager(this.llm);
  }

  /**
   * Process a request with the specified AI agent
   */
  async process(request: AIRequest): Promise<AIResponse> {
    const agentConfig = this.agents.getAgent(request.agentType);

    // Build enriched messages with system prompt + context + memory
    const enrichedMessages = await this.buildMessages(request, agentConfig.systemPrompt);

    const response = await this.llm.generate({
      ...request,
      messages: enrichedMessages,
      options: {
        ...request.options,
        model: request.options?.model || agentConfig.model,
        temperature: request.options?.temperature ?? agentConfig.temperature,
        maxTokens: request.options?.maxTokens ?? agentConfig.maxTokens,
      },
    });

    // Store in memory
    if (request.context?.userId) {
      await this.memory.store({
        id: uuidv4(),
        userId: request.context.userId,
        type: "context",
        content: `[${request.agentType}] Q: ${request.messages[request.messages.length - 1]?.content?.substring(0, 200)}\nA: ${response.content.substring(0, 500)}`,
        source: `agent:${request.agentType}`,
        timestamp: new Date(),
      });
    }

    return response;
  }

  /**
   * Process a request with streaming support
   */
  async processStream(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    const agentConfig = this.agents.getAgent(request.agentType);
    const enrichedMessages = await this.buildMessages(request, agentConfig.systemPrompt);

    return this.llm.streamGenerate(
      {
        ...request,
        messages: enrichedMessages,
        options: {
          ...request.options,
          model: request.options?.model || agentConfig.model,
          temperature: request.options?.temperature ?? agentConfig.temperature,
          maxTokens: request.options?.maxTokens ?? agentConfig.maxTokens,
        },
      },
      onChunk
    );
  }

  /**
   * Create a new conversational session with an agent
   */
  createSession(agentType: AgentType): string {
    const id = uuidv4();
    const agentConfig = this.agents.getAgent(agentType);

    const session: AgentSession = {
      id,
      agentType,
      messages: [
        {
          id: uuidv4(),
          role: "system",
          content: agentConfig.systemPrompt,
          timestamp: new Date(),
        },
      ],
      status: "idle",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(id, session);
    return id;
  }

  /**
   * Send a message to an existing session
   */
  async sendMessage(
    sessionId: string,
    content: string,
    userId?: string
  ): Promise<AIResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session "${sessionId}" not found`);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    session.messages.push(userMessage);
    session.status = "processing";
    session.updatedAt = new Date();

    try {
      const response = await this.process({
        messages: session.messages,
        agentType: session.agentType,
        context: { userId },
      });

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
      };

      session.messages.push(assistantMessage);
      session.status = "idle";
      session.updatedAt = new Date();

      return response;
    } catch (error) {
      session.status = "error";
      session.updatedAt = new Date();
      throw error;
    }
  }

  /**
   * Get session history
   */
  getSession(sessionId: string): AgentSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Get context from memory for a user
   */
  async getContext(userId: string, query: string): Promise<string> {
    const relevantMemories = await this.memory.search(userId, query, 5);
    if (relevantMemories.length === 0) return "";

    return (
      "Relevant context from previous interactions:\n" +
      relevantMemories
        .map((m, i) => `[${i + 1}] ${m.content.substring(0, 300)}`)
        .join("\n\n")
    );
  }

  private async buildMessages(
    request: AIRequest,
    systemPrompt: string
  ): Promise<Message[]> {
    const messages: Message[] = [
      {
        id: uuidv4(),
        role: "system",
        content: systemPrompt,
        timestamp: new Date(),
      },
    ];

    // Add memory context if userId is provided
    if (request.context?.userId) {
      const lastUserMessage = request.messages[request.messages.length - 1];
      if (lastUserMessage) {
        const context = await this.getContext(
          request.context.userId,
          lastUserMessage.content
        );
        if (context) {
          messages.push({
            id: uuidv4(),
            role: "system",
            content: context,
            timestamp: new Date(),
          });
        }
      }
    }

    messages.push(...request.messages);
    return messages;
  }

  // ── Agent Management ──

  getAgents() {
    return this.agents.getEnabledAgents();
  }

  getAgentConfig(type: AgentType) {
    return this.agents.getAgent(type);
  }

  updateAgent(type: AgentType, config: Partial<{ enabled: boolean }>) {
    if (config.enabled !== undefined) {
      this.agents.setAgentEnabled(type, config.enabled);
    }
  }

  // ── Memory Management ──

  async storeMemory(
    userId: string,
    content: string,
    type: "decision" | "preference" | "context" | "learning" = "context"
  ) {
    await this.memory.store({
      id: uuidv4(),
      userId,
      type,
      content,
      source: "manual",
      timestamp: new Date(),
    });
  }

  async searchMemory(userId: string, query: string) {
    return this.memory.search(userId, query);
  }
}
