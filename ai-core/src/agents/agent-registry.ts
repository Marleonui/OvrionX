import type { AgentConfig, AgentType } from "../types";

const systemPrompts: Record<AgentType, string> = {
  executive: `You are the ORION X Executive AI Agent — a strategic advisor to management.
Your role is to analyze business data, provide strategic recommendations, assess risks,
and generate executive summaries. Always think in terms of ROI, resource optimization,
and long-term business value. Support your recommendations with data and clear reasoning.`,

  productivity: `You are the ORION X Productivity AI Agent — a personal assistant for every user.
Your role is to optimize daily schedules, prioritize tasks using the Eisenhower matrix,
prepare for meetings, and help users focus on what matters most. You learn from user
behavior and proactively suggest improvements to their workflow.`,

  research: `You are the ORION X Research AI Agent — a data analyst and researcher.
Your role is to conduct deep research, analyze internal and external data, generate
reports with proper citations, identify trends, and provide data-driven insights.
Always verify facts and cite sources when possible.`,

  automation: `You are the ORION X Automation AI Agent — a workflow and process automation specialist.
Your role is to help users create no-code automations, detect repetitive tasks that can
be automated, design trigger-action workflows, and integrate with external systems.
Be precise about conditions, triggers, and expected outcomes.`,

  security: `You are the ORION X Security AI Agent — a cybersecurity guardian.
Your role is to monitor access patterns, detect anomalies, assess threat levels,
ensure compliance with GDPR/HIPAA/ISO27001, and respond to security incidents.
Be precise, cautious, and follow the principle of least privilege.`,

  communication: `You are the ORION X Communication AI Agent — a collaboration assistant.
Your role is to summarize meetings, extract action items from conversations,
suggest smart replies, analyze communication sentiment, and facilitate team
collaboration. Be diplomatic, clear, and constructive.`,

  assistant: `You are the ORION X AI Assistant — a general-purpose intelligent assistant.
You help users with a wide range of tasks: answering questions, generating content,
analyzing data, solving problems, and providing explanations. Be helpful, accurate,
and thorough. When unsure, acknowledge uncertainty rather than guessing.`,
};

const agentDefaults: Record<AgentType, Omit<AgentConfig, "type">> = {
  executive: {
    name: "Executive Agent",
    description: "Strategic advisor for management decisions",
    systemPrompt: systemPrompts.executive,
    model: "gpt-4o",
    provider: "openai",
    temperature: 0.5,
    maxTokens: 4096,
    enabled: true,
  },
  productivity: {
    name: "Productivity Agent",
    description: "Personal assistant for daily workflow optimization",
    systemPrompt: systemPrompts.productivity,
    model: "gpt-4o",
    provider: "openai",
    temperature: 0.6,
    maxTokens: 2048,
    enabled: true,
  },
  research: {
    name: "Research Agent",
    description: "Data analyst and research specialist",
    systemPrompt: systemPrompts.research,
    model: "claude-3-opus-20240229",
    provider: "anthropic",
    temperature: 0.3,
    maxTokens: 8192,
    enabled: true,
  },
  automation: {
    name: "Automation Agent",
    description: "Workflow and process automation specialist",
    systemPrompt: systemPrompts.automation,
    model: "gpt-4o",
    provider: "openai",
    temperature: 0.4,
    maxTokens: 4096,
    enabled: true,
  },
  security: {
    name: "Security Agent",
    description: "Cybersecurity monitoring and threat detection",
    systemPrompt: systemPrompts.security,
    model: "claude-3-haiku-20240307",
    provider: "anthropic",
    temperature: 0.2,
    maxTokens: 2048,
    enabled: true,
  },
  communication: {
    name: "Communication Agent",
    description: "Meeting summaries, action items, smart replies",
    systemPrompt: systemPrompts.communication,
    model: "gpt-4o-mini",
    provider: "openai",
    temperature: 0.5,
    maxTokens: 2048,
    enabled: true,
  },
  assistant: {
    name: "Assistant Agent",
    description: "General-purpose AI assistant",
    systemPrompt: systemPrompts.assistant,
    model: "gpt-4o",
    provider: "openai",
    temperature: 0.7,
    maxTokens: 4096,
    enabled: true,
  },
};

export class AgentRegistry {
  private agents: Map<AgentType, AgentConfig> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    for (const [type, config] of Object.entries(agentDefaults)) {
      this.agents.set(type as AgentType, {
        type: type as AgentType,
        ...config,
      });
    }
  }

  getAgent(type: AgentType): AgentConfig {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`Agent "${type}" not found in registry`);
    }
    if (!agent.enabled) {
      throw new Error(`Agent "${type}" is disabled`);
    }
    return agent;
  }

  getAllAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  getEnabledAgents(): AgentConfig[] {
    return this.getAllAgents().filter((a) => a.enabled);
  }

  updateAgent(type: AgentType, config: Partial<AgentConfig>): AgentConfig {
    const existing = this.agents.get(type);
    if (!existing) {
      throw new Error(`Agent "${type}" not found`);
    }
    const updated = { ...existing, ...config };
    this.agents.set(type, updated);
    return updated;
  }

  setAgentEnabled(type: AgentType, enabled: boolean): void {
    const agent = this.agents.get(type);
    if (agent) {
      agent.enabled = enabled;
    }
  }
}
