import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { v4 as uuidv4 } from "uuid";
import type { AIRequest, AIResponse, Message, LLMProvider } from "../types";

export class LLMClient {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const provider = this.resolveProvider(request);
    const startTime = Date.now();

    if (provider === "openai" && this.openai) {
      return this.callOpenAI(request);
    } else if (provider === "anthropic" && this.anthropic) {
      return this.callAnthropic(request);
    }

    throw new Error(
      `No LLM provider configured for ${request.options?.model || "default"}`
    );
  }

  async streamGenerate(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    const provider = this.resolveProvider(request);

    if (provider === "openai" && this.openai) {
      return this.streamOpenAI(request, onChunk);
    } else if (provider === "anthropic" && this.anthropic) {
      return this.streamAnthropic(request, onChunk);
    }

    throw new Error("No LLM provider configured");
  }

  async createEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      throw new Error("OpenAI API key not configured for embeddings");
    }

    const response = await this.openai.embeddings.create({
      model: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-large",
      input: text,
    });

    return response.data[0]?.embedding || [];
  }

  private resolveProvider(request: AIRequest): LLMProvider {
    const model = request.options?.model || process.env.AI_MODEL_DEFAULT || "gpt-4o";

    if (model.startsWith("gpt") || model.startsWith("text-")) return "openai";
    if (model.startsWith("claude")) return "anthropic";

    return (process.env.AI_MODEL_DEFAULT?.startsWith("claude")
      ? "anthropic"
      : "openai") as LLMProvider;
  }

  private formatMessages(messages: Message[]) {
    return messages.map((m) => ({
      role: m.role as "system" | "user" | "assistant",
      content: m.content,
    }));
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const model =
      request.options?.model || process.env.AI_MODEL_DEFAULT || "gpt-4o";

    const completion = await this.openai!.chat.completions.create({
      model,
      messages: this.formatMessages(request.messages),
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.maxTokens ?? 4096,
    });

    const choice = completion.choices[0];

    return {
      id: uuidv4(),
      content: choice?.message?.content || "",
      agentType: request.agentType,
      model,
      provider: "openai",
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
      timestamp: new Date(),
    };
  }

  private async streamOpenAI(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    const model =
      request.options?.model || process.env.AI_MODEL_DEFAULT || "gpt-4o";
    let fullContent = "";

    const stream = await this.openai!.chat.completions.create({
      model,
      messages: this.formatMessages(request.messages),
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.maxTokens ?? 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;
        onChunk(content);
      }
    }

    return {
      id: uuidv4(),
      content: fullContent,
      agentType: request.agentType,
      model,
      provider: "openai",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      timestamp: new Date(),
    };
  }

  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    const model =
      request.options?.model || "claude-3-opus-20240229";

    const systemMessages = request.messages.filter((m) => m.role === "system");
    const conversationMessages = request.messages.filter(
      (m) => m.role !== "system"
    );

    const msg = await this.anthropic!.messages.create({
      model,
      system: systemMessages.map((m) => m.content).join("\n"),
      messages: conversationMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      max_tokens: request.options?.maxTokens ?? 4096,
      temperature: request.options?.temperature ?? 0.7,
    });

    const content =
      msg.content
        .filter((block) => block.type === "text")
        .map((block) => (block as { text: string }).text)
        .join("\n") || "";

    return {
      id: uuidv4(),
      content,
      agentType: request.agentType,
      model,
      provider: "anthropic",
      usage: {
        promptTokens: msg.usage?.input_tokens || 0,
        completionTokens: msg.usage?.output_tokens || 0,
        totalTokens:
          (msg.usage?.input_tokens || 0) + (msg.usage?.output_tokens || 0),
      },
      timestamp: new Date(),
    };
  }

  private async streamAnthropic(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    const model =
      request.options?.model || "claude-3-opus-20240229";
    let fullContent = "";

    const systemMessages = request.messages.filter((m) => m.role === "system");
    const conversationMessages = request.messages.filter(
      (m) => m.role !== "system"
    );

    const stream = await this.anthropic!.messages.stream({
      model,
      system: systemMessages.map((m) => m.content).join("\n"),
      messages: conversationMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      max_tokens: request.options?.maxTokens ?? 4096,
      temperature: request.options?.temperature ?? 0.7,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta?.type === "text_delta"
      ) {
        const text = event.delta.text || "";
        if (text) {
          fullContent += text;
          onChunk(text);
        }
      }
    }

    return {
      id: uuidv4(),
      content: fullContent,
      agentType: request.agentType,
      model,
      provider: "anthropic",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      timestamp: new Date(),
    };
  }
}
